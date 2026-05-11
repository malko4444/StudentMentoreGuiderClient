// GET /api/student/profile
// Replaces:  GET /user/student/profile   (protected by studentVerification)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { toJsonError } from "@/lib/apiError";
import Student from "@/models/Student";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    const { id } = await requireUser(["student"]);

    const student = await Student.findById(id).select("-password");
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Student profile fetched successfully",
      student,
    });
  } catch (e) {
    return toJsonError(e);
  }
}
