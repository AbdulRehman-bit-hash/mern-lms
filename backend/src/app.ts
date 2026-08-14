require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { ErrorMiddleware } from "./middleware/error";
import { generalLimiter } from "./middleware/rateLimiter";
import { stripeWebhook } from "./controllers/payment.controller";

import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRoute from "./routes/notification.route";
import layoutRouter from "./routes/layout.route";
import paymentRouter from "./routes/payment.route";

// IMPORTANT: this must be registered before express.json() below. Stripe
// signs the raw, exact bytes of the webhook payload — if express.json()
// parses the body into a JS object first, that raw byte-for-byte data is
// gone, and Stripe's signature verification will always fail. express.raw()
// here keeps the body as an untouched Buffer for this one route only;
// every other route still gets normal JSON parsing further down.
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Sets a set of sane security-related HTTP headers (CSP, no-sniff,
// frameguard, etc.) with minimal configuration needed.
app.use(helmet());

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// Strips any request keys starting with "$" or containing "." from
// req.body/req.query/req.params — closes off NoSQL injection attempts like
// passing { "email": { "$ne": null } } to a login/find query.
app.use(mongoSanitize());

// A generous baseline rate limit across the whole API; specific
// auth-sensitive routes layer a much stricter limit on top (see
// user.route.ts).
app.use(generalLimiter);

// CORS — falls back to localhost:3000 rather than silently allowing an
// unrestricted origin if ORIGIN isn't set in .env.
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRoute,
  layoutRouter,
  paymentRouter
);

// Health check
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is working" });
});

// Unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
