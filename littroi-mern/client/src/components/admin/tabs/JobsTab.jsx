import React, { useState, useMemo } from "react";
import { Briefcase, Edit3, Trash2 } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";

export function JobsTab({
  jobsList = [],
  searchQuery = "",
  onOpenModal,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (job.title || "").toLowerCase().includes(q) ||
        (job.department || "").toLowerCase().includes(q) ||
        (job.location || "").toLowerCase().includes(q) ||
        (job.type || "").toLowerCase().includes(q);
      return matchSearch;
    });
  }, [jobsList, searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-white/50 font-mono">
          Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredJobs.length} career postings total)
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <Briefcase size={26} />
          </div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Job Openings Found</p>
          <p className="text-xs text-white/40">Try adjusting your search or post a new career opening.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => (
              <div
                key={job.id || job._id}
                className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] text-[10px] font-bold">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-white/40 font-mono">{job.type}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {job.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-white/60">
                    <p>📍 {job.location}</p>
                    <p>💼 {job.experience || "2+ Years"}</p>
                    <p>💰 {job.salary ? (job.salary.includes("₹") || job.salary.includes("Rs") ? job.salary : (job.salary.includes("$") ? job.salary.replace(/\$/g, "₹") : (job.salary.toLowerCase() === "competitive" ? "₹ Competitive" : `₹${job.salary}`))) : "₹ Competitive"}</p>
                  </div>

                  <p className="text-xs text-white/50 line-clamp-2 pt-2 border-t border-white/5">
                    {job.description || "Exciting role at Littroi Media studio."}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onOpenModal(job)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete({ type: "job", id: job.id || job._id, title: job.title || "Job Position" })}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <AdminPagination
            totalItems={filteredJobs.length}
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
