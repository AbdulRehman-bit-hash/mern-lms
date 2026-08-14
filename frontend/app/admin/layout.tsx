"use client";

import Link from "next/link";
import { useGetAllNotificationsQuery } from "@/redux/features/notification/notificationApi";

const links = [
  { title: "Overview", href: "/admin" },
  { title: "Courses", href: "/admin/courses" },
  { title: "Users", href: "/admin/users" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Notifications", href: "/admin/notifications" },
  { title: "Homepage content", href: "/admin/layout-settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data } = useGetAllNotificationsQuery({});
  const unreadCount =
    data?.notifications?.filter((n: any) => n.status !== "read").length || 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
      <aside className="w-48 flex-shrink-0">
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-4">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-sm text-sm text-ink/70 hover:bg-parchment hover:text-ink transition-colors flex items-center justify-between"
            >
              {link.title}
              {link.href === "/admin/notifications" && unreadCount > 0 && (
                <span className="bg-gold text-paper text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
