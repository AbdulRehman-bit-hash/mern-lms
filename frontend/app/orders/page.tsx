"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Reveal from "@/components/Reveal";

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery(
    {},
    { skip: !user }
  );
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCoursesQuery({}, { skip: !user });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="text-ink/60 mb-4">Log in to see your order history.</p>
        <Link href="/login" className="text-ledger hover:underline">
          Go to login &rarr;
        </Link>
      </div>
    );
  }

  const isLoading = ordersLoading || coursesLoading;
  const orders = ordersData?.orders || [];
  const courses = coursesData?.courses || [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Reveal>
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
          Your ledger
        </p>
        <h1 className="font-display text-4xl text-ink mb-2">Order history</h1>
        <p className="text-ink/60 mb-10">
          {orders.length} order{orders.length === 1 ? "" : "s"} on record.
        </p>
      </Reveal>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : orders.length ? (
        <div className="flex flex-col gap-3">
          {orders.map((order: any, i: number) => {
            const course = courses.find((c: any) => c._id === order.courseId);
            const isPaid = !!order.payment_info?.id;

            return (
              <Reveal key={order._id} delayMs={(i % 5) * 60}>
                <Link
                  href={
                    course ? `/course/${course._id}/learn` : "/my-courses"
                  }
                  className="flex items-center gap-4 border border-ink/10 bg-surface rounded-sm p-4 hover:border-ledger/40 transition-colors"
                >
                  <div className="relative w-20 aspect-video flex-shrink-0 bg-surface-2 rounded-sm overflow-hidden">
                    {course?.thumbnail?.url && (
                      <Image
                        src={course.thumbnail.url}
                        alt={course.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-medium truncate">
                      {course?.name || "Course no longer available"}
                    </p>
                    <p className="text-ink/50 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                      isPaid
                        ? "bg-ledger/10 text-ledger border border-ledger/30"
                        : "bg-moss/10 text-moss border border-moss/30"
                    }`}
                  >
                    {isPaid ? "Paid" : "Free"}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-ink/60 mb-3">No orders yet.</p>
          <Link href="/courses" className="text-ledger hover:underline">
            Browse the catalog &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
