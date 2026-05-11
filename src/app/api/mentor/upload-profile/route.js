// POST /api/mentor/upload-profile
// Replaces:  POST /user/mentor/uploadProfile
// Drops Multer — uses native FormData + Cloudinary upload_stream.
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { uploadBuffer } from "@/lib/cloudinary";
import { toJsonError } from "@/lib/apiError";
import User from "@/models/User";

export const runtime = "nodejs"; // Cloudinary SDK needs Node, not Edge

export async function POST(req) {
  try {
    await connectDB();
    const { id: mentorId } = await requireUser(["mentor"]);

    const form = await req.formData();
    const file = form.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "No image file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadBuffer(buffer, "mentor_ai_profiles");

    const updated = await User.findByIdAndUpdate(
      mentorId,
      {
        $set: {
          "profilePicture.url": uploaded.secure_url,
          "profilePicture.filename": uploaded.public_id,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile picture uploaded successfully",
      profilePicture: updated.profilePicture,
    });
  } catch (e) {
    return toJsonError(e);
  }
}
