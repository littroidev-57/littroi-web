import { Router } from "express";
import { 
  getTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from "../controllers/testimonialController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getTestimonials);
router.post("/", authenticate, authorize("admin"), createTestimonial);
router.put("/:id", authenticate, authorize("admin"), updateTestimonial);
router.delete("/:id", authenticate, authorize("admin"), deleteTestimonial);

export default router;
