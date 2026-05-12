const rawFrontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() || "";

export const FRONTEND_BASE = rawFrontendUrl.replace(/\/+$|^\s+|\s+$/g, "") || "https://student-mentore-guider-client.vercel.app";

export const NAVIGATION_URLS = {
  MENTOR_SIGNUP: `${FRONTEND_BASE}/mentor/signup`,
  STUDENT_SIGNUP: `${FRONTEND_BASE}/student/signup`,
  MENTOR_LOGIN: `${FRONTEND_BASE}/mentor/login`,
  STUDENT_LOGIN: `${FRONTEND_BASE}/student/login`,
  ADMIN_LOGIN: `${FRONTEND_BASE}/admin/login`,
};
