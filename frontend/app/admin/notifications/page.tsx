"use client";

import toast from "react-hot-toast";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notification/notificationApi";

export default function AdminNotificationsPage() {
  const { data, isLoading } = useGetAllNotificationsQuery({});
  const [updateNotification, { isLoading: isUpdating }] =
    useUpdateNotificationMutation();

  const handleMarkRead = async (id: string) => {
    try {
      await updateNotification(id).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update notification");
    }
  };

  const notifications = data?.notifications || [];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Notifications</h1>

      {isLoading ? (
        <p className="text-ink/50">Loading…</p>
      ) : notifications.length ? (
        <div className="flex flex-col gap-3">
          {notifications.map((n: any) => {
            const isUnread = n.status !== "read";
            return (
              <div
                key={n._id}
                className={`border rounded-sm p-4 flex items-start justify-between gap-4 transition-colors ${
                  isUnread
                    ? "border-gold/40 bg-surface"
                    : "border-ink/10 bg-surface opacity-60"
                }`}
              >
                <div className="flex gap-3">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      isUnread ? "bg-gold" : "bg-transparent"
                    }`}
                  />
                  <div>
                    <p className="text-ink font-medium mb-1">{n.title}</p>
                    <p className="text-ink/60 text-sm mb-2">{n.message}</p>
                    <p className="text-ink/40 text-xs">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {isUnread && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    disabled={isUpdating}
                    className="flex-shrink-0 px-3 py-1.5 rounded-sm border border-ink/20 text-ink/70 text-xs hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-60"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-ink/50">No notifications yet.</p>
      )}

      <p className="text-ink/40 text-xs mt-8">
        Read notifications are automatically cleared after 30 days.
      </p>
    </div>
  );
}
