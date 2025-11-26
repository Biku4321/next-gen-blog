// server/src/models/Dashboard.js
import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    totalPosts: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    unreadNotifications: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Dashboard", dashboardSchema);
