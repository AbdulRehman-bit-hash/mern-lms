"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { playNotificationChime } from "@/lib/chime";

// The backend's REST base URL includes "/api/v1"; Socket.io connects to the
// bare server origin instead, so that suffix is stripped off here.
function getSocketUrl() {
  const apiUrl =
    process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:8000/api/v1";
  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

export default function AdminNotificationListener() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only admins open a connection at all — see the security note in the
    // delivery summary for why this is a client-side convenience rather
    // than a server-enforced guarantee.
    if (user?.role !== "admin") {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (socketRef.current) return; // already connected

    const socket = io(getSocketUrl(), {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("newNotification", (payload: { title: string; message: string }) => {
      toast.success(payload.message, { icon: "🔔", duration: 6000 });
      playNotificationChime();

      // A new order affects the notifications list, the order table, every
      // analytics chart, and each course's purchase count — invalidating
      // all four means any admin page currently open (Overview, Orders,
      // Courses) refetches and reflects the new numbers immediately,
      // instead of only the notification badge updating.
      dispatch(
        apiSlice.util.invalidateTags([
          "Notifications",
          "Orders",
          "Analytics",
          "Courses",
        ])
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, dispatch]);

  return null;
}
