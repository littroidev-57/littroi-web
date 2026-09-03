import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Showcase Video" },
    client: { type: String, default: "Littroi Client" },
    category: {
      type: String,
      enum: ["our-projects", "podcast-clips", "short-form", "saas-video", "podcast", "short-form-content"],
      default: "our-projects"
    },
    categoryLabel: { type: String, default: "Our Projects" },
    youtubeId: { type: String },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
    aspectRatio: { type: String, default: "16/9" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
