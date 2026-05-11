// src/lib/db.js
// Cached Mongoose connection for Next.js route handlers (works in dev hot-reload
// and Vercel serverless). Import with: `import { connectDB } from "@/lib/db";`
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== "test") {
  // Do not throw at module load in dev so hot-reload doesn't crash the whole
  // app if the .env is missing a var temporarily. Route handlers will throw.
  console.warn("[lib/db] MONGODB_URI is not set");
}

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
