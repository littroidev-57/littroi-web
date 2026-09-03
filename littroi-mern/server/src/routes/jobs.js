import { Router } from "express";
import { getJobs, createJob, updateJob, deleteJob } from "../controllers/jobController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getJobs);
router.post("/", authenticate, authorize("admin"), createJob);
router.put("/:id", authenticate, authorize("admin"), updateJob);
router.delete("/:id", authenticate, authorize("admin"), deleteJob);

export default router;
