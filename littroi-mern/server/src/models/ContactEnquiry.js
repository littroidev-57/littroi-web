import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    message: { type: String, required: true },
    source: { type: String, default: "website" },
    status: { type: String, enum: ["New", "Reviewed", "Contacted", "Archived"], default: "New" },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ContactEnquiry = mongoose.model("ContactEnquiry", contactEnquirySchema);
