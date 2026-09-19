import React from "react";
import {
  FileText,
  Quote,
  Briefcase,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Video
} from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardTab({
  caseStudiesCount = 0,
  testimonialsCount = 0,
  blogsCount = 0,
  jobsCount = 0,
  projectsCount = 0,
  jobApplicationsList = [],
  onNavigateTab,
  onOpenBlogModal,
  onOpenCsModal,
  onOpenJobModal,
  onOpenProjectModal,
  onSelectApplication
}) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 6 Real Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigateTab("caseStudies")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Case Studies
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <FileText size={14} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {caseStudiesCount}
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Full Case Studies</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("homeVideos")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Home Videos
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <Video size={14} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {projectsCount}
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Showcase Videos</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("testimonials")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Testimonials
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <Quote size={14} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {testimonialsCount}
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Client Video Stories</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("blog")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Published Blogs
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <FileText size={14} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {blogsCount}
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Published Articles</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("jobs")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Open Careers
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <Briefcase size={14} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {jobsCount}
          </p>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Active Studio Roles</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab("jobApplications")}
          className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
        >
          <div className="flex items-center justify-between text-white/50">
            <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
              Applications
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
              <UserCheck size={14} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
              {jobApplicationsList.length}
            </p>
            {jobApplicationsList.some((a) => a.status === "New" || !a.status) && (
              <span className="text-[10px] font-mono text-[#B3FFC9] px-2 py-0.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 font-bold">
                {jobApplicationsList.filter((a) => a.status === "New" || !a.status).length} New
              </span>
            )}
          </div>
          <div className="text-[10px] text-white/40 font-mono">
            <span>Candidate Inflow</span>
          </div>
        </div>
      </div>

      {/* Dashboard Main Grid: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Studio Actions (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#B3FFC9]" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Quick Studio Actions
              </h3>
            </div>
            <p className="text-xs text-white/40 font-mono mt-1">
              Fast shortcuts to manage and create studio content
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onOpenBlogModal}
              className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                  + Write Article
                </p>
                <p className="text-[10px] text-white/40 font-mono">Insights &amp; Strategy</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                <ArrowUpRight size={14} />
              </div>
            </button>

            <button
              onClick={onOpenCsModal}
              className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                  + Case Study
                </p>
                <p className="text-[10px] text-white/40 font-mono">Client Metrics &amp; Media</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                <ArrowUpRight size={14} />
              </div>
            </button>

            <button
              onClick={onOpenProjectModal}
              className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                  + Home Video
                </p>
                <p className="text-[10px] text-white/40 font-mono">Reels &amp; YouTube Showreel</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                <ArrowUpRight size={14} />
              </div>
            </button>

            <button
              onClick={onOpenJobModal}
              className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                  + Post New Job
                </p>
                <p className="text-[10px] text-white/40 font-mono">Open Studio Position</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                <ArrowUpRight size={14} />
              </div>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9] animate-ping" />
              <span className="text-xs text-white/60 font-mono">Database: <strong className="text-white">MongoDB Live &amp; Cloudinary Connected</strong></span>
            </div>
            <Link to="/" target="_blank" className="text-xs text-[#B3FFC9] font-bold flex items-center gap-1 hover:underline">
              Live Site <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Right: Latest Real Candidate Inflow (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-[#B3FFC9]" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Latest Candidate Applications
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("jobApplications")}
              className="text-xs font-mono text-[#B3FFC9] hover:underline cursor-pointer flex items-center gap-1"
            >
              View All ({jobApplicationsList.length}) <ChevronRight size={13} />
            </button>
          </div>

          {jobApplicationsList.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#141414] border border-white/5 space-y-2">
              <p className="text-sm font-bold text-white/80">No Candidate Applications Yet</p>
              <p className="text-xs text-white/40 font-mono">Applications submitted via the Careers page will appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {jobApplicationsList.slice(0, 5).map((app) => (
                <div
                  key={app._id || app.id}
                  onClick={() => onSelectApplication(app)}
                  className="p-3.5 rounded-xl bg-[#141414] border border-white/5 hover:border-white/20 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {app.name}
                    </p>
                    <p className="text-[11px] text-white/50 font-mono truncate">
                      {app.jobTitle || "Studio Role"} • {app.experience || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        app.status === "New" || !app.status
                          ? "bg-[#B3FFC9]/10 text-[#B3FFC9] border border-[#B3FFC9]/30"
                          : app.status === "Reviewed"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : app.status === "Shortlisted"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {app.status || "New"}
                    </span>
                    <ChevronRight size={13} className="text-white/40" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
