// POST /api/student/signup
// Replaces:  POST /user/student/signup   (backend/routes/studentRoutes.js)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { studentSignupSchema } from "@/lib/validators";
import { toJsonError } from "@/lib/apiError";
import Student from "@/models/Student";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { error, value } = studentSignupSchema.validate(body);
    if (error) throw error;

    const hashed = await hashPassword(value.password);
    const student = await Student.create({ ...value, password: hashed });

    // Don't leak the hash back to the client.
    const safe = student.toObject();
    delete safe.password;

    return NextResponse.json(
      { message: "Student signed up successfully", student: safe },
      { status: 201 }
    );
  } catch (e) {
    return toJsonError(e);
  }
}
