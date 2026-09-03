import { Router } from "express";
import { 
  getBlogPosts, 
  getBlogPostBySlug, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from "../controllers/blogController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", getBlogPosts);
router.get("/:slug", getBlogPostBySlug);
router.post("/", authenticate, authorize("admin"), createBlogPost);
router.put("/:id", authenticate, authorize("admin"), updateBlogPost);
router.delete("/:id", authenticate, authorize("admin"), deleteBlogPost);

export default router;
