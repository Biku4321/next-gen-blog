
import mongoose from 'mongoose';
import slugify from '../utils/slugify.js';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: function () {
    return this.status === "published"; // only required when publishing
  },
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'design', 'business', 'lifestyle', 'health', 'travel', 'food', 'other']
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  featuredImage: {
    url: String,
    publicId: String,
    alt: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  isFeatured: { type: Boolean, default: false, index: true },
  isPinned: { type: Boolean, default: false, index: true },
  
  // Embedded Likes and Bookmarks (Replaces separate models)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Indexes for Performance ---
postSchema.index({ author: 1, status: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ 'analytics.views': -1 });
postSchema.index({ title: 'text', content: 'text', tags: 'text' }); // For text search


// --- Mongoose Middleware ---
// postSchema.pre('save', async function(next) {
//   if (this.isModified('title') || !this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//     // This simple slugify might create duplicates. A more robust solution
//     // would check for existing slugs and append a unique identifier.
//   }
//   next();
// });

postSchema.pre("save", async function (next) {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Post.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});


export default mongoose.model('Post', postSchema);