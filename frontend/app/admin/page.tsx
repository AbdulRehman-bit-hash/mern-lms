"use client";

import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllOrdersQuery } from "@/redux/features/order/orderApi";
import {
  useGetUserAnalyticsQuery,
  useGetCourseAnalyticsQuery,
  useGetOrderAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AdminOverviewPage() {
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCoursesQuery({});
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(
    {}
  );

  const { data: userAnalytics } = useGetUserAnalyticsQuery({});
  const { data: courseAnalytics } = useGetCourseAnalyticsQuery({});
  const { data: orderAnalytics } = useGetOrderAnalyticsQuery({});

  const stats = [
    {
      label: "Total users",
      value: usersLoading ? "…" : usersData?.users?.length ?? 0,
    },
    {
      label: "Total courses",
      value: coursesLoading ? "…" : coursesData?.courses?.length ?? 0,
    },
    {
      label: "Total orders",
      value: ordersLoading ? "…" : ordersData?.orders?.length ?? 0,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Overview</h1>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-ink/10 bg-surface rounded-sm p-6"
          >
            <p className="text-ink/50 text-sm mb-2">{stat.label}</p>
            <p className="font-display text-3xl text-ledger">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs tracking-widest uppercase text-gold mb-4">
        Last 12 months
      </p>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <AnalyticsChart
          title="New signups"
          data={userAnalytics?.users?.last12Months || []}
          color="#C9A227"
        />
        <AnalyticsChart
          title="Courses created"
          data={courseAnalytics?.courses?.last12Months || []}
          color="#5B8C6F"
        />
      </div>

      <AnalyticsChart
        title="Orders placed"
        data={orderAnalytics?.orders?.last12Months || []}
        color="#8C3A3A"
      />
    </div>
  );
}
