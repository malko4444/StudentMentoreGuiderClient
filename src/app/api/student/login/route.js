// POST /api/student/login
// Replaces:  POST /user/student/login   (backend/routes/studentRoutes.js)
//
// NOTE: The original Express version was missing `await` on comparePassword,
// which meant ANY password was accepted. This version awaits correctly.
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { studentLoginSchema } from "@/lib/validators";
import { toJsonError } from "@/lib/apiError";
import Student from "@/models/Student";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { error, value } = studentLoginSchema.validate(body);
    if (error) throw error;

    const student = await Student.findOne({ email: value.email });
    if (!student) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    const ok = await comparePassword(value.password, student.password);
    if (!ok) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = generateToken(student._id, "student");
    await setAuthCookie(token);

    return NextResponse.json({
      message: "Student login successful",
      accessToken: token,
      role: "student",
    });
  } catch (e) {
    return toJsonError(e);
  }
}
