// src/models/User.js  (mentor model — kept name "User" to match existing refPath)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  profession: { type: String, required: true, trim: true },
  experience: { type: Number, required: true },
  approved: { type: Boolean, default: false },
  skillLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    required: true,
  },
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  profilePicture: {
    url: { type: String, default: null },
    filename: { type: String, default: null },
  },
  role: { type: String, default: "mentor" },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
  embedding: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Guard prevents OverwriteModelError on hot reload / repeated imports in serverless.
export default mongoose.models.User || mongoose.model("User", userSchema);
