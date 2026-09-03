import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import servicesRoutes from "./routes/services.js";
import projectsRoutes from "./routes/projects.js";
import caseStudiesRoutes from "./routes/caseStudies.js";
import blogRoutes from "./routes/blog.js";
import jobsRoutes from "./routes/jobs.js";
import testimonialsRoutes from "./routes/testimonials.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

// Security Headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS Config — Allows Vite dev server on any localhost port (5173, 5174, etc.)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options("*", cors());


// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Request Parsers & Rate Limiter
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/", apiLimiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Littroi API",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/case-studies", caseStudiesRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
