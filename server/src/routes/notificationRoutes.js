import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Notification from "../models/Notification.js"; // ✅ make sure model exists

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Fetch all user notifications
 * @access  Private
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found in token" });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

/**
 * @route   POST /api/notifications/mark-read
 * @desc    Mark a single notification as read
 * @access  Private
 */
router.post("/mark-read", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, {
      read: true,
      readAt: new Date(),
    });
    res.status(200).json({
      success: true,
      notificationId,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification:", error);
    res.status(500).json({ error: "Failed to mark notification" });
  }
});

/**
 * @route   PUT /api/notifications/mark-all
 * @desc    Mark all notifications as read for the user
 * @access  Private
 */
router.put("/mark-all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id || req.user.id, read: false },
      { read: true, readAt: new Date() }
    );
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("Error marking all notifications:", err);
    res.status(500).json({ success: false, error: "Failed to mark all read" });
  }
});

router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json({ success: true, notification: notif });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
});

export default router;
