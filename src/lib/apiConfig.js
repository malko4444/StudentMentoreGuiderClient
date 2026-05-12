const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

export const API_BASE = rawApiUrl.replace(/\/+$|^\s+|\s+$/g, "") || "http://localhost:4000";
