import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { jobsAPI } from "../../../services/api";

export function JobModal({ isOpen, editingItem, onClose, onSaveSuccess, showToast }) {
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Post-Production",
    type: "Full-time",
    location: "Bareilly (Studio / Remote)",
    salary: "Competitive",
    experience: "2+ Years",
    description: "",
    responsibilities: "",
    requirements: ""
  });
  const [rawJobPaste, setRawJobPaste] = useState("");
  const [showRawJobPaste, setShowRawJobPaste] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setJobForm({
        title: editingItem.title || "",
        department: editingItem.department || "Post-Production",
        type: editingItem.type || editingItem.employmentType || "Full-time",
        location: editingItem.location || "Bareilly (Studio / Remote)",
        salary: editingItem.salary || "Competitive",
        experience: editingItem.experience || "2+ Years",
        description: editingItem.description || editingItem.overview || "",
        responsibilities: Array.isArray(editingItem.responsibilities)
          ? editingItem.responsibilities.join("\n")
          : editingItem.responsibilities || "",
        requirements: Array.isArray(editingItem.requirements)
          ? editingItem.requirements.join("\n")
          : editingItem.requirements || ""
      });
    } else {
      setJobForm({
        title: "",
        department: "Post-Production",
        type: "Full-time",
        location: "Bareilly (Studio / Remote)",
        salary: "Competitive",
        experience: "2+ Years",
        description: "",
        responsibilities: "",
        requirements: ""
      });
    }
    setRawJobPaste("");
    setShowRawJobPaste(false);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleAutoParseJob = () => {
    if (!rawJobPaste || !rawJobPaste.trim()) {
      showToast("Please paste the job text first");
      return;
    }
    const text = rawJobPaste.trim();

    // 1. Title Extraction
    let extractedTitle = "";
    const titleMatch =
      text.match(/^(?:#{1,3}\s*(?:\d+\.?)?\s*|\*\*(?:\d+\.?)?\s*|Position:\s*|Title:\s*)([^\n]+)/m) ||
      text.match(/^(?:\d+\.\s*)([^\n]+)/m);
    if (titleMatch) {
      extractedTitle = titleMatch[1].replace(/[*_#]/g, "").trim();
    }

    // 2. Department Mapping
    let extractedDept = "Post-Production";
    const lookup = (extractedTitle || text).toLowerCase();
    if (lookup.includes("designer") || lookup.includes("design") || lookup.includes("thumbnail")) {
      extractedDept = "Creative & Design";
    } else if (lookup.includes("social media") || lookup.includes("community")) {
      extractedDept = "Content & Distribution";
    } else if (lookup.includes("content head") || lookup.includes("creative director") || lookup.includes("strategy")) {
      extractedDept = "Leadership & Strategy";
    } else if (lookup.includes("web") || lookup.includes("developer") || lookup.includes("engineer")) {
      extractedDept = "Engineering & Web";
    } else if (lookup.includes("performance") || lookup.includes("ads") || lookup.includes("marketer")) {
      extractedDept = "Growth & Media Buying";
    } else if (lookup.includes("sales") || lookup.includes("business development") || lookup.includes("partnership")) {
      extractedDept = "Sales & Partnerships";
    } else if (lookup.includes("youtube") || lookup.includes("growth")) {
      extractedDept = "Channel Growth & Strategy";
    }

    // 3. Experience Extraction
    let extractedExp = "2+ Years";
    const expMatch =
      text.match(/(?:at least|minimum|min\.?)\s*(\d+[\+\-]?\s*(?:years?|yrs?))/i) ||
      text.match(/(\d+[\+\-]?\s*(?:years?|yrs?))\s*(?:of\s+experience|experience)/i);
    if (expMatch) {
      extractedExp = expMatch[1].trim();
      if (!/years?/i.test(extractedExp)) {
        extractedExp += " Years";
      }
    }

    // 4. Key Responsibilities Extraction
    let extractedResponsibilities = "";
    const respMatch = text.match(/(?:\*{0,2}Key Responsibilities\*{0,2}|\*{0,2}Responsibilities\*{0,2})[\s\S]*?(?=(?:\*{0,2}Requirements\*{0,2}|\*{0,2}Skills\*{0,2}|--|$))/i);
    if (respMatch) {
      const lines = respMatch[0]
        .split("\n")
        .slice(1)
        .map((l) => l.replace(/^[\s•\-\*\d\.\)\:]+/, "").trim())
        .filter(Boolean);
      extractedResponsibilities = lines.join("\n");
    }

    // 5. Requirements Extraction
    let extractedRequirements = "";
    const reqMatch = text.match(/(?:\*{0,2}Requirements\*{0,2}|\*{0,2}Requirements & Skills\*{0,2})[\s\S]*?(?=(?:\*{0,2}Key Responsibilities\*{0,2}|--|$))/i);
    if (reqMatch) {
      const lines = reqMatch[0]
        .split("\n")
        .slice(1)
        .map((l) => l.replace(/^[\s•\-\*\d\.\)\:]+/, "").trim())
        .filter(Boolean);
      extractedRequirements = lines.join("\n");
    }

    // 6. Overview / Description
    let extractedDesc = "";
    const introPart = text.split(/(?:\*{0,2}Key Responsibilities|\*{0,2}Requirements)/i)[0];
    if (introPart) {
      const candidateLines = introPart
        .split("\n")
        .filter((l) => !l.trim().startsWith("#") && !l.trim().startsWith("---") && l.trim().length > 20);
      if (candidateLines.length > 0) {
        extractedDesc = candidateLines.join("\n").trim();
      }
    }
    if (!extractedDesc && extractedTitle) {
      extractedDesc = `We're seeking a skilled and driven ${extractedTitle} to join our high-growth content production team at Littroi Media.`;
    }

    setJobForm((prev) => ({
      ...prev,
      title: extractedTitle || prev.title,
      department: extractedDept || prev.department,
      experience: extractedExp || prev.experience,
      description: extractedDesc || prev.description,
      responsibilities: extractedResponsibilities || prev.responsibilities,
      requirements: extractedRequirements || prev.requirements
    }));

    showToast("Job details auto-extracted successfully! ✓");
    setShowRawJobPaste(false);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();

    const cleanList = (val) => {
      if (Array.isArray(val)) {
        return val
          .flatMap((item) => (typeof item === "string" ? item.split("\n") : []))
          .map((r) => String(r).replace(/^[\s•\-\*\d\.\)\:]+/, "").trim())
          .filter(Boolean);
      }
      if (typeof val === "string") {
        return val
          .split("\n")
          .map((r) => r.replace(/^[\s•\-\*\d\.\)\:]+/, "").trim())
          .filter(Boolean);
      }
      return [];
    };

    const requirementsArr = cleanList(jobForm.requirements);
    const responsibilitiesArr = cleanList(jobForm.responsibilities);

    const desc =
      (jobForm.description || "").trim() ||
      `Exciting career role for ${jobForm.title || "candidate"} at Littroi Media.`;

    const payload = {
      ...jobForm,
      overview: desc,
      description: desc,
      employmentType: jobForm.type || "Full-time",
      type: jobForm.type || "Full-time",
      slug: (jobForm.title || "career-role").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      responsibilities: responsibilitiesArr,
      requirements: requirementsArr
    };

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await jobsAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Career opening updated ✓");
      } else {
        await jobsAPI.create(payload);
        showToast("New job vacancy posted ✓");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Job save error:", err);
      showToast(`❌ Error: ${err.message || "Could not save job. Make sure you are logged in."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="max-w-xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {editingItem ? "Edit Opening" : "Create Career Opening"}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveJob} className="space-y-4">
          {/* Smart Auto-Extract Accordion */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowRawJobPaste(!showRawJobPaste)}
                className="text-xs font-bold text-[#B3FFC9] hover:underline flex items-center gap-1.5 cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <Sparkles size={14} />
                {showRawJobPaste ? "Hide Document Auto-Fill" : "Paste from Job Descriptions (Auto-Fill)"}
              </button>
              <span className="text-[10px] text-white/40">Markdown / text parser</span>
            </div>

            {showRawJobPaste && (
              <div className="space-y-2.5 pt-1">
                <textarea
                  value={rawJobPaste}
                  onChange={(e) => setRawJobPaste(e.target.value)}
                  rows={5}
                  placeholder={`Paste whole role section from your Job_Descriptions.md file, e.g.:\n\n## 1. Video Editor\n**Key Responsibilities**\n- Edit podcasts, trailers, and short-form content...\n\n**Requirements**\n- Minimum 3 years of professional video editing experience...`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/15 text-white text-xs font-mono focus:border-[#B3FFC9] focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/50">
                    Auto-extracts title, department, responsibilities &amp; requirements.
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoParseJob}
                    className="px-4 py-2 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer shadow-[0_0_15px_rgba(179,255,201,0.3)]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Auto-Fill Fields
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Position Title *</label>
            <input
              type="text"
              value={jobForm.title}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              placeholder="e.g. Video Editor"
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Department</label>
              <input
                type="text"
                value={jobForm.department}
                onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                placeholder="Post-Production"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Employment Type</label>
              <select
                value={jobForm.type}
                onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract / Project">Contract / Project</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Location</label>
              <input
                type="text"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                placeholder="Bareilly / Remote"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Experience</label>
              <input
                type="text"
                value={jobForm.experience}
                onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                placeholder="2+ Years"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/60">Salary Range</label>
              <input
                type="text"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="e.g. Competitive or ₹8,00,000 - ₹14,00,000 / yr"
                className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-white/60">Job Overview / Description</label>
            <textarea
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              rows={4}
              placeholder="Brief summary of the role and vision..."
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs leading-relaxed focus:border-[#B3FFC9] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60">Key Responsibilities (One per line)</label>
              <span className="text-[10px] text-white/40">Bullet points cleaned automatically</span>
            </div>
            <textarea
              value={jobForm.responsibilities}
              onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
              rows={6}
              placeholder={`- Edit podcasts, trailers, and short-form content with strong pacing\n- Edit long-form videos with attention to narrative flow\n- Sync audio/video, color correct, and sound design`}
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs leading-relaxed focus:border-[#B3FFC9] focus:outline-none font-sans"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60">Requirements &amp; Skills (One per line)</label>
              <span className="text-[10px] text-white/40">Bullet points cleaned automatically</span>
            </div>
            <textarea
              value={jobForm.requirements}
              onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
              rows={6}
              placeholder={`- Minimum 3 years of professional video editing experience\n- Proficiency in Adobe Premiere Pro, After Effects, or DaVinci Resolve\n- Strong understanding of pacing, storytelling, and YouTube formats`}
              className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs leading-relaxed focus:border-[#B3FFC9] focus:outline-none font-sans"
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
              {isSubmitting ? "Saving..." : (editingItem ? "Update Role" : "Post Opening")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
