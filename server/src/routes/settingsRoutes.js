import express from "express";
import { protect  } from "../middleware/auth.js"; 

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get("/", protect , async (req, res) => {
  try {
    res.status(200).json({
      theme: "dark",
      emailNotifications: true,
      language: "en",
      message: "User settings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put("/", protect , async (req, res) => {
  try {
    const updatedSettings = req.body;
    res.status(200).json({
      success: true,
      updated: updatedSettings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
