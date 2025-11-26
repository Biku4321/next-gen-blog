import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Analytics from "../models/Analytics.js";
import Notification from "../models/Notification.js";
import logger from "../utils/logger.js";
import { getRedisClient } from "../config/redis.js";

/**
 * @desc Get user dashboard summary (profile, stats, engagement)
 * @route GET /api/dashboard
 * @access Private
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const redis = getRedisClient();
    const cacheKey = `dashboard:${userId}`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Fetch data concurrently
    const [user, postCount, notifications, analytics] = await Promise.all([
      User.findById(userId).select("username email profilePic followers following createdAt"),
      Post.countDocuments({ author: userId }),
      Notification.countDocuments({ userId, read: false }),
      Analytics.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$pageViews" },
            totalLikes: { $sum: "$likes" },
            totalComments: { $sum: "$comments" },
            totalShares: { $sum: "$shares" },
          },
        },
      ]),
    ]);

    const stats = analytics[0] || {};

    // Calculate engagement rate (example)
    const engagementRate =
      (stats.totalLikes + stats.totalComments + stats.totalShares) /
        (stats.totalViews || 1) *
      100;

    const summary = {
      profile: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
        joined: user.createdAt,
      },
      stats: {
        totalPosts: postCount,
        totalViews: stats.totalViews || 0,
        totalLikes: stats.totalLikes || 0,
        totalComments: stats.totalComments || 0,
        totalShares: stats.totalShares || 0,
        engagementRate: engagementRate.toFixed(2),
        unreadNotifications: notifications,
      },
      message: "Dashboard summary fetched successfully",
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(summary));

    res.status(200).json(summary);
  } catch (error) {
    logger.error("Dashboard summary error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

/**
 * @desc Get recent user activity timeline
 * @route GET /api/dashboard/activity
 * @access Private
 */
export const getRecentActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const recentPosts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt status");

    const recentNotifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("message type read createdAt");

    const activity = {
      posts: recentPosts,
      notifications: recentNotifications,
      message: "Recent activity fetched successfully",
    };

    res.status(200).json(activity);
  } catch (error) {
    logger.error("Recent activity error:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

/**
 * @desc Get growth metrics (followers, views, engagement trend)
 * @route GET /api/dashboard/growth
 * @access Private
 */
export const getGrowthMetrics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const growthData = await Analytics.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          timestamp: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$timestamp" } },
          views: { $sum: "$pageViews" },
          engagement: { $sum: { $add: ["$likes", "$comments", "$shares"] } },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    res.status(200).json({
      growth: growthData,
      message: "Growth metrics fetched successfully",
    });
  } catch (error) {
    logger.error("Growth metrics error:", error);
    res.status(500).json({ error: "Failed to fetch growth metrics" });
  }
});

export default {
  getDashboardSummary,
  getRecentActivity,
  getGrowthMetrics,
};
