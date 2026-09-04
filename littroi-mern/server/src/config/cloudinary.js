import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Extracts Cloudinary public_id from a full URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v1234567890/littroi_media/sample.jpg
 * returns: littroi_media/sample
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove version tag (e.g., v1725441234/) if present
    path = path.replace(/^v\d+\//, "");
    // Remove file extension
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return decodeURIComponent(path);
  } catch (err) {
    return null;
  }
};

/**
 * Deletes an image or array of images from Cloudinary directly.
 */
export const deleteFromCloudinary = async (urlsOrPublicIds) => {
  if (!urlsOrPublicIds) return null;
  const items = Array.isArray(urlsOrPublicIds) ? urlsOrPublicIds : [urlsOrPublicIds];

  const results = [];
  for (const item of items) {
    if (!item) continue;
    try {
      let publicId = item;
      if (typeof item === "string" && (item.startsWith("http://") || item.startsWith("https://"))) {
        publicId = getPublicIdFromUrl(item);
      }
      if (publicId) {
        const res = await cloudinary.uploader.destroy(publicId);
        console.log(`[Cloudinary Delete] Removed ${publicId}:`, res.result);
        results.push({ publicId, result: res.result });
      }
    } catch (err) {
      console.warn(`[Cloudinary Delete Warning] Could not delete ${item}:`, err.message);
    }
  }
  return results;
};

export default cloudinary;

