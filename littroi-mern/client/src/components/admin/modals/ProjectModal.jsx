import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { projectsAPI, uploadAPI } from "../../../services/api";

export function ProjectModal({
  isOpen,
  editingItem,
  onClose,
  onSaveSuccess,
  showToast
}) {
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "our-projects",
    categoryLabel: "Our Projects",
    videoUrl: "",
    youtubeId: "",
    thumbnail: "",
    aspectRatio: "16/9",
    order: 1
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setProjectForm({
        title: editingItem.title || "",
        category: editingItem.category || "our-projects",
        categoryLabel: editingItem.categoryLabel || "Our Projects",
        videoUrl: editingItem.videoUrl || "",
        youtubeId: editingItem.youtubeId || "",
        thumbnail: editingItem.thumbnail || "",
        aspectRatio:
          editingItem.aspectRatio ||
          (editingItem.category === "our-projects" || editingItem.category === "saas-video" ? "16/9" : "9/16"),
        order: editingItem.order || 1
      });
    } else {
      setProjectForm({
        title: "",
        category: "our-projects",
        categoryLabel: "Our Projects",
        videoUrl: "",
        youtubeId: "",
        thumbnail: "",
        aspectRatio: "16/9",
        order: 1
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSaveProject = async (e) => {
    e.preventDefault();

    const inputVal = (projectForm.youtubeId || projectForm.videoUrl || "").trim();
    let yId = inputVal;
    const match = inputVal.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*)/
    );
    if (match && match[1]) {
      yId = match[1];
    }

    const catLabel =
      projectForm.category === "our-projects"
        ? "Our Projects"
        : projectForm.category === "saas-video"
          ? "SaaS Video"
          : projectForm.category === "podcast-clips"
            ? "Podcast Clips"
            : "Short Form Content";

    const defaultThumb =
      projectForm.category === "our-projects" || projectForm.category === "saas-video"
        ? `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`
        : `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;

    const payload = {
      ...projectForm,
      order: Number(projectForm.order) || 1,
      youtubeId: yId,
      videoUrl:
        projectForm.videoUrl ||
        (projectForm.category === "our-projects" || projectForm.category === "saas-video"
          ? `https://www.youtube.com/watch?v=${yId}`
          : `https://www.youtube.com/shorts/${yId}`),
      categoryLabel: catLabel,
      thumbnail: projectForm.thumbnail || defaultThumb,
      aspectRatio: projectForm.category === "our-projects" || projectForm.category === "saas-video" ? "16/9" : "9/16"
    };

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await projectsAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Home video showcase updated");
      } else {
        await projectsAPI.create({
          ...payload,
          createdAt: new Date().toISOString()
        });
        showToast("New video showcase added to Home");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Project save error:", err);
      showToast(`❌ Error: ${err.message || "Failed to save video"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              {editingItem ? "Edit Home Video" : "Add Video to Home"}
            </h3>
            <p className="text-xs text-white/40">Manage videos for Our Projects, SaaS Video, Podcast Clips &amp; Short Form</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveProject} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Video Title / Name</label>
            <input
              type="text"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. SaaS Launch Film"
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Home Section / Category *</label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              >
                <option value="our-projects">Our Projects (16:9 Landscape Slider)</option>
                <option value="saas-video">SaaS Video (16:9 Showcase)</option>
                <option value="podcast-clips">Podcast Clips (9:16 Vertical Reels)</option>
                <option value="short-form">Short Form Content (9:16 Vertical Reels)</option>
              </select>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white/60">Sequence / Order</label>
                <span className="text-[10px] text-[#B3FFC9] font-mono">1 = First</span>
              </div>
              <input
                type="number"
                min="1"
                value={projectForm.order}
                onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none font-bold text-[#B3FFC9]"
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">YouTube Video URL or Shorts Link *</label>
            <input
              type="text"
              value={projectForm.videoUrl}
              onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              required
            />
            <p className="text-[11px] text-white/40 font-mono">
              Video ID and thumbnail will be automatically detected.
            </p>
          </div>

          {/* Optional Custom Thumbnail */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-white/60">Custom Thumbnail Image (Optional)</label>
            {projectForm.thumbnail ? (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 bg-[#161616] group">
                <img src={projectForm.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    const thumbToDelete = projectForm.thumbnail;
                    setProjectForm({ ...projectForm, thumbnail: "" });
                    if (thumbToDelete && thumbToDelete.includes("cloudinary.com")) {
                      try {
                        await uploadAPI.deleteImage(thumbToDelete);
                        showToast("Thumbnail deleted from Cloudinary");
                      } catch {
                        // ignore error
                      }
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-xs text-white/60 hover:text-white cursor-pointer">
                <ImageIcon size={16} className="text-[#B3FFC9]" />
                <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Custom Thumbnail (or leave empty for YouTube cover)"}</span>
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
                        setProjectForm((prev) => ({ ...prev, thumbnail: url }));
                        showToast("Thumbnail uploaded to Cloudinary");
                      } catch {
                        showToast("Error uploading thumbnail");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />
              </label>
            )}
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
              {isSubmitting ? "Saving..." : (editingItem ? "Update Video" : "Add to Home")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
