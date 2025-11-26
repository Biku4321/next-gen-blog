import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const getLikeStatus = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const count = await Like.countDocuments({ post: postId });
  const userLiked = await Like.exists({ post: postId, user: userId });

  res.json({
    success: true,
    count,
    userLiked: !!userLiked
  });
};

export const toggleLike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  const existing = await Like.findOne({ post: postId, user: userId });
  let userLiked;

  if (existing) {
    await Like.findByIdAndDelete(existing._id);
    userLiked = false;
  } else {
    await Like.create({ post: postId, user: userId });
    userLiked = true;
  }

  const count = await Like.countDocuments({ post: postId });

  res.json({
    success: true,
    count,
    userLiked
  });
};