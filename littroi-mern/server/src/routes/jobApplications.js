import { Router } from "express";
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication
} from "../controllers/jobApplicationController.js";
import { authenticate } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", contactLimiter, submitApplication);
router.get("/", authenticate, getApplications);
router.put("/:id", authenticate, updateApplicationStatus);
router.delete("/:id", authenticate, deleteApplication);

export default router;
