import React, { useState, useMemo } from "react";
import { UserCheck, Eye, Send, Trash2, ExternalLink } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";

export function JobApplicationsTab({
  jobApplicationsList = [],
  searchQuery = "",
  onViewApplication,
  onUpdateStatus,
  onDelete
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredApplications = useMemo(() => {
    return jobApplicationsList.filter((app) => {
      const matchStatus =
        statusFilter === "all"
          ? true
          : (app.status || "new").toLowerCase() === statusFilter.toLowerCase();
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (app.name || "").toLowerCase().includes(q) ||
        (app.jobTitle || "").toLowerCase().includes(q) ||
        (app.email || "").toLowerCase().includes(q) ||
        (app.experience || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [jobApplicationsList, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedApplications = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredApplications.slice(start, start + itemsPerPage);
  }, [filteredApplications, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Controls & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e0e] border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "new", "reviewed", "shortlisted", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.25)]"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-white/50">
          <span>
            Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredApplications.length} candidates)
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <UserCheck size={26} />
          </div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Job Applications Found</p>
          <p className="text-xs text-white/40">When candidates apply from the /careers page, their applications will appear here in real time.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedApplications.map((app) => {
              const appId = app.id || app._id;
              const initial = app.name?.charAt(0)?.toUpperCase() || "A";
              return (
                <div
                  key={appId}
                  className="p-6 rounded-3xl bg-[#0d0d0d] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-lg group"
                >
                  {/* Top Row: Candidate Overview & Quick Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-2xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(179,255,201,0.15)]"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {initial}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {app.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30 text-[10px] font-bold">
                            {app.jobTitle}
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              app.status === "New" || !app.status
                                ? "bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30"
                                : app.status === "Reviewed"
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : app.status === "Shortlisted"
                                ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {app.status || "New"}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-white/40 mt-0.5">
                          Applied on: {app.fullDate || app.date} · Exp: <strong className="text-white/70">{app.experience || "Not specified"}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Status Selector & Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={app.status || "New"}
                        onChange={(e) => onUpdateStatus(appId, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
                      >
                        <option value="New">Status: New</option>
                        <option value="Reviewed">Status: Reviewed</option>
                        <option value="Shortlisted">Status: Shortlisted</option>
                        <option value="Rejected">Status: Rejected</option>
                      </select>

                      <button
                        onClick={() => onViewApplication(app)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye size={13} className="text-[#B3FFC9]" />
                        <span>Details</span>
                      </button>

                      <a
                        href={`mailto:${app.email}?subject=Regarding%20your%20application%20for%20${encodeURIComponent(app.jobTitle)}%20at%20Littroi`}
                        className="px-3 py-1.5 rounded-xl bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        <Send size={12} />
                        <span>Reply</span>
                      </a>

                      <button
                        onClick={() => onDelete({ type: "jobApplication", id: appId, title: `Application from ${app.name}` })}
                        className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Contact & Links Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="text-white/60 font-mono">✉️ {app.email}</span>
                    {app.phone && <span className="text-white/60 font-mono">📞 {app.phone}</span>}

                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-[#B3FFC9]/10 text-[#B3FFC9] border border-[#B3FFC9]/30 transition-colors"
                      >
                        <span>Showreel / Portfolio</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/15 transition-colors"
                      >
                        <span>Resume / CV</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>

                  {/* Cover Letter Snippet */}
                  {app.coverLetter && (
                    <p className="text-xs text-white/60 line-clamp-2 italic pt-2 border-t border-white/5">
                      "{app.coverLetter}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <AdminPagination
            totalItems={filteredApplications.length}
            itemsPerPage={itemsPerPage}
            currentPage={safePage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
