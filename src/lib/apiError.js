// src/lib/apiError.js
// One place to turn thrown errors into JSON responses. Used inside every
// route handler's catch block.
import { NextResponse } from "next/server";
import { AuthError } from "./auth";

export function toJsonError(err) {
  console.error("[api] error:", err?.message || err);

  if (err instanceof AuthError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }

  // Joi validation errors
  if (err && err.isJoi) {
    return NextResponse.json(
      { message: err.details.map((d) => d.message).join(", ") },
      { status: 400 }
    );
  }

  // Mongoose duplicate-key
  if (err && err.code === 11000) {
    return NextResponse.json(
      { message: "Duplicate value for a unique field" },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { message: err?.message || "Server error" },
    { status: 500 }
  );
}
