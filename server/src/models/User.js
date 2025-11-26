// server/src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"],
      required: [true, "Username is required"],
    },

    // Optional email (sparse unique index)
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, "Please enter a valid email"],
    },

    // Optional phone (E.164 preferred), also sparse unique
    phone: {
      type: String,
      trim: true,
    },

    // Password optional (for OAuth-only or phone-only users)
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // don't return by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profile: {
      firstName: String,
      lastName: String,
      bio: String,
      avatar: String,
    },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "phone"],
      default: "local",
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password; // ensure password never leaks in JSON
        return ret;
      },
    },
  }
);

// Create sparse unique indexes (so missing fields are allowed)
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Ensure we have at least one identifier before saving
userSchema.pre("validate", function (next) {
  // allow admin/seed scripts to bypass if they really want
  if (!this.email && !this.phone) {
    // For OAuth providers, email may exist but password may be absent — that's OK.
    next(new Error("Either email or phone must be provided for a user"));
  } else {
    next();
  }
});

// Hash password only if it was set/modified
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    if (!this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Instance method to compare plaintext password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
