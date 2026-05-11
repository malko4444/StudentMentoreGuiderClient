// POST /api/mentor/login
// Replaces:  POST /user/mentor/login   (backend/routes/mentorRoutes.js)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { toJsonError } from "@/lib/apiError";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const mentor = await User.findOne({ email, role: "mentor" });
    if (!mentor) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    const ok = await comparePassword(password, mentor.password);
    if (!ok) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = generateToken(mentor._id, "mentor");
    await setAuthCookie(token);

    const safe = mentor.toObject();
    delete safe.password;

    return NextResponse.json({
      message: "Mentor login successful",
      role: "mentor",
      mentor: safe,
      accessToken: token,
    });
  } catch (e) {
    return toJsonError(e);
  }
}
