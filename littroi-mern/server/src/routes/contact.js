import { Router } from "express";
import { 
  submitContact, 
  getEnquiries, 
  markEnquiryAsRead, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/", contactLimiter, submitContact);
router.get("/", authenticate, getEnquiries);
router.get("/enquiries", authenticate, getEnquiries);
router.put("/enquiries/:id/read", authenticate, markEnquiryAsRead);
router.put("/:id", authenticate, updateEnquiryStatus);
router.delete("/:id", authenticate, deleteEnquiry);

export default router;

