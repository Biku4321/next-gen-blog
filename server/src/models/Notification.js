// server/src/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "follow",
        "share",
        "mention",
        "message",
        "system",
        "ai_report",
        "security",
      ],
      default: "system",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    link: {
      type: String, // e.g. `/posts/slug` or `/dashboard/analytics`
      default: null,
    },

    read: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔹 Index for efficient querying
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// 🔹 Virtual: time since notification created
notificationSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.createdAt;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
});

export default mongoose.model("Notification", notificationSchema);
