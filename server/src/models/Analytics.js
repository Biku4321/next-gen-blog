import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: {
    type: String,
    index: true,
  },
  eventType: {
    type: String,
    enum: ['pageView', 'like', 'comment', 'share'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  referrer: String,
  userAgent: String,
  ipAddress: String,
  location: {
    country: String,
    region: String,
    city: String,
  },
  deviceInfo: {
    device: String,
    os: String,
    browser: String,
  },
  timeOnPage: Number, // in seconds
}, {
  timestamps: true,
});

analyticsSchema.index({ timestamp: -1 });

export default mongoose.model('Analytics', analyticsSchema);

