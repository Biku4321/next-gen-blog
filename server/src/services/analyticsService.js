// server/src/utils/analyticsService.js
import Analytics from "../models/Analytics.js";
import Post from "../models/Post.js";
import { getRedisClient } from "../config/redis.js";
import logger from "./logger.js";

/**
 * Get analytics overview for a user
 */
export const getUserAnalytics = async (userId, range = "7d") => {
  try {
    const redis = getRedisClient();
    const cacheKey = `analytics:${userId}:${range}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const end = new Date();
    const start = new Date();
    if (range === "30d") start.setDate(start.getDate() - 30);
    else if (range === "7d") start.setDate(start.getDate() - 7);
    else start.setDate(start.getDate() - 1);

    const posts = await Post.find({ author: userId }).select("_id");
    const match = { postId: { $in: posts.map((p) => p._id) } };

    const data = await Analytics.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$pageViews" },
          totalLikes: { $sum: "$likes" },
          totalComments: { $sum: "$comments" },
          totalShares: { $sum: "$shares" },
        },
      },
    ]);

    const result = data[0] || {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
    };

    await redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  } catch (error) {
    logger.error("Analytics service error:", error);
    throw new Error("Failed to get analytics");
  }
};

/**
 * Track a page view
 */
export const trackPageView = async (postId, sessionId) => {
  try {
    await Analytics.create({
      postId,
      sessionId,
      pageViews: 1,
      uniqueViews: 1,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error("Page view tracking failed:", error);
  }
};
