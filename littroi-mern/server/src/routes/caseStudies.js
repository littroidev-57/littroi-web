import { Router } from "express";
import { 
  getCaseStudies, 
  getCaseStudyBySlug, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy 
} from "../controllers/caseStudyController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getCaseStudies);
router.get("/:slug", getCaseStudyBySlug);
router.post("/", authenticate, authorize("admin"), createCaseStudy);
router.put("/:id", authenticate, authorize("admin"), updateCaseStudy);
router.delete("/:id", authenticate, authorize("admin"), deleteCaseStudy);

export default router;
