import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    message: { type: String, required: true },
    source: { type: String, default: "website" },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ContactEnquiry = mongoose.model("ContactEnquiry", contactEnquirySchema);
