import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/emailService.js";
import { sendSmsOtp } from "../utils/smsService.js";
import { OAuth2Client } from "google-auth-library";

/* ============================================================
   🔐 TOKEN GENERATION
   ============================================================ */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });

//const otpStore = new Map(); // Temporary (replace with Redis in production)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

/* ============================================================
   🧾 REGISTER
   ============================================================ */
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ success: true, user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.json({ success: true, message: "Login successful", token, user });
});
/* ============================================================
   🙋‍♂️ GET ME
   ============================================================ */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

/* ============================================================
   🚪 LOGOUT
   ============================================================ */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};

/* ============================================================
   📧 EMAIL OTP FLOW
   ============================================================ */
export const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const normalizedEmail = email.toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  // ✅ Fix: Upsert User (Create if new, Update if exists) to store OTP
  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      username: normalizedEmail.split("@")[0], // Temporary username
      isEmailVerified: false,
      otp,
      otpExpires,
    });
  } else {
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  }

  const message = `<h1>${otp}</h1><p>Your verification code. Expires in 10 mins.</p>`;
  await sendEmail(normalizedEmail, "Verification OTP", message);
  
  res.status(200).json({ success: true, message: "OTP sent successfully" });
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase();

  // ✅ Fix: Fetch OTP from DB instead of Map
  const user = await User.findOne({ email: normalizedEmail }).select("+otp +otpExpires");

  if (!user) return res.status(400).json({ error: "User not found" });
  if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ error: "OTP expired" });

  // Cleanup OTP and verify
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isEmailVerified = true;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ success: true, message: "Email verified", token, user });
});

/* ============================================================
   📱 PHONE OTP FLOW
   ============================================================ */
export const sendPhoneOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  // ✅ Fix: Store OTP in DB
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      phone,
      username: `user_${phone.slice(-4)}`,
      authProvider: "phone",
      isPhoneVerified: false,
      otp,
      otpExpires,
    });
  } else {
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  }

  await sendSmsOtp(phone, `Your code is ${otp}`);
  res.status(200).json({ success: true, message: "OTP sent" });
});

export const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  
  // ✅ Fix: Fetch OTP from DB
  const user = await User.findOne({ phone }).select("+otp +otpExpires");

  if (!user) return res.status(400).json({ error: "User not found" });
  if (!user.otp || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
  if (Date.now() > user.otpExpires) return res.status(400).json({ error: "OTP expired" });

  user.otp = undefined;
  user.otpExpires = undefined;
  user.isPhoneVerified = true;
  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ success: true, message: "Phone verified", token, user });
});
/* ============================================================
   🌐 GOOGLE AUTH
   ============================================================ */
export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Token missing" });

  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: name || email.split("@")[0],
        profile: { avatar: picture },
        isEmailVerified: true,
        authProvider: "google",
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
});
/* ============================================================
   📘 FACEBOOK AUTH
   ============================================================ */
export const facebookAuthCallback = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: "Access token required" });

  try {
    // ✅ Fix: Fetch user data from Facebook directly (don't trust frontend)
    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const fbData = await fbRes.json();

    if (!fbData.email) return res.status(400).json({ error: "No email found in Facebook account" });

    let user = await User.findOne({ email: fbData.email });
    if (!user) {
      user = await User.create({
        email: fbData.email,
        username: fbData.name || fbData.email.split("@")[0],
        profile: { avatar: fbData.picture?.data?.url },
        authProvider: "facebook",
        isEmailVerified: true,
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error("FB Auth Error:", error);
    res.status(500).json({ error: "Facebook login failed" });
  }
});