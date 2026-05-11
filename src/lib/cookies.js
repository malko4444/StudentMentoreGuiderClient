// src/lib/cookies.js
import { cookies } from "next/headers";

export async function setAuthCookie(token) {
  const store = await cookies();
  store.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete("token");
}
