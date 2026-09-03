import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    readTime: { type: String, default: "4 min read" },
    date: { type: String },
    author: { type: mongoose.Schema.Types.Mixed, default: "Vishal Singh Mahar" },
    featuredImage: { type: String, required: true },
    coverImage: { type: String },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);
