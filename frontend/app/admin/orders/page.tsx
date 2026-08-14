"use client";

import { useGetAllOrdersQuery } from "@/redux/features/order/orderApi";

export default function AdminOrdersPage() {
  const { data, isLoading } = useGetAllOrdersQuery({});

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Orders</h1>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : (
        <table className="w-full text-sm border border-ink/10 bg-surface rounded-sm overflow-hidden">
          <thead className="bg-parchment text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-ink/70">Order ID</th>
              <th className="px-4 py-3 font-medium text-ink/70">Course ID</th>
              <th className="px-4 py-3 font-medium text-ink/70">User ID</th>
              <th className="px-4 py-3 font-medium text-ink/70">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {data?.orders?.map((order: any) => (
              <tr key={order._id}>
                <td className="px-4 py-3 font-mono text-ink/70">
                  {order._id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-mono text-ink/70">
                  {order.courseId?.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 font-mono text-ink/70">
                  {order.userId?.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 text-ink">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!data?.orders?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
