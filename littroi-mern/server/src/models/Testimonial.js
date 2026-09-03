import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String, required: true },
    clientCompany: { type: String, required: true },
    clientImage: { type: String },
    testimonial: { type: String, required: true },
    metric: { type: String },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
