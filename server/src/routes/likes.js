import express from "express";
import { protect } from "../middleware/auth.js";
import { getLikeStatus, toggleLike } from "../controllers/likeController.js";

const router = express.Router();

// GET like status
router.get("/:postId", protect, getLikeStatus);

// POST toggle like
router.post("/toggle", protect, toggleLike);

export default router;
