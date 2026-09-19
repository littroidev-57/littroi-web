import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Video } from "lucide-react";
import { testimonialsAPI, uploadAPI } from "../../../services/api";

export function TestimonialModal({
  isOpen,
  editingItem,
  testimonialsCount = 0,
  onClose,
  onSaveSuccess,
  showToast
}) {
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "",
    type: "video",
    videoUrl: "",
    videoId: "",
    videoFirst: true,
    quote: "",
    metric: "",
    rating: 5,
    order: 0,
    isActive: true
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      const vidId =
        editingItem.videoId ||
        (editingItem.videoUrl
          ? editingItem.videoUrl.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
          )?.[1]
          : "") ||
        "";

      setTestimonialForm({
        name: editingItem.name || editingItem.clientName || "",
        role: editingItem.role || editingItem.clientRole || "",
        company: editingItem.company || editingItem.clientCompany || "",
        avatar: editingItem.avatar || editingItem.clientImage || "",
        type: "video",
        videoUrl: editingItem.videoUrl || (vidId ? `https://www.youtube.com/watch?v=${vidId}` : ""),
        videoId: vidId,
        videoFirst: editingItem.videoFirst !== undefined ? editingItem.videoFirst : true,
        quote: editingItem.quote || editingItem.testimonial || "",
        metric: editingItem.metric || "",
        rating: editingItem.rating || 5,
        order: editingItem.order !== undefined ? editingItem.order : 0,
        isActive: editingItem.isActive !== undefined ? editingItem.isActive : true
      });
    } else {
      setTestimonialForm({
        name: "",
        role: "",
        company: "",
        avatar: "",
        type: "video",
        videoUrl: "",
        videoId: "",
        videoFirst: true,
        quote: "",
        metric: "",
        rating: 5,
        order: testimonialsCount,
        isActive: true
      });
    }
  }, [editingItem, isOpen, testimonialsCount]);

  if (!isOpen) return null;

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name) {
      showToast("Please provide client or creator name");
      return;
    }
    if (!testimonialForm.videoUrl && !testimonialForm.videoId) {
      showToast("Please provide a YouTube video URL or ID for the video testimonial");
      return;
    }

    let extractedVideoId = testimonialForm.videoId || "";
    if (testimonialForm.videoUrl && !extractedVideoId) {
      const match = testimonialForm.videoUrl.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
      );
      if (match) extractedVideoId = match[1];
      else extractedVideoId = testimonialForm.videoUrl.trim();
    }

    const payload = {
      ...testimonialForm,
      type: "video",
      videoUrl: testimonialForm.videoUrl,
      videoId: extractedVideoId,
      clientName: testimonialForm.name,
      clientRole: testimonialForm.role,
      clientCompany: testimonialForm.company,
      clientImage: testimonialForm.avatar,
      testimonial: testimonialForm.quote,
      quote: testimonialForm.quote || "Video Testimonial"
    };

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await testimonialsAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Video testimonial updated successfully ✓");
      } else {
        await testimonialsAPI.create(payload);
        showToast("New video testimonial added successfully ✓");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Testimonial save error:", err);
      showToast(`❌ Error: ${err.message || "Could not save testimonial"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              {editingItem ? "Edit Video Testimonial" : "Add Video Testimonial"}
            </h3>
            <p className="text-xs text-white/40">Manage client video reviews displayed on the website</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveTestimonial} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Client / Creator Name *</label>
              <input
                type="text"
                required
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                placeholder="Enter client name..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Role / Title *</label>
              <input
                type="text"
                required
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                placeholder="e.g. Founder / Creator / CEO..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Company / Brand (Optional)</label>
              <input
                type="text"
                value={testimonialForm.company}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                placeholder="Company or Brand name..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Display Order</label>
              <input
                type="number"
                value={testimonialForm.order}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, order: Number(e.target.value) })}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Rating</label>
              <select
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Key Result Metric (Optional)</label>
              <input
                type="text"
                value={testimonialForm.metric}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, metric: e.target.value })}
                placeholder="e.g. +227% Retention Lift or 15h Saved/Week"
                className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
          </div>

          {/* YouTube Video Link & Position (Video Testimonial) */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#141414] border border-white/10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">YouTube Testimonial Video Link / ID *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={testimonialForm.videoUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    const match = url.match(
                      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
                    );
                    setTestimonialForm({
                      ...testimonialForm,
                      videoUrl: url,
                      videoId: match ? match[1] : url
                    });
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                />
                <Video size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              </div>
              {testimonialForm.videoId && (
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={`https://img.youtube.com/vi/${testimonialForm.videoId}/hqdefault.jpg`}
                    alt="Video Preview"
                    className="w-24 aspect-video rounded-lg object-cover border border-white/15"
                  />
                  <span className="text-[11px] font-mono text-[#B3FFC9]">
                    ✓ Video ID: {testimonialForm.videoId}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="text-xs font-bold text-white/60">Home Page Video Alignment</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialForm({ ...testimonialForm, videoFirst: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${testimonialForm.videoFirst
                    ? "bg-[#B3FFC9] text-black"
                    : "bg-white/5 text-white/60 hover:text-white"
                    }`}
                >
                  Left: Video | Right: Text
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialForm({ ...testimonialForm, videoFirst: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!testimonialForm.videoFirst
                    ? "bg-[#B3FFC9] text-black"
                    : "bg-white/5 text-white/60 hover:text-white"
                    }`}
                >
                  Left: Text | Right: Video
                </button>
              </div>
            </div>
          </div>

          {/* Client Avatar Upload to Cloudinary */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60">Client Avatar / Photo (Cloudinary Direct Upload)</label>
            {testimonialForm.avatar ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#141414] border border-white/10">
                <img
                  src={testimonialForm.avatar}
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-full object-cover border border-white/20 p-0.5 bg-white/5"
                />
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-white truncate">Client Photo Uploaded</p>
                  <p className="text-[11px] text-[#B3FFC9] font-mono truncate">{testimonialForm.avatar}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const avatarToDelete = testimonialForm.avatar;
                    setTestimonialForm({ ...testimonialForm, avatar: "" });
                    if (avatarToDelete && avatarToDelete.includes("cloudinary.com")) {
                      try {
                        await uploadAPI.deleteImage(avatarToDelete);
                        showToast("Avatar removed from Cloudinary");
                      } catch {
                        // ignore error
                      }
                    }
                  }}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="Delete avatar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 bg-[#141414]/50 hover:bg-[#141414] text-xs text-white/70 hover:text-[#B3FFC9] cursor-pointer transition-all">
                <Plus size={16} />
                <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Client Avatar / Headshot (PNG, JPG)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploadingImage(true);
                      try {
                        const url = await uploadAPI.uploadSingle(file);
                        setTestimonialForm((prev) => ({ ...prev, avatar: url }));
                        showToast("Avatar uploaded to Cloudinary");
                      } catch {
                        showToast("Error uploading avatar");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Testimonial Quote */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Client Testimonial Feedback Quote *</label>
            <textarea
              required
              rows={4}
              value={testimonialForm.quote}
              onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
              placeholder="Write client testimonial quote / feedback here..."
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={testimonialForm.isActive}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded bg-[#161616] border-white/20 text-[#B3FFC9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="font-bold">Publish &amp; Show on Live Home Page</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer disabled:opacity-50"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {isSubmitting ? "Saving..." : (editingItem ? "Update Testimonial" : "Add to Home Page")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
