// GET /api/student/previous-chat/:mentorId
// Replaces:  GET /user/student/previouseChat/:mentorId
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { toJsonError } from "@/lib/apiError";
import Conversation from "@/models/conversationModel";
import Message from "@/models/messageModel";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id: studentId } = await requireUser(["student"]);
    const { mentorId } = await params;

    if (!mentorId) {
      return NextResponse.json(
        { message: "Mentor ID missing" },
        { status: 400 }
      );
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [mentorId, studentId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [studentId, mentorId],
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    const mentor = await User.findById(mentorId).select("name profilePicture");

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      text: msg.text,
      senderId: msg.senderId,
      senderType:
        msg.senderId.toString() === studentId.toString() ? "student" : "mentor",
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({
      mentor: {
        name: mentor?.name || "Unknown Mentor",
        profilePicture: mentor?.profilePicture?.url || null,
      },
      messages: formatted,
    });
  } catch (e) {
    return toJsonError(e);
  }
}
