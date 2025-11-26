import Comment from "../models/Comment.js";
import { io } from "../config/socket.js"; // Import io from the centralized socket config

/**
 * @desc    Get all comments for a post
 * @route   GET /api/comments/:postId
 * @access  Public
 */
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: "asc" })
      .populate("author", "username profile.avatar");

    res.json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 * @access  Private
 */
export const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID and content are required." });
    }

    const comment = await Comment.create({ post: postId, content, author: req.user._id });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username profile.avatar"
    );

    if (io) {
      io.to(`post_${postId}`).emit("new_comment", populatedComment);
    }

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Owner or Admin)
 */
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "User not authorized to delete this comment" });
    }

    const postId = comment.post.toString();
    await comment.deleteOne();

    if (io) {
      io.to(`post_${postId}`).emit("deleted_comment", {
        commentId: req.params.id,
        postId,
      });
    }

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

// controllers/commentController.js
// import Comment from "../models/Comment.js";

// export const getCommentsByPost = async (req, res) => {
//   try {
//     const comments = await Comment.find({ post: req.params.postId })
//       .populate("user", "username _id") // ✅ include username and id
//       .sort({ createdAt: 1 });

//     res.json({ success: true, comments });
//   } catch (err) {
//     console.error("❌ getCommentsByPost error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const createComment = async (req, res) => {
//   try {
//     const comment = await Comment.create({
//       post: req.body.postId,
//       user: req.user._id,
//       content: req.body.content,
//     });

//     // ✅ populate before sending back
//     const populated = await comment.populate("user", "username _id");

//     res.status(201).json({ success: true, comment: populated });
//   } catch (err) {
//     console.error("❌ createComment error:", err);
//     res.status(400).json({ success: false, message: "Invalid data" });
//   }
// };

// export const deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

//     if (comment.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ success: false, message: "Not authorized" });
//     }

//     await comment.deleteOne();
//     res.json({ success: true, message: "Comment deleted" });
//   } catch (err) {
//     console.error("❌ deleteComment error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
