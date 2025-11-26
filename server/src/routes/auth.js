import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  googleAuthCallback,
  facebookAuthCallback,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", [body("username").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })], register);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

router.post("/otp/email/send", sendEmailOtp);
router.post("/otp/email/verify", verifyEmailOtp);
router.post("/otp/phone/send", sendPhoneOtp);
router.post("/otp/phone/verify", verifyPhoneOtp);

router.post("/google-auth", googleAuthCallback);
router.post("/facebook-auth", facebookAuthCallback);

router.post("/google/callback", googleAuthCallback);
router.post("/facebook/callback", facebookAuthCallback);

export default router;
