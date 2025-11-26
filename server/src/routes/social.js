import express from "express";
import { protect } from "../middleware/auth.js";
import {
  recordShare,
  getShareStats,
  getRecentShares,
} from "../controllers/socialController.js";

const router = express.Router();

router.post("/share", protect, recordShare);
router.get("/stats/:postId", protect, getShareStats);
router.get("/recent", protect, getRecentShares);

export default router;
