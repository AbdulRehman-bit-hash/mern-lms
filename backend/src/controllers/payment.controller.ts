import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import { fulfillOrder } from "../utils/fulfillOrder";
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// ------------------- Send publishable key to the frontend -------------------

export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// ------------------- Create a payment intent -------------------

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, courseId } = req.body;
      const userId = req.user?._id;

      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Invalid payment amount", 400));
      }
      if (!courseId) {
        return next(new ErrorHandler("courseId is required", 400));
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects the smallest currency unit (cents)
        currency: "usd",
        metadata: {
          company: "Ledger LMS",
          // These two are what let the webhook below know which user
          // bought which course — without them, a payment succeeding on
          // Stripe's end would have no way to be tied back to an order.
          userId: String(userId),
          courseId: String(courseId),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Stripe webhook: authoritative payment fulfillment -------------------
//
// Why this exists: the normal checkout flow (see order.controller.ts)
// fulfills the order from the browser, right after Stripe confirms the
// payment succeeded. That works for the vast majority of purchases, but it
// depends on that follow-up request actually completing — if the browser
// crashes, the tab closes, or the network drops in the second between
// "payment succeeded" and "order created," the customer has been charged
// with no course access and no automatic way to recover.
//
// This webhook is Stripe calling OUR server directly, independent of the
// customer's browser, whenever a payment intent succeeds. It's the
// authoritative fulfillment path — the frontend-driven flow is really just
// an optimization so the user doesn't have to wait for this webhook's
// round-trip before seeing "you're enrolled."
//
// NOTE: this handler is deliberately NOT wrapped in CatchAsyncError. Stripe
// expects very specific status codes to decide whether to retry
// (non-2xx = retry), and mixing that with the app's normal JSON error
// middleware risks sending back a response shape or status Stripe doesn't
// expect.
export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    // req.body must be the RAW request buffer here, not JSON-parsed — see
    // the route registration in app.ts for why that's guaranteed.
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.log("Stripe webhook signature verification failed:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { userId, courseId } = paymentIntent.metadata || {};

    if (userId && courseId) {
      try {
        const user = await userModel.findById(userId);
        const alreadyOwnsCourse = user?.courses?.some(
          (c: any) => c.courseId.toString() === courseId
        );

        // If the user already owns this course, the frontend's own
        // create-order call already fulfilled it — this webhook arriving
        // afterward (or even before, in a race) is a no-op rather than a
        // duplicate order.
        if (user && !alreadyOwnsCourse) {
          await fulfillOrder({
            userId,
            courseId,
            paymentInfo: { id: paymentIntent.id, status: paymentIntent.status },
          });
          console.log(
            `Webhook fulfilled order: user ${userId}, course ${courseId}`
          );
        }
      } catch (error: any) {
        console.log("Webhook order fulfillment failed:", error.message);
        // Returning a 500 here tells Stripe to retry this webhook delivery
        // later, which is the right behavior for a transient failure (e.g.
        // a momentary database hiccup) rather than silently losing the
        // fulfillment.
        res.status(500).json({ received: false });
        return;
      }
    }
  }

  res.status(200).json({ received: true });
};
