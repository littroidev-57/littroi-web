import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: "Remote (Global)" },
    employmentType: { type: String, default: "Full-time" },
    experience: { type: String },
    salary: { type: String },
    overview: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    applyEmail: { type: String, default: "careers@littroi.com" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
