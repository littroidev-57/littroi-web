import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { caseStudiesAPI, uploadAPI } from "../../../services/api";

export function CaseStudyModal({
  isOpen,
  editingItem,
  onClose,
  onSaveSuccess,
  showToast
}) {
  const [csForm, setCsForm] = useState({
    title: "",
    client: "",
    handle: "",
    thumbnail: "",
    category: "Instagram Growth",
    images: [],
    tags: "Editing, Distribution",
    stat1Num: "",
    stat1Label: "Views / 30d",
    stat2Num: "",
    stat2Label: "Interactions",
    stat3Num: "",
    stat3Label: "Accounts reached",
    beforeAfter: [
      {
        beforeImage: "",
        afterImage: "",
        beforeLabel: "Before",
        afterLabel: "After",
        title: ""
      }
    ],
    beforeImage: "",
    afterImage: "",
    beforeLabel: "Before",
    afterLabel: "After",
    challenge: "",
    approach: "",
    description: ""
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      const existingImages = Array.isArray(editingItem.images)
        ? editingItem.images.length === 1 &&
          (editingItem.images[0] === editingItem.thumbnail || editingItem.images[0] === editingItem.coverImage)
          ? []
          : editingItem.images
        : [];

      const stats =
        editingItem.stats ||
        (editingItem.metrics ? editingItem.metrics.map((m) => ({ num: m.value, label: m.label })) : []);

      let baPairs = [];
      if (Array.isArray(editingItem.beforeAfter) && editingItem.beforeAfter.length > 0) {
        baPairs = editingItem.beforeAfter.map((p) => ({
          beforeImage: p.beforeImage || "",
          afterImage: p.afterImage || "",
          beforeLabel: p.beforeLabel || "Before",
          afterLabel: p.afterLabel || "After",
          title: p.title || ""
        }));
      } else if (editingItem.beforeImage || editingItem.afterImage) {
        baPairs = [
          {
            beforeImage: editingItem.beforeImage || "",
            afterImage: editingItem.afterImage || "",
            beforeLabel: editingItem.beforeLabel || "Before",
            afterLabel: editingItem.afterLabel || "After",
            title: ""
          }
        ];
      } else {
        baPairs = [
          {
            beforeImage: "",
            afterImage: "",
            beforeLabel: "Before",
            afterLabel: "After",
            title: ""
          }
        ];
      }

      setCsForm({
        title: editingItem.title || editingItem.name || "",
        client: editingItem.client || editingItem.handle || "",
        handle: editingItem.handle || editingItem.client || "",
        thumbnail: editingItem.thumbnail || editingItem.coverImage || "",
        category: editingItem.category || "Instagram Growth",
        images: existingImages,
        tags: Array.isArray(editingItem.tags)
          ? editingItem.tags.join(", ")
          : editingItem.tags || "Editing, Distribution",
        stat1Num: stats[0]?.num || editingItem.metric || "",
        stat1Label: stats[0]?.label || editingItem.metricLabel || "Views / 30d",
        stat2Num: stats[1]?.num || "",
        stat2Label: stats[1]?.label || "Interactions",
        stat3Num: stats[2]?.num || "",
        stat3Label: stats[2]?.label || "Accounts reached",
        beforeAfter: baPairs,
        beforeImage: baPairs[0]?.beforeImage || editingItem.beforeImage || "",
        afterImage: baPairs[0]?.afterImage || editingItem.afterImage || "",
        beforeLabel: baPairs[0]?.beforeLabel || editingItem.beforeLabel || "Before",
        afterLabel: baPairs[0]?.afterLabel || editingItem.afterLabel || "After",
        challenge: editingItem.challenge || "",
        approach: editingItem.approach || "",
        description: editingItem.description || editingItem.shortDescription || ""
      });
    } else {
      setCsForm({
        title: "",
        client: "",
        handle: "",
        thumbnail: "",
        category: "Instagram Growth",
        images: [],
        tags: "Editing, Distribution",
        stat1Num: "",
        stat1Label: "Views / 30d",
        stat2Num: "",
        stat2Label: "Interactions",
        stat3Num: "",
        stat3Label: "Accounts reached",
        beforeAfter: [
          {
            beforeImage: "",
            afterImage: "",
            beforeLabel: "Before",
            afterLabel: "After",
            title: ""
          }
        ],
        beforeImage: "",
        afterImage: "",
        beforeLabel: "Before",
        afterLabel: "After",
        challenge: "",
        approach: "",
        description: ""
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const addCsBeforeAfterPair = () => {
    setCsForm((prev) => ({
      ...prev,
      beforeAfter: [
        ...(prev.beforeAfter || []),
        { beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }
      ]
    }));
  };

  const removeCsBeforeAfterPair = async (index) => {
    const pair = csForm.beforeAfter?.[index];
    if (pair) {
      if (pair.beforeImage && pair.beforeImage.includes("cloudinary.com")) {
        try {
          await uploadAPI.deleteImage(pair.beforeImage);
        } catch (e) {
          console.error(e);
        }
      }
      if (pair.afterImage && pair.afterImage.includes("cloudinary.com")) {
        try {
          await uploadAPI.deleteImage(pair.afterImage);
        } catch (e) {
          console.error(e);
        }
      }
    }
    setCsForm((prev) => {
      const updated = (prev.beforeAfter || []).filter((_, i) => i !== index);
      return {
        ...prev,
        beforeAfter:
          updated.length > 0
            ? updated
            : [{ beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }]
      };
    });
  };

  const updateCsBeforeAfterPair = (index, field, value) => {
    setCsForm((prev) => {
      const updated = [...(prev.beforeAfter || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, beforeAfter: updated };
    });
  };

  const handleSaveCs = async (e) => {
    e.preventDefault();
    const statsArray = [];
    if (csForm.stat1Num) statsArray.push({ num: csForm.stat1Num, label: csForm.stat1Label });
    if (csForm.stat2Num) statsArray.push({ num: csForm.stat2Num, label: csForm.stat2Label });
    if (csForm.stat3Num) statsArray.push({ num: csForm.stat3Num, label: csForm.stat3Label });

    const calculatedInitials = csForm.title
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const cleanBeforeAfter = (csForm.beforeAfter || []).filter(
      (p) => p.beforeImage || p.afterImage || (p.title && p.title.trim())
    );
    const firstPair = cleanBeforeAfter[0] || (csForm.beforeAfter && csForm.beforeAfter[0]) || {};

    const payload = {
      ...csForm,
      name: csForm.title,
      initials: calculatedInitials,
      handle: csForm.handle || csForm.client,
      slug: csForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tags:
        typeof csForm.tags === "string"
          ? csForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : csForm.tags || [],
      stats: statsArray,
      metrics: statsArray.map((s) => ({ value: s.num, label: s.label })),
      metric: csForm.stat1Num || "10M+",
      metricLabel: csForm.stat1Label || "Views",
      thumbnail: csForm.thumbnail || csForm.images[0] || "",
      coverImage: csForm.thumbnail || csForm.images[0] || "",
      beforeAfter: cleanBeforeAfter,
      beforeImage: firstPair.beforeImage || csForm.beforeImage || "",
      afterImage: firstPair.afterImage || csForm.afterImage || "",
      beforeLabel: firstPair.beforeLabel || csForm.beforeLabel || "Before",
      afterLabel: firstPair.afterLabel || csForm.afterLabel || "After",
      shortDescription:
        csForm.description ||
        `${csForm.challenge ? `Challenge: ${csForm.challenge} ` : ""}${csForm.approach ? `Approach: ${csForm.approach}` : ""}`
    };

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await caseStudiesAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Case study updated successfully");
      } else {
        await caseStudiesAPI.create(payload);
        showToast("New case study added to showcase");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Case study save error:", err);
      showToast(`❌ Error: ${err.message || "Failed to save case study"}`);
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
              {editingItem ? "Edit Case Study" : "Add New Case Study"}
            </h3>
            <p className="text-xs text-white/40">Provide project details and multiple results screenshots</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveCs} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Project Title *</label>
            <input
              type="text"
              value={csForm.title}
              onChange={(e) => setCsForm({ ...csForm, title: e.target.value })}
              placeholder="e.g. Dream Talks"
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Client / Handle *</label>
              <input
                type="text"
                value={csForm.client}
                onChange={(e) => setCsForm({ ...csForm, client: e.target.value })}
                placeholder="e.g. 13 Dream Consultants · @13dreamsconsultants"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Category</label>
              <select
                value={csForm.category}
                onChange={(e) => setCsForm({ ...csForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              >
                <option value="Instagram Growth">Instagram Growth</option>
                <option value="YouTube Growth">YouTube Growth</option>
                <option value="Retention Strategy">Retention Strategy</option>
                <option value="Thumbnail & SEO">Thumbnail &amp; SEO</option>
                <option value="Social Media Management">Social Media Management</option>
                <option value="Channel Growth">Channel Growth</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Tags (comma separated)</label>
            <input
              type="text"
              value={csForm.tags}
              onChange={(e) => setCsForm({ ...csForm, tags: e.target.value })}
              placeholder="Editing, Distribution, Short Form"
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
            />
          </div>

          {/* Cover Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60">
              Listing Cover Thumbnail (Shows on Case Studies cards)
            </label>
            {csForm.thumbnail ? (
              <div className="relative rounded-xl overflow-hidden aspect-video max-w-sm border border-white/15 bg-[#161616]">
                <img src={csForm.thumbnail} alt="Case Study Thumbnail" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={async () => {
                    const thumbToDelete = csForm.thumbnail;
                    setCsForm({ ...csForm, thumbnail: "" });
                    if (thumbToDelete && thumbToDelete.includes("cloudinary.com")) {
                      try {
                        await uploadAPI.deleteImage(thumbToDelete);
                        showToast("Thumbnail deleted from Cloudinary");
                      } catch {
                        // ignore error
                      }
                    }
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                  title="Delete Thumbnail"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors hover:border-[#B3FFC9]/40">
                <ImageIcon size={16} className="text-[#B3FFC9]" />
                <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Cover Thumbnail"}</span>
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
                        setCsForm((prev) => ({ ...prev, thumbnail: url }));
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

          {/* Multiple Images Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60">
                Project Images &amp; Proofs (Upload to Cloudinary)
              </label>
              {isUploadingImage ? (
                <span className="text-[11px] text-[#B3FFC9] font-mono animate-pulse">
                  Uploading to Cloudinary...
                </span>
              ) : (
                csForm.images &&
                csForm.images.length > 0 && (
                  <span className="text-[11px] text-[#B3FFC9] font-mono">
                    {csForm.images.length} {csForm.images.length === 1 ? "image" : "images"} uploaded
                  </span>
                )
              )}
            </div>

            {csForm.images && csForm.images.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {csForm.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="relative rounded-xl overflow-hidden aspect-video border border-white/15 bg-[#161616] group">
                      <img src={img} alt={`Asset ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-[#B3FFC9] font-mono font-bold">
                        #{imgIdx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const imgToDelete = img;
                          const updated = csForm.images.filter((_, i) => i !== imgIdx);
                          setCsForm({ ...csForm, images: updated });
                          if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                            try {
                              await uploadAPI.deleteImage(imgToDelete);
                              showToast("Image deleted from Cloudinary");
                            } catch {
                              // ignore error
                            }
                          }
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                        title="Delete Image from Cloudinary"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#B3FFC9] cursor-pointer transition-colors">
                  <Plus size={14} />
                  <span>{isUploadingImage ? "Uploading..." : "Add More Images"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploadingImage}
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setIsUploadingImage(true);
                        try {
                          const uploadedUrls = await uploadAPI.uploadMultiple(files);
                          setCsForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
                          showToast(`${files.length} images uploaded to Cloudinary`);
                        } catch {
                          showToast("Error uploading images to Cloudinary");
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 rounded-2xl p-6 bg-[#141414]/50 hover:bg-[#141414] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#B3FFC9]/10 text-white/60 group-hover:text-[#B3FFC9] flex items-center justify-center mb-3 transition-colors">
                  <Plus size={22} />
                </div>
                <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {isUploadingImage ? "Uploading to Cloudinary..." : "Click to Upload Images to Cloudinary"}
                </p>
                <p className="text-[11px] text-white/40 mt-1 font-mono">
                  PNG, JPG, WEBP assets uploaded straight to Cloudinary media cloud
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={isUploadingImage}
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setIsUploadingImage(true);
                      try {
                        const uploadedUrls = await uploadAPI.uploadMultiple(files);
                        setCsForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
                        showToast(`${files.length} images uploaded to Cloudinary`);
                      } catch {
                        showToast("Error uploading images to Cloudinary");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* Before & After Growth Proofs */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Before &amp; After Growth Proofs</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] font-mono font-normal">
                    {(csForm.beforeAfter?.length || 1)} {csForm.beforeAfter?.length === 1 ? "Comparison" : "Comparisons"}
                  </span>
                </label>
                <p className="text-[11px] text-white/40 font-mono mt-0.5">
                  Add one or more before vs after screenshot comparisons showing client growth
                </p>
              </div>

              <button
                type="button"
                onClick={addCsBeforeAfterPair}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B3FFC9]/10 hover:bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30 text-xs font-bold font-mono transition-all cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <span>+ Add Another Pair</span>
              </button>
            </div>

            <div className="space-y-4">
              {(csForm.beforeAfter && csForm.beforeAfter.length > 0
                ? csForm.beforeAfter
                : [{ beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }]
              ).map((pair, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-[#0f0f10] border border-white/10 space-y-3.5 relative transition-all hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/70">
                        #{pIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={pair.title || ""}
                        onChange={(e) => updateCsBeforeAfterPair(pIdx, "title", e.target.value)}
                        placeholder={`Comparison #${pIdx + 1} Title (e.g. Reach Spike, Watch Hours, Followers)`}
                        className="px-2.5 py-1 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#B3FFC9] focus:outline-none flex-1 max-w-md"
                      />
                    </div>

                    {csForm.beforeAfter?.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCsBeforeAfterPair(pIdx)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        title="Delete this comparison pair"
                      >
                        <Trash2 size={13} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Before Card */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-[#141414] border border-red-500/20">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-red-400 font-mono flex items-center gap-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          BEFORE
                        </span>
                        <input
                          type="text"
                          value={pair.beforeLabel || ""}
                          onChange={(e) => updateCsBeforeAfterPair(pIdx, "beforeLabel", e.target.value)}
                          placeholder="e.g. Before: 0.34% CVR"
                          className="px-2.5 py-1 text-[11px] bg-black/40 border border-white/10 rounded-lg text-white/80 focus:border-red-400 focus:outline-none w-full"
                        />
                      </div>

                      {pair.beforeImage ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                          <img src={pair.beforeImage} alt="Before Proof" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={async () => {
                              const imgToDelete = pair.beforeImage;
                              updateCsBeforeAfterPair(pIdx, "beforeImage", "");
                              if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                                try {
                                  await uploadAPI.deleteImage(imgToDelete);
                                  showToast("Before proof deleted from Cloudinary");
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                            title="Remove Before Proof"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center border border-dashed border-red-500/30 hover:border-red-400 rounded-xl p-5 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all cursor-pointer">
                          <Plus size={18} className="text-red-400 mb-1" />
                          <span className="text-[11px] font-bold text-white/80">Upload "Before" Proof</span>
                          <span className="text-[10px] text-white/40 font-mono mt-0.5">e.g. baseline reach/views</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  showToast("Uploading Before proof to Cloudinary...");
                                  const url = await uploadAPI.uploadSingle(file);
                                  updateCsBeforeAfterPair(pIdx, "beforeImage", url);
                                  showToast("Before proof uploaded");
                                } catch {
                                  showToast("Error uploading before proof");
                                }
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* After Card */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-[#141414] border border-[#B3FFC9]/30">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#B3FFC9] font-mono flex items-center gap-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-[#B3FFC9] shadow-[0_0_8px_#B3FFC9]" />
                          AFTER
                        </span>
                        <input
                          type="text"
                          value={pair.afterLabel || ""}
                          onChange={(e) => updateCsBeforeAfterPair(pIdx, "afterLabel", e.target.value)}
                          placeholder="e.g. After: 11.76% CVR"
                          className="px-2.5 py-1 text-[11px] bg-black/40 border border-white/10 rounded-lg text-white/80 focus:border-[#B3FFC9] focus:outline-none w-full"
                        />
                      </div>

                      {pair.afterImage ? (
                        <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                          <img src={pair.afterImage} alt="After Proof" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={async () => {
                              const imgToDelete = pair.afterImage;
                              updateCsBeforeAfterPair(pIdx, "afterImage", "");
                              if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                                try {
                                  await uploadAPI.deleteImage(imgToDelete);
                                  showToast("After proof deleted from Cloudinary");
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                            title="Remove After Proof"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center border border-dashed border-[#B3FFC9]/30 hover:border-[#B3FFC9] rounded-xl p-5 bg-[#B3FFC9]/[0.02] hover:bg-[#B3FFC9]/[0.05] transition-all cursor-pointer">
                          <Plus size={18} className="text-[#B3FFC9] mb-1" />
                          <span className="text-[11px] font-bold text-white/80">Upload "After" Proof</span>
                          <span className="text-[10px] text-white/40 font-mono mt-0.5">e.g. scaled spike/stats</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  showToast("Uploading After proof to Cloudinary...");
                                  const url = await uploadAPI.uploadSingle(file);
                                  updateCsBeforeAfterPair(pIdx, "afterImage", url);
                                  showToast("After proof uploaded");
                                } catch {
                                  showToast("Error uploading after proof");
                                }
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCsBeforeAfterPair}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#B3FFC9]/30 hover:border-[#B3FFC9] bg-[#B3FFC9]/[0.02] hover:bg-[#B3FFC9]/[0.06] text-[#B3FFC9] text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>+ Add Another Before &amp; After Comparison Pair</span>
            </button>
          </div>

          {/* 3 Stats Row */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-white/60">Impact Metrics</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 1</span>
                <input
                  type="text"
                  value={csForm.stat1Num}
                  onChange={(e) => setCsForm({ ...csForm, stat1Num: e.target.value })}
                  placeholder="706.1K"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                />
                <input
                  type="text"
                  value={csForm.stat1Label}
                  onChange={(e) => setCsForm({ ...csForm, stat1Label: e.target.value })}
                  placeholder="IG Views / 30d"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                />
              </div>

              <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 2</span>
                <input
                  type="text"
                  value={csForm.stat2Num}
                  onChange={(e) => setCsForm({ ...csForm, stat2Num: e.target.value })}
                  placeholder="36.4K"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                />
                <input
                  type="text"
                  value={csForm.stat2Label}
                  onChange={(e) => setCsForm({ ...csForm, stat2Label: e.target.value })}
                  placeholder="IG Interactions"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                />
              </div>

              <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 3</span>
                <input
                  type="text"
                  value={csForm.stat3Num}
                  onChange={(e) => setCsForm({ ...csForm, stat3Num: e.target.value })}
                  placeholder="534K"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                />
                <input
                  type="text"
                  value={csForm.stat3Label}
                  onChange={(e) => setCsForm({ ...csForm, stat3Label: e.target.value })}
                  placeholder="IG Accounts reached"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Challenge & Approach */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">The Challenge</label>
              <textarea
                value={csForm.challenge}
                onChange={(e) => setCsForm({ ...csForm, challenge: e.target.value })}
                rows={3}
                placeholder="What was the client's problem? e.g. Inconsistent posting rhythm..."
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Our Approach</label>
              <textarea
                value={csForm.approach}
                onChange={(e) => setCsForm({ ...csForm, approach: e.target.value })}
                rows={3}
                placeholder="What did Littroi execute? e.g. Daily repurposing system..."
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
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
              {isSubmitting ? "Saving..." : (editingItem ? "Update Case Study" : "Publish Case Study")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
