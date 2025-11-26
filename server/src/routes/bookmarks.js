import express from "express";
import { protect } from "../middleware/auth.js";
import { getBookmarkStatus, toggleBookmark } from "../controllers/bookmarkController.js";

const router = express.Router();

router.get("/:postId", protect, getBookmarkStatus);

router.post("/toggle", protect, toggleBookmark);

export default router;
