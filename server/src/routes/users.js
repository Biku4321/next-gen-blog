import express from "express";
import {
  getProfile,
  updateProfile,
  getMyPosts,
  changePassword,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/me")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.route("/")
  .get(protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);
router.get("/my-posts", protect, getMyPosts);
export default router;
