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
    email: {
      type: String,
      lowercase: true, // ✅ Ensures emails are always stored lowercase for matching
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
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
    
    // ✅ NEW: Store OTP in Database to fix "nothing to matching" bug
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.otp; // Hide OTP from API responses
        delete ret.otpExpires;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("Either email or phone must be provided for a user"));
  } else {
    next();
  }
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    if (!this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;