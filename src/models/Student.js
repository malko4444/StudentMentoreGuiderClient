// src/models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  educationLevel: { type: String, required: true, trim: true },
  careerGoals: { type: String, required: true, trim: true },
  interests: { type: [String], required: true },
  languagePreference: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, default: null, trim: true },
  academicLevel: { type: String, default: null, trim: true },
  profilePicture: {
    url: { type: String, default: null },
    filename: { type: String, default: null },
  },
});

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
