// src/lib/auth.js
// Shared server-side auth helpers used by every protected API route.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = (plain, hashed) =>
  bcrypt.compare(plain, hashed);

export const generateToken = (userId, role = "student") =>
  jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError("Invalid or expired token", 401);
  }
}

/**
 * Call this at the top of any protected route handler.
 * @param {string[] | null} allowedRoles - e.g. ["mentor"], ["student", "mentor"], or null for "any logged-in user"
 * @returns {Promise<{id: string, role: string}>}
 */
export async function requireUser(allowedRoles = null) {
  const store = await cookies();
  // Accept either "token" or "authToken" (same as the old Express middleware)
  const token = store.get("token")?.value || store.get("authToken")?.value;
  if (!token) throw new AuthError("Authorization token missing", 401);

  const decoded = verifyToken(token);
  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    throw new AuthError("Forbidden: insufficient role", 403);
  }
  return decoded;
}
