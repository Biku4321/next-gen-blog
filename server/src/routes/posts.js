import express from "express";
import { body, param, query } from "express-validator";
import { protect, authorize } from "../middleware/auth.js";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  toggleLike,
  toggleBookmark,
  getPostsByAuthor,
} from "../controllers/postController.js";

const router = express.Router();

const validatePost = [
  body("title").optional().isLength({ min: 1, max: 200 }).withMessage("Title must be between 1 and 200 characters"),
  body("content").optional().isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),
  body("excerpt").optional().isLength({ max: 500 }).withMessage("Excerpt cannot exceed 500 characters"),
  body("category")
    .optional()
    .isIn(["technology", "design", "business", "lifestyle", "health", "travel", "food", "other"])
    .withMessage("Invalid category"),
];

const validatePostId = [param("id").isMongoId().withMessage("Invalid post ID")];

const validatePagination = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sortBy").optional().isIn(["createdAt", "updatedAt", "title", "analytics.views"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
];


router.get("/", validatePagination, getPosts);
router.get("/author/:userId", param("userId").isMongoId(), validatePagination, getPostsByAuthor);
router.get("/my-posts", protect, getUserPosts);
router.get("/:id", validatePostId, getPost);
router.post("/", protect, authorize("admin", "author"), validatePost, createPost);
router.put("/:id", protect, validatePostId, validatePost, updatePost);
router.delete("/:id", protect, validatePostId, deletePost);
router.post("/:id/like", protect, validatePostId, toggleLike);
router.post("/:id/bookmark", protect, validatePostId, toggleBookmark);

export default router;
