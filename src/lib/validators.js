// src/lib/validators.js
// Joi schemas — ported verbatim from backend/utils/validators.js.
import Joi from "joi";

export const createMentorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(100).required(),
  profession: Joi.string().min(2).max(100).required(),
  experience: Joi.number().min(0).max(100).required(),
  skillLevel: Joi.string()
    .valid("beginner", "intermediate", "advanced", "expert")
    .required(),
  githubUrl: Joi.string().uri().allow("", null),
  linkedinUrl: Joi.string().uri().allow("", null),
});

export const adminSignupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(100).required(),
  password: Joi.string().min(6).required(),
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const studentSignupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  educationLevel: Joi.string().min(2).max(100).required(),
  careerGoals: Joi.string().min(2).max(500).required(),
  interests: Joi.array().items(Joi.string().min(2).max(100)).required(),
  languagePreference: Joi.string().min(2).max(100).required(),
});

export const studentLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
