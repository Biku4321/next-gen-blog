import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

const sanitizeUserForClient = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  // prefer explicit avatarUrl, then profile.avatar
  const avatarUrl = user.avatarUrl || (user.profile && user.profile.avatar) || null;
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl,
    profile: user.profile || {},
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * @desc Get logged-in user's profile
 * @route GET /api/users/me
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, user });
});

/**
 * @desc Update profile
 * @route PUT /api/users/me
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { username, email, avatarUrl, avatar } = req.body;

  // Keep both shapes supported:
  if (username) user.username = username;
  if (email) user.email = email;

  // If frontend provides avatarUrl, put it both on top-level for compatibility
  // and also into profile.avatar so other parts of code can still read profile.avatar.
  if (avatarUrl) {
    user.avatarUrl = avatarUrl;
    if (!user.profile) user.profile = {};
    user.profile.avatar = avatarUrl;
  }

  // Support profile.avatar directly
  if (avatar) {
    if (!user.profile) user.profile = {};
    user.profile.avatar = avatar;
    user.avatarUrl = avatar;
  }

  const updated = await user.save();
  const clientUser = sanitizeUserForClient(updated);
  res.json({
    success: true,
    message: "Profile updated",
    user: clientUser,
  });
});

/**
 * @desc Change password
 * @route PUT /api/users/change-password
 * @access Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Old password incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

/**
 * @desc Get all users (Admin)
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, count: users.length, users });
});

/**
 * @desc Delete user (Admin)
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
});

export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Get my posts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
