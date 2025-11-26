// server/src/config/redis.js
import { createClient } from "redis";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

let redisClient;
let isRedisConnected = false;

export const connectRedis = async () => {
  if (isRedisConnected) return;

  try {
    // ✅ Default to local Redis if REDIS_URL not set
    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
console.log("🧠 Using Redis URL:", redisUrl);


    redisClient = createClient({ url: redisUrl });

    redisClient.on("error", (err) => {
      logger.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      logger.info("Connecting to Redis...");
    });

    redisClient.on("ready", () => {
      isRedisConnected = true;
      logger.info("✅ Redis Connected Successfully.");
    });

    await redisClient.connect();

    // If connect() resolves before "ready" event fires
    if (!isRedisConnected) {
      isRedisConnected = true;
      logger.info("✅ Redis connection established (post-connect).");
    }

  } catch (error) {
    logger.error(
      "🔴 Failed to connect to Redis. Caching and advanced features will be disabled.",
      error.message
    );
    isRedisConnected = false;
  }
};

// ✅ Safe Redis getter (won’t break app if Redis not connected)
export const getRedisClient = () => {
  if (!isRedisConnected || !redisClient) {
    logger.warn("⚠️ Redis not connected — returning dummy client.");
    return {
      get: async () => null,
      setEx: async () => {},
      del: async () => {},
      keys: async () => [],
      lPush: async () => {},
      lRange: async () => [],
      lRem: async () => {},
      hIncrBy: async () => {},
      expire: async () => {},
      zAdd: async () => {},
      zRemRangeByScore: async () => {},
      exists: async () => 0,
    };
  }
  return redisClient;
};
