import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderRules } from "../middleware/validators";
import {
  createOrder,
  getAllOrders,
  getOrderAnalytics,
  getUserOrders,
} from "../controllers/order.controller";

const orderRouter = express.Router();

orderRouter.post(
  "/create-order",
  isAuthenticated,
  validate(createOrderRules),
  createOrder
);

orderRouter.get("/my-orders", isAuthenticated, getUserOrders);

orderRouter.get(
  "/admin/get-orders",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.get(
  "/admin/order-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

export default orderRouter;
