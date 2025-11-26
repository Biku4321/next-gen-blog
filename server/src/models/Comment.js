import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);