import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import { generateLast12MonthsData } from "../utils/analyticsGenerator";
import { fulfillOrder } from "../utils/fulfillOrder";
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// ------------------- Create order -------------------

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.courses.some(
        (course: any) => course.courseId.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Paid courses require a real, successful Stripe payment before the
      // order is created — this is what stops someone from just calling
      // this endpoint directly with fake payment_info to get a course for
      // free. Free courses (price 0) skip this entirely.
      //
      // This check is defense-in-depth: the Stripe webhook (see
      // payment.controller.ts) is the authoritative fulfillment path and
      // will grant access even if this request never completes (e.g. the
      // browser closes right after payment). This request completing
      // successfully just means the user doesn't have to wait for the
      // webhook round-trip before seeing "enrolled."
      if (course.price > 0) {
        if (!payment_info || !(payment_info as any).id) {
          return next(new ErrorHandler("Payment information is required", 400));
        }

        const paymentIntentId = (payment_info as any).id;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );

        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment not authorized", 400));
        }
      }

      const order = await fulfillOrder({
        userId: String(user?._id),
        courseId,
        paymentInfo: payment_info,
      });

      res.status(201).json({ success: true, order });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Get the logged-in user's own order history -------------------

export const getUserOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, orders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Admin: get all orders -------------------

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, orders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Admin: order analytics -------------------

export const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await generateLast12MonthsData(OrderModel);
      res.status(200).json({ success: true, orders });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
