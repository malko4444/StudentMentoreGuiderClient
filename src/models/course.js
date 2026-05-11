// src/models/course.js
import mongoose from "mongoose";

const syllabusItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: null },
  durationMinutes: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: null, trim: true },
    description: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0 },
    durationHours: { type: Number, default: 0 },
    syllabus: { type: [syllabusItemSchema], default: [] },
    tags: { type: [String], default: [] },
    thumbnail: {
      url: { type: String, default: null },
      filename: { type: String, default: null },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
