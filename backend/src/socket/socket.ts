import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
require("dotenv").config();

let io: Server | undefined;

// Called once from server.ts with the raw HTTP server (the same one
// Express is attached to) so Socket.io can share the same port.
export const initSocketServer = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });

  return io;
};

interface NewNotificationPayload {
  title: string;
  message: string;
  createdAt: Date;
}

// Broadcasts to every connected socket. The frontend only opens a
// connection at all when the logged-in user is an admin, so in practice
// only admin dashboards receive this — but see the security note in the
// delivery summary about why this isn't a server-side guarantee.
export const emitNewNotification = (payload: NewNotificationPayload) => {
  io?.emit("newNotification", payload);
};
