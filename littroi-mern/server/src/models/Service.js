import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String },
    features: [{ type: String }],
    icon: { type: String, default: "Sparkles" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
