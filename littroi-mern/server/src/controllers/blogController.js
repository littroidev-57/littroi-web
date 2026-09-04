import { BlogPost } from "../models/BlogPost.js";

export const getBlogPosts = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let post = await BlogPost.findOne({ slug: param });
    if (!post && param.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findById(param);
    }
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createBlogPost = async (req, res, next) => {
  try {
    const slug = req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const post = await BlogPost.create({
      ...req.body,
      slug,
      isPublished: true
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    // Automatically remove Cloudinary featured image
    if (post.featuredImage) {
      const { deleteFromCloudinary } = await import("../config/cloudinary.js");
      await deleteFromCloudinary(post.featuredImage);
    }

    res.json({ success: true, message: "Blog post and associated image deleted" });
  } catch (error) {
    next(error);
  }
};
