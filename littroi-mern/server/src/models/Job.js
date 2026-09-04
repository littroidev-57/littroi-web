import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: "Bareilly (Studio / Remote)" },
    type: { type: String, default: "Full-time" },
    employmentType: { type: String, default: "Full-time" },
    experience: { type: String, default: "2+ Years" },
    salary: { type: String, default: "Competitive" },
    overview: { type: String, default: "" },
    description: { type: String, default: "" },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    slug: { type: String },
    applyEmail: { type: String, default: "careers@littroi.com" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (!this.overview && this.description) {
    this.overview = this.description;
  }
  if (!this.description && this.overview) {
    this.description = this.overview;
  }
  if (!this.employmentType && this.type) {
    this.employmentType = this.type;
  }
  if (!this.type && this.employmentType) {
    this.type = this.employmentType;
  }
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

export const Job = mongoose.model("Job", jobSchema);
