import { createServer } from "http";
import { app } from "./app";
require("dotenv").config();
import connectDB from "./utils/db";
import { initSocketServer } from "./socket/socket";

const PORT = process.env.PORT || 8000;

// Express normally creates its own HTTP server internally when you call
// app.listen(). Creating it explicitly here instead lets Socket.io attach
// to that same server, so both HTTP requests and WebSocket connections
// share one port instead of needing two separate servers.
const httpServer = createServer(app);

initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
