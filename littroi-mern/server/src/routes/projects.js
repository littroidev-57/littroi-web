import { Router } from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getProjects);
router.post("/", authenticate, authorize("admin"), createProject);
router.put("/:id", authenticate, authorize("admin"), updateProject);
router.delete("/:id", authenticate, authorize("admin"), deleteProject);

export default router;
