# Next.js API routes (work in progress)

These replace the old Express backend one route at a time. See the top-level
`MIGRATION_PLAN.md` for the full port mapping and the rationale behind each pattern.

## What's here so far (templates)

| New route | Replaces | Why it's a useful template |
|---|---|---|
| `POST /api/student/signup`                         | `POST /user/student/signup`                 | Public POST + Joi validation + hashed password |
| `POST /api/student/login`                          | `POST /user/student/login`                  | Login that sets the httpOnly JWT cookie (bug fix: now awaits bcrypt) |
| `GET  /api/student/profile`                        | `GET  /user/student/profile`                | Protected GET using `requireUser(["student"])` |
| `GET  /api/student/previous-chat/[mentorId]`       | `GET  /user/student/previouseChat/:mentorId`| Protected GET with a dynamic route param |
| `POST /api/mentor/login`                           | `POST /user/mentor/login`                   | Login with structured response body |
| `POST /api/mentor/upload-profile`                  | `POST /user/mentor/uploadProfile`           | File upload via native FormData + Cloudinary `upload_stream` (no Multer) |
| `GET  /api/health`                                 | —                                           | Quick DB connectivity check |

## Still to port (22 endpoints)

Use the templates above as reference. Every handler follows the same shape:

```js
export const runtime = "nodejs";
export async function METHOD(req, { params }) {
  try {
    await connectDB();
    const { id, role } = await requireUser([...]);   // for protected routes only
    // ...business logic (same as the old controller body)...
    return NextResponse.json({...});
  } catch (e) {
    return toJsonError(e);
  }
}
```

Full list of what's missing is in `MIGRATION_PLAN.md §6d`.

## Frontend call changes

When you migrate an endpoint, also update the frontend to use same-origin paths:

```diff
- axios.get(`${NEXT_PUBLIC_API_URL}/user/student/previouseChat/${mentorId}`, { withCredentials: true });
+ axios.get(`/api/student/previous-chat/${mentorId}`);
```

`withCredentials` is no longer needed for same-origin calls — cookies are sent automatically.
