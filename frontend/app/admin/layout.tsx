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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-10">
      {/* On mobile this becomes a horizontal scrollable pill row instead of
          a fixed-width vertical sidebar, which would otherwise squeeze the
          main content into an unusably narrow column on a phone screen. */}
      <aside className="w-full md:w-48 flex-shrink-0">
        <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3 md:mb-4">
          Admin
        </p>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex-shrink-0 px-3 py-2 rounded-sm text-sm text-ink/70 hover:bg-parchment hover:text-ink transition-colors flex items-center gap-2 md:justify-between whitespace-nowrap"
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
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
