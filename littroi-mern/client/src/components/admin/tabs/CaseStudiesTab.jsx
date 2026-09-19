import React, { useState, useMemo } from "react";
import { FileText, Edit3, Trash2 } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";

export function CaseStudiesTab({
  caseStudiesList = [],
  searchQuery = "",
  onOpenModal,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredCaseStudies = useMemo(() => {
    return caseStudiesList.filter((cs) => {
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (cs.title || cs.name || "").toLowerCase().includes(q) ||
        (cs.handle || cs.client || "").toLowerCase().includes(q) ||
        (cs.category || "").toLowerCase().includes(q) ||
        (Array.isArray(cs.tags) ? cs.tags.join(" ") : (cs.tags || "")).toLowerCase().includes(q);
      return matchSearch;
    });
  }, [caseStudiesList, searchQuery]);

  const totalPages = Math.ceil(filteredCaseStudies.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCaseStudies = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredCaseStudies.slice(start, start + itemsPerPage);
  }, [filteredCaseStudies, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-white/50 font-mono">
          Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredCaseStudies.length} case studies total)
        </div>
      </div>

      {filteredCaseStudies.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <FileText size={26} />
          </div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Case Studies Found</p>
          <p className="text-xs text-white/40">Try adjusting your search query or add a new case study.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCaseStudies.map((cs) => {
              const thumbImg = cs.thumbnail || cs.coverImage || (Array.isArray(cs.images) && cs.images[0]);
              const stats = cs.stats || [];

              return (
                <div
                  key={cs.id || cs._id}
                  className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
                >
                  <div className="space-y-3">
                    {/* Card Preview Banner with Cover Thumbnail */}
                    <div className="h-36 rounded-xl overflow-hidden bg-[#141414] relative border border-white/5 group-hover:border-[#B3FFC9]/30 transition-all">
                      {thumbImg ? (
                        <img
                          src={thumbImg}
                          alt={cs.title || cs.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1b1b] to-[#0d0d0d] text-white/30 text-xs font-mono">
                          No Thumbnail
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                      <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] truncate px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[10px] font-semibold border border-[#B3FFC9]/20">
                        {cs.category || "Case Study"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {cs.title || cs.name}
                      </h4>
                      <p className="text-xs text-white/50 font-mono truncate">
                        {cs.handle || cs.client}
                      </p>
                    </div>

                    {/* Stats Preview */}
                    {stats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5">
                        {stats.slice(0, 2).map((st, sIdx) => (
                          <div key={sIdx}>
                            <div className="text-xs font-bold text-[#B3FFC9] font-mono">{st.num}</div>
                            <div className="text-[10px] text-white/40 truncate">{st.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-white/60 line-clamp-2">
                      {cs.challenge ? `Challenge: ${cs.challenge}` : (cs.description || cs.shortDescription)}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onOpenModal(cs)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete({ type: "caseStudy", id: cs.id || cs._id, title: cs.title || cs.name || "Case Study" })}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <AdminPagination
            totalItems={filteredCaseStudies.length}
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
