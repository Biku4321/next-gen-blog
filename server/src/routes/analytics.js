import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Return analytics dashboard data
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    res.status(200).json({
      totalViews: 4250,
      topPosts: [
        { id: 1, title: "Mastering React", views: 1500 },
        { id: 2, title: "Node.js Best Practices", views: 1100 },
      ],
      engagement: { likes: 500, comments: 230, shares: 100 },
      message: "Analytics data fetched successfully",
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
