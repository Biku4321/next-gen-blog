import Bookmark from "../models/Bookmark.js";

export const getBookmarkStatus = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const exists = await Bookmark.exists({ post: postId, user: userId });

  res.json({
    success: true,
    bookmarked: !!exists
  });
};

export const toggleBookmark = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  const exists = await Bookmark.findOne({ post: postId, user: userId });

  if (exists) {
    await Bookmark.findByIdAndDelete(exists._id);
    return res.json({
      success: true,
      bookmarked: false
    });
  }

  await Bookmark.create({ post: postId, user: userId });

  res.json({
    success: true,
    bookmarked: true
  });
};