import { Router } from "express";
import { getServices, createService, updateService, deleteService } from "../controllers/serviceController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getServices);
router.post("/", authenticate, authorize("admin"), createService);
router.put("/:id", authenticate, authorize("admin"), updateService);
router.delete("/:id", authenticate, authorize("admin"), deleteService);

export default router;
