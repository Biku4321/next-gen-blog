// server/src/models/SocialShare.js
import mongoose from "mongoose";

const socialShareSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    platform: {
      type: String,
      enum: ["twitter", "linkedin", "facebook", "native", "copy"],
      required: true,
    },
    url: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    sharedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

socialShareSchema.index({ userId: 1, postId: 1, platform: 1 });

export default mongoose.model("SocialShare", socialShareSchema);
