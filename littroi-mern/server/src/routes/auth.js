import { Router } from "express";
import { login, getMe, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;

