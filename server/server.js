
// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import cookieParser from "cookie-parser";
// --- Config Imports ---
import connectDB from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";
import { initializeSocket } from "./src/config/socket.js";
import logger from "./src/utils/logger.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";

// --- Routes ---
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";
import userRoutes from "./src/routes/users.js";
import supportRoutes from "./src/routes/supportRoutes.js";
import commentRoutes from "./src/routes/comments.js";
import categoryRoutes from "./src/routes/categories.js";
import aiRoutes from "./src/routes/ai.js";
import abtestRoutes from "./src/routes/abtest.js";
import router from "./src/routes/settingsRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import analyticsRoutes from "./src/routes/analytics.js";
import socialRoutes from "./src/routes/social.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import likeRoutes from "./src/routes/likes.js";
import bookmarkRoutes from "./src/routes/bookmarks.js";
// --- Setup ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

console.log("authRoutes:", typeof authRoutes);
console.log("postRoutes:", typeof postRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("commentRoutes:", typeof commentRoutes);
console.log("categoryRoutes:", typeof categoryRoutes);
console.log("aiRoutes:", typeof aiRoutes);
console.log("abtestRoutes:", typeof abtestRoutes);
console.log("router:", typeof router);
console.log("notificationRoutes:", typeof notificationRoutes);
console.log("analyticsRoutes:", typeof analyticsRoutes);
console.log("socialRoutes:", typeof socialRoutes);
console.log("dashboardRoutes:", typeof dashboardRoutes);
console.log("supportRoutes:", typeof supportRoutes);
console.log("likeRoutes:", typeof likeRoutes);
console.log("bookmarkRoutes:", typeof bookmarkRoutes);
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
});
app.use(cookieParser());
if (process.env.TRUST_PROXY === "1" || process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

try {
  initializeSocket(httpServer);
  console.log("websocker server running");
} catch (err) {
  console.error("❌ Error in socket:", err);
}

app.get("/health", (req, res) =>
  res.status(200).json({ ok: true, uptime: process.uptime() })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const allowedOrigins = [
  "http://localhost:5173",   // ✅ your Vite frontend
  "http://127.0.0.1:5173",   // ✅ alternate local
  "http://localhost:3000",   // optional
  "http://127.0.0.1:3000",   // optional
];
app.use(express.json({ limit: "10mb" }));
// ✅ replace your current cors() with:
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from Postman or curl (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  console.log("Incoming path:", req.path);
  next();
});


const safeMongoSanitize = (req, res, next) => {
  try {

    if (req.body && typeof req.body === "object") {
      mongoSanitize.sanitize(req.body);
    }
    if (req.params && typeof req.params === "object") {
      mongoSanitize.sanitize(req.params);
    }
    if (req.query && typeof req.query === "object") {
      mongoSanitize.sanitize(req.query);
    }
  } catch (e) {
    console.warn("⚠️ MongoSanitize skipped due to compatibility issue:", e && e.message);
  }
  next();
};

app.use(safeMongoSanitize);

app.use(compression());

// --- Rate Limiting ---
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", generalLimiter);

try {
  app.use("/api/auth", authRoutes);
  console.log("✅ authRoutes loaded");
} catch (err) {
  console.error("❌ Error in authRoutes:", err);
}

try {
  app.use("/api/posts", postRoutes);
  console.log("✅ postRoutes loaded");
} catch (err) {
  console.error("❌ Error in postRoutes:", err);
}

try {
  app.use("/api/users", userRoutes);
  console.log("✅ userRoutes loaded");
} catch (err) {
  console.error("❌ Error in userRoutes:", err);
}

try {
  app.use("/api/comments", commentRoutes);
  console.log("✅ commentRoutes loaded");
} catch (err) {
  console.error("❌ Error in commentRoutes:", err);
}

try {
  app.use("/api/categories", categoryRoutes);
  console.log("✅ categoryRoutes loaded");
} catch (err) {
  console.error("❌ Error in categoryRoutes:", err);
}

try {
  app.use("/api/settings", router);
  console.log("✅ settingsRoutes loaded");
} catch (err) {
  console.error("❌ Error in settingsRoutes:", err);
}
try {
  app.use("/api/ai", aiRoutes);
  console.log("✅ aiRoutes loaded");
} catch (err) {
  console.error("❌ Error in aiRoutes:", err);
}
try {
  app.use("/api/notifications", notificationRoutes);
  console.log("✅ notificationRoutes loaded");
} catch (err) {
  console.error("❌ Error in notificationRoutes:", err);
}

try {
  app.use("/api/abtest", abtestRoutes);
  console.log("✅ abtestRoutes loaded");
} catch (err) {
  console.error("❌ Error in abtestRoutes:", err);
}

try {
  app.use("/api/analytics", analyticsRoutes);
  console.log("✅ analyticsRoutes loaded");
} catch (err) {
  console.error("❌ Error in analyticsRoutes:", err);
}

try {
  app.use("/api/dashboard", dashboardRoutes);
  console.log("✅ dashboardRoutes loaded");
} catch (err) {
  console.error("❌ Error in dashboardRoutes:", err);
}

try {
  app.use("/api/support", supportRoutes);
  console.log("✅ supportRoutes loaded");
} catch (err) {
  console.error("❌ Error in supportRoutes:", err);
}

try {
  app.use("/api/likes", likeRoutes);
  console.log("✅ likeRoutes loaded");
} catch (err) {
  console.error("❌ Error in likeRoutes:", err);
}

try {
  app.use("/api/bookmarks", bookmarkRoutes);
  console.log("✅ bookmarkRoutes loaded");
} catch (err) {
  console.error("❌ Error in bookmarkRoutes:", err);
}
// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get(/^\/(?!api).*/, (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"))
  );
}

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    //await connectRedis();

    server = httpServer.listen(PORT, () => {
      logger.info(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (err) {
    logger.error("🔴 Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully...");
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
