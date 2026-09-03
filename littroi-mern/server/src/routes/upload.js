import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Configure multer for in-memory buffer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

// Helper function: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "littroi_media") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ==================== POST /api/upload/single ====================
router.post("/single", authenticate, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const result = await uploadToCloudinary(req.file.buffer);
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    });
  } catch (error) {
    console.error("Cloudinary single upload error:", error);
    next(error);
  }
});

// ==================== POST /api/upload/multiple ====================
router.post("/multiple", authenticate, upload.array("images", 12), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No image files provided" });
    }

    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => r.secure_url);
    res.json({
      success: true,
      count: urls.length,
      urls,
      data: results
    });
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    next(error);
  }
});

// ==================== POST /api/upload/base64 ====================
router.post("/base64", authenticate, async (req, res, next) => {
  try {
    const { image, folder = "littroi_media" } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "No image base64 data provided" });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto"
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Cloudinary base64 upload error:", error);
    next(error);
  }
});

export default router;
