import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import NotificationModel from "../models/notification.model";
import { redis } from "./redis";
import { emitNewNotification } from "../socket/socket";
import sendMail from "./sendMail";

interface FulfillOrderParams {
  userId: string;
  courseId: string;
  paymentInfo: any;
}

// Creates the order record, grants course access, and fires all the usual
// side effects (Redis session sync, purchase count, notification, socket
// event, confirmation email). Callers are responsible for checking the
// user doesn't already own the course before calling this — that's the
// dedup guard that keeps a purchase from being fulfilled twice if both the
// frontend's direct create-order call AND the Stripe webhook happen to
// fire for the same payment.
export async function fulfillOrder({
  userId,
  courseId,
  paymentInfo,
}: FulfillOrderParams) {
  const user = await userModel.findById(userId);
  const course = await CourseModel.findById(courseId);
  if (!user || !course) return null;

  const order = await OrderModel.create({
    courseId,
    userId,
    payment_info: paymentInfo,
  });

  user.courses.push({ courseId });
  await user.save();
  await redis.set(String(user._id), JSON.stringify(user));

  course.purchased = (course.purchased || 0) + 1;
  await course.save();

  await NotificationModel.create({
    userId,
    title: "New Order",
    message: `You have a new order for ${course.name}`,
  });

  emitNewNotification({
    title: "New Order",
    message: `${user.name} just enrolled in ${course.name}`,
    createdAt: new Date(),
  });

  try {
    await sendMail({
      email: user.email,
      subject: "Order Confirmation",
      template: "order-confirmation.ejs",
      data: {
        order: {
          _id: (course._id as unknown as string).toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      },
    });
  } catch (error: any) {
    // Non-fatal: don't block fulfillment if the confirmation email fails
  }

  return order;
}
