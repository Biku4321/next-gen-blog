import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getDashboardSummary,
  getRecentActivity,
  getGrowthMetrics,
} from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/", protect, getDashboardSummary);
router.get("/activity", protect, getRecentActivity);
router.get("/growth", protect, getGrowthMetrics);

export default router;
