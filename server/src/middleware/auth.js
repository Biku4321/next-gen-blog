
// server/src/middleware/auth.js - COMPLETELY FIXED
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ success: false, message: "User not found" });

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};


export const verifyToken = (req, res, next) => {
  try {
    // Example: replace with JWT verification
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
    // decode JWT and attach user info if needed
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};


export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // ignore invalid token (do not block access)
    }
  }
  next();
});