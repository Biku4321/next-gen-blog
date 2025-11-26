import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Bookmark', bookmarkSchema);
