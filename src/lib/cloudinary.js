// src/lib/cloudinary.js
// Cloudinary SDK config + an upload helper that accepts a Buffer (what you get
// from FormData in Next.js route handlers). Replaces multer + multer-storage-cloudinary.
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  // NOTE: Uses CLOUDINARY_NAME (same var the old backend used).
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a raw Buffer to Cloudinary and return the result.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadBuffer(buffer, folder = "mentor_ai_profiles") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export { cloudinary };
