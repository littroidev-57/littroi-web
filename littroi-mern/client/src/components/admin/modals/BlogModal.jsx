import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { blogAPI, uploadAPI } from "../../../services/api";
import { BlogRichEditor } from "../BlogRichEditor";

export function BlogModal({ isOpen, editingItem, onClose, onSaveSuccess, showToast }) {
  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "Content Strategy",
    author: "Vishal Singh Mahar",
    readTime: "4 min read",
    coverImage: "",
    excerpt: "",
    content: "",
    slug: "",
    tags: ""
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setBlogForm({
        title: editingItem.title || "",
        category: editingItem.category || "Content Strategy",
        author: editingItem.author || "Vishal Singh Mahar",
        readTime: editingItem.readTime || "4 min read",
        coverImage: editingItem.featuredImage || editingItem.coverImage || "",
        excerpt: editingItem.excerpt || "",
        content: editingItem.content || "",
        slug: editingItem.slug || "",
        tags: Array.isArray(editingItem.tags) ? editingItem.tags.join(", ") : (editingItem.tags || "")
      });
    } else {
      setBlogForm({
        title: "",
        category: "Content Strategy",
        author: "Vishal Singh Mahar",
        readTime: "4 min read",
        coverImage: "",
        excerpt: "",
        content: "",
        slug: "",
        tags: ""
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...blogForm,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      featuredImage: blogForm.coverImage,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    try {
      if (editingItem) {
        await blogAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Blog article updated");
      } else {
        await blogAPI.create(payload);
        showToast("New article published");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Blog save error:", err);
      showToast(`❌ Error: ${err.message || "Failed to save article"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-4xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {editingItem ? "Edit Article" : "Write New Article"}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveBlog} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Article Title *</label>
            <input
              type="text"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
              placeholder="e.g. Why Short-Form Content is Dominating B2B SaaS in 2026"
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Category</label>
              <input
                type="text"
                value={blogForm.category}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                placeholder="Content Strategy"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Author Name</label>
              <input
                type="text"
                value={blogForm.author}
                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                placeholder="Vishal Singh Mahar"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Read Time</label>
              <input
                type="text"
                value={blogForm.readTime}
                onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                placeholder="4 min read"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
          </div>

          {/* Direct File Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60">Article Cover Image</label>
            {blogForm.coverImage ? (
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-white/10 bg-[#161616] group">
                <img src={blogForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    const imgToDelete = blogForm.coverImage;
                    setBlogForm({ ...blogForm, coverImage: "" });
                    if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                      try {
                        await uploadAPI.deleteImage(imgToDelete);
                        showToast("Cover image deleted from Cloudinary");
                      } catch {
                        // ignore error
                      }
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 rounded-2xl p-6 bg-[#141414]/50 cursor-pointer transition-all">
                <Plus size={20} className="text-white/40 mb-2" />
                <p className="text-xs font-bold text-white">
                  {isUploadingImage ? "Uploading to Cloudinary..." : "Choose Cover Image"}
                </p>
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
                        setBlogForm((prev) => ({ ...prev, coverImage: url }));
                        showToast("Cover image uploaded to Cloudinary");
                      } catch {
                        showToast("Error uploading cover image");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Short Excerpt *</label>
            <textarea
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              rows={2}
              placeholder="Brief 1-2 sentence preview..."
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/70 flex items-center gap-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                <span>Article Content</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <span className="text-[11px] text-[#B3FFC9] font-mono">
                ✨ Auto-formats pasted text into &lt;h2&gt; and &lt;p&gt;
              </span>
            </div>
            <BlogRichEditor
              value={blogForm.content}
              onChange={(newContent) => setBlogForm((prev) => ({ ...prev, content: newContent }))}
              onAutoSyncReadTime={(time) => setBlogForm((prev) => ({ ...prev, readTime: time }))}
              onAutoFillMetadata={(meta) => {
                setBlogForm((prev) => ({
                  ...prev,
                  title: meta.title || prev.title,
                  excerpt: meta.excerpt || prev.excerpt,
                  slug: meta.slug ? meta.slug.replace(/^\/blog\/?/, "") : prev.slug,
                  tags: meta.tags ? (Array.isArray(meta.tags) ? meta.tags.join(", ") : meta.tags) : prev.tags
                }));
              }}
              placeholder="Paste or write your article content here... headings automatically convert to <h2> and body paragraphs to <p>."
            />
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
              {isSubmitting ? "Saving..." : (editingItem ? "Update Article" : "Publish Article")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
