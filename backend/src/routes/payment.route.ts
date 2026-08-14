import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  newPayment,
  sendStripePublishableKey,
} from "../controllers/payment.controller";

// Note: the Stripe webhook route (/api/v1/payment/webhook) is NOT defined
// here — it's registered directly in app.ts, before the global JSON body
// parser runs, because Stripe's signature verification needs the raw
// request body rather than an already-parsed object.

const paymentRouter = express.Router();

paymentRouter.get(
  "/payment/stripe-publishable-key",
  sendStripePublishableKey
);

paymentRouter.post("/payment", isAuthenticated, newPayment);

export default paymentRouter;
