import { BlogPost } from "../models/BlogPost.js";

export const getBlogPosts = async (req, res, next) => {
  try {
    const { category, search, page, limit, all } = req.query;
    const filter = all === "true" ? {} : { isPublished: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    const total = await BlogPost.countDocuments(filter);
    let query = BlogPost.find(filter).sort({ createdAt: -1 });

    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const posts = await query;
      return res.json({
        success: true,
        count: posts.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        data: posts
      });
    }

    const posts = await query;
    res.json({
      success: true,
      count: posts.length,
      total,
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

export const recordBlogView = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let query = { slug: param };
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ slug: param }, { _id: param }] };
    }
    const post = await BlogPost.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true, timestamps: false }
    );
    if (!post) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }
    res.json({ success: true, views: post.views });
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
