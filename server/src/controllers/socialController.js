import asyncHandler from "express-async-handler";
import SocialShare from "../models/SocialShare.js";
import Post from "../models/Post.js";
import logger from "../utils/logger.js";

/**
 * @desc Record a social share action
 * @route POST /api/social/share
 * @access Private
 */
export const recordShare = asyncHandler(async (req, res) => {
  const { postId, platform, url, title, description } = req.body;
  const userId = req.user?.id || null;

  if (!postId || !platform) {
    return res.status(400).json({ error: "Post ID and platform are required" });
  }

  try {
    const share = await SocialShare.create({
      userId,
      postId,
      platform,
      url,
      title,
      description,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Increment post analytics share count
    await Post.findByIdAndUpdate(postId, { $inc: { "analytics.shares": 1 } });

    res.status(201).json({ message: "Share recorded", share });
  } catch (error) {
    logger.error("Error recording share:", error);
    res.status(500).json({ error: "Failed to record share" });
  }
});

/**
 * @desc Get share stats for a post
 * @route GET /api/social/stats/:postId
 * @access Private
 */
export const getShareStats = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  try {
    const stats = await SocialShare.aggregate([
      { $match: { postId } },
      {
        $group: {
          _id: "$platform",
          totalShares: { $sum: 1 },
        },
      },
      { $sort: { totalShares: -1 } },
    ]);

    res.status(200).json({ postId, stats });
  } catch (error) {
    logger.error("Error fetching share stats:", error);
    res.status(500).json({ error: "Failed to fetch share stats" });
  }
});

/**
 * @desc Get user's recent shares
 * @route GET /api/social/recent
 * @access Private
 */
export const getRecentShares = asyncHandler(async (req, res) => {
  try {
    const shares = await SocialShare.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("postId", "title slug");

    res.status(200).json({ shares });
  } catch (error) {
    logger.error("Error fetching recent shares:", error);
    res.status(500).json({ error: "Failed to fetch recent shares" });
  }
});

export default {
  recordShare,
  getShareStats,
  getRecentShares,
};
