import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    clientName: { type: String },
    role: { type: String, required: true },
    clientRole: { type: String },
    company: { type: String, default: "" },
    clientCompany: { type: String, default: "" },
    quote: { type: String, default: "" },
    testimonial: { type: String, default: "" },
    avatar: { type: String, default: "" },
    clientImage: { type: String, default: "" },
    type: { type: String, default: "video" },
    videoId: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    videoFirst: { type: Boolean, default: true },
    metric: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

testimonialSchema.pre("save", function (next) {
  if (!this.clientName && this.name) this.clientName = this.name;
  if (!this.name && this.clientName) this.name = this.clientName;
  if (!this.clientRole && this.role) this.clientRole = this.role;
  if (!this.role && this.clientRole) this.role = this.clientRole;
  if (!this.testimonial && this.quote) this.testimonial = this.quote;
  if (!this.quote && this.testimonial) this.quote = this.testimonial;
  if (!this.clientImage && this.avatar) this.clientImage = this.avatar;
  if (!this.avatar && this.clientImage) this.avatar = this.clientImage;
  
  if (this.videoUrl && !this.videoId) {
    const match = this.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (match) this.videoId = match[1];
  }
  next();
});

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

