import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

/**
 * @desc Get all published posts (public)
 * @route GET /api/posts
 */
export const getPosts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const category = req.query.category;
    const search = req.query.search;

    let query = { status: "published" };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "username profile.firstName profile.lastName profile.avatar")
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-content");

    const total = await Post.countDocuments(query);
    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching posts" });
  }
};

/**
 * @desc Get single post by ID or slug
 * @route GET /api/posts/:id
 */
export const getPost = async (req, res) => {
  try {
    const identifier = req.params.id;
    let post = null;

    if (mongoose.isValidObjectId(identifier)) {
      post = await Post.findById(identifier)
        .populate("author", "username profile.firstName profile.lastName profile.avatar profile.bio");
    } else {
      post = await Post.findOne({ slug: identifier })
        .populate("author", "username profile.firstName profile.lastName profile.avatar profile.bio");
    }

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // increment views for published posts
    if (post.status === "published") {
      post.analytics.views = (post.analytics.views || 0) + 1;
      await post.save();
    }

    res.json({ success: true, post });
  } catch (err) {
    console.error("Get post error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching post" });
  }
};

/**
 * @desc Create new post
 * @route POST /api/posts
 * @access Private (author/admin)
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status = "draft" } = req.body;

    // Allow drafts with empty fields
    if (status === "published" && (!title || !content || !category)) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required to publish a post.",
      });
    }

    const sanitizedContent = content ? purify.sanitize(content) : "";

    const post = new Post({
      title: title || "Untitled Draft",
      content: sanitizedContent,
      excerpt,
      category: category || "other",
      tags: tags || [],
      author: req.user._id,
      status,
      publishedAt: status === "published" ? new Date() : null,
    });

    await post.save();

    await post.populate("author", "username profile.firstName profile.lastName profile.avatar");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * @desc Update existing post
 * @route PUT /api/posts/:id
 * @access Private (owner/admin)
 */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, content, excerpt, category, tags, status } = req.body;

    if (status === "published" && (!title || !content || !category)) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and category are required to publish a post.",
      });
    }

    post.title = title || post.title || "Untitled Draft";
    post.content = content ? purify.sanitize(content) : post.content;
    post.excerpt = excerpt ?? post.excerpt;
    post.category = category || post.category || "other";
    post.tags = tags || post.tags;
    if (status) {
      post.status = status;
      if (status === "published") post.publishedAt = new Date();
    }

    await post.save();
    await post.populate("author", "username profile.firstName profile.lastName profile.avatar");

    res.json({ success: true, message: "Post updated successfully", post });
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * @desc Delete post
 * @route DELETE /api/posts/:id
 * @access Private (owner/admin)
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ success: false, message: "Server error while deleting post" });
  }
};

/**
 * @desc Like or unlike a post
 * @route POST /api/posts/:id/like
 */
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id.toString();
    const index = post.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    post.analytics.likes = post.likes.length;
    await post.save();

    res.json({ success: true, likes: post.likes.length });
  } catch (err) {
    console.error("Like toggle error:", err);
    res.status(500).json({ success: false, message: "Server error while toggling like" });
  }
};

/**
 * @desc Bookmark / unbookmark a post
 * @route POST /api/posts/:id/bookmark
 */
export const toggleBookmark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const userId = req.user._id.toString();
    const index = post.bookmarks.findIndex((id) => id.toString() === userId);

    if (index === -1) post.bookmarks.push(userId);
    else post.bookmarks.splice(index, 1);

    await post.save();
    res.json({ success: true, message: "Bookmark toggled" });
  } catch (err) {
    console.error("Bookmark toggle error:", err);
    res.status(500).json({ success: false, message: "Server error while toggling bookmark" });
  }
};

/**
 * @desc Get current user's posts (dashboard)
 * @route GET /api/posts/my-posts
 */
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "username profile.firstName profile.lastName profile.avatar");
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Get user posts error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching user posts" });
  }
};

/**
 * @desc Get posts by specific author
 * @route GET /api/posts/author/:userId
 */
export const getPostsByAuthor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const author = await User.findById(req.params.userId);
    if (!author) return res.status(404).json({ success: false, message: "Author not found" });

    const posts = await Post.find({ author: req.params.userId, status: "published" })
      .populate("author", "username profile.firstName profile.lastName profile.avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-content");

    const total = await Post.countDocuments({ author: req.params.userId, status: "published" });

    res.json({
      success: true,
      posts,
      author: {
        id: author._id,
        username: author.username,
        profile: author.profile,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get posts by author error:", err);
    res.status(500).json({ success: false, message: "Server error while fetching author posts" });
  }
};
