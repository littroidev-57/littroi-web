import React from "react";
import {
  X,
  Calendar,
  ExternalLink,
  FileText,
  MessageSquare,
  Trash2,
  Send
} from "lucide-react";

export function JobApplicationModal({
  isOpen,
  application,
  onClose,
  onUpdateStatus,
  onDelete
}) {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl text-left my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Glow Line */}
        <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-base shadow-[0_0_20px_rgba(179,255,201,0.2)] shrink-0"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {application.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                {application.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30 text-[10px] font-bold">
                  {application.jobTitle}
                </span>
                <span className="text-xs text-white/40 font-mono">
                  ID: {application.id || application._id}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status and Timestamp Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141414] border border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 font-mono">Status:</span>
            <select
              value={application.status || "New"}
              onChange={(e) => onUpdateStatus(application.id || application._id, e.target.value)}
              className="px-3 py-1 rounded-xl bg-[#1a1a1a] border border-white/15 text-xs font-bold text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
            >
              <option value="New">🟢 New</option>
              <option value="Reviewed">🟡 Reviewed</option>
              <option value="Shortlisted">🔵 Shortlisted</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>
          <div className="text-xs font-mono text-white/40 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#B3FFC9]" />
            <span>{application.fullDate || application.date}</span>
          </div>
        </div>

        {/* Detail Fields 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-white/40 block">Email Address</span>
            <a
              href={`mailto:${application.email}`}
              className="text-sm font-semibold text-white hover:text-[#B3FFC9] truncate block"
            >
              {application.email}
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-white/40 block">Phone Number</span>
            <div className="text-sm font-semibold text-white">
              {application.phone ? (
                <a href={`tel:${application.phone}`} className="hover:text-[#B3FFC9]">
                  {application.phone}
                </a>
              ) : (
                <span className="text-white/40">Not provided</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-white/40 block">Experience Level</span>
            <div className="text-sm font-semibold text-white">
              {application.experience || "1 - 2 Years"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-mono text-white/40 block">Position Applied</span>
            <div className="text-sm font-semibold text-[#B3FFC9]">
              {application.jobTitle}
            </div>
          </div>
        </div>

        {/* External Links Section: Showreel & Resume */}
        {(application.portfolioUrl || application.resumeUrl) && (
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-2.5">
            <span className="text-[10px] uppercase font-mono text-white/40 block">Candidate Links &amp; Showcase</span>
            <div className="flex flex-wrap items-center gap-3">
              {application.portfolioUrl && (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(179,255,201,0.15)]"
                >
                  <ExternalLink size={13} />
                  <span>Open Showreel / Portfolio</span>
                </a>
              )}

              {application.resumeUrl && (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#B3FFC9] border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={13} />
                  <span>View Resume / CV</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Cover Note Section */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <MessageSquare size={13} className="text-[#B3FFC9]" />
            Cover Note / Pitch
          </span>
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
            {application.coverLetter || "No additional message provided."}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete({
                type: "jobApplication",
                id: application.id || application._id,
                title: `Application from ${application.name}`
              });
            }}
            className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>Delete Application</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
            >
              Close
            </button>
            <a
              href={`mailto:${application.email}?subject=Regarding%20your%20application%20for%20${encodeURIComponent(application.jobTitle)}%20at%20Littroi`}
              className="px-6 py-2.5 rounded-full bg-[#B3FFC9] hover:bg-[#9effba] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(179,255,201,0.2)]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <Send size={13} />
              <span>Send Reply Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
