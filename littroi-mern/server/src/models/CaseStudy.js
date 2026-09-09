import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String },
    slug: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    handle: { type: String },
    initials: { type: String },
    thumbColor: { type: String, default: "#B3FFC9" },
    category: { type: String, default: "Instagram Growth" },
    cardCat: { type: String },
    num: { type: String },
    tags: [{ type: String }],
    filters: [{ type: String }],
    coverImage: { type: String },
    images: [{ type: String }], // Multiple images support
    beforeImage: { type: String },
    afterImage: { type: String },
    beforeLabel: { type: String, default: "Before" },
    afterLabel: { type: String, default: "After" },
    beforeAfter: [
      {
        beforeImage: { type: String },
        afterImage: { type: String },
        beforeLabel: { type: String, default: "Before" },
        afterLabel: { type: String, default: "After" },
        title: { type: String }
      }
    ],
    videoUrl: { type: String },
    stats: [
      {
        num: { type: String },
        label: { type: String }
      }
    ],
    metrics: [
      {
        label: { type: String },
        value: { type: String }
      }
    ],
    challenge: { type: String },
    approach: { type: String },
    solution: { type: String },
    shortDescription: { type: String },
    description: { type: String },
    deliverables: [{ type: String }],
    testimonial: {
      quote: String,
      author: String,
      role: String
    },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
