import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

let io = null; // declare and exportable variable

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin:
        process.env.CLIENT_URL || [
          "http://localhost:3000",
          "http://localhost:5173",
        ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error: Token not provided."));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Authentication error: User not found."));
      socket.user = user;
      next();
    } catch (err) {
      logger.error("Socket auth failed", err);
      next(new Error("Authentication error: Invalid token."));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`🔌 User connected: ${socket.user?.username || "unknown"} (${socket.id})`);

    socket.on("join_post_room", (postId) => {
      socket.join(`post_${postId}`);
      logger.info(`User ${socket.id} joined room for post: ${postId}`);
    });

    socket.on("leave_post_room", (postId) => {
      socket.leave(`post_${postId}`);
      logger.info(`User ${socket.id} left room for post: ${postId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`🔥 User disconnected: ${socket.user?.username || "unknown"} (${socket.id})`);
    });
  });

  return io;
}

// ✅ export the same io variable so others can use it
export { io };

