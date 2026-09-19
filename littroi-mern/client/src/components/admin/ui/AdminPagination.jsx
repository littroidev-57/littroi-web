import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPagination({
  totalItems = 0,
  itemsPerPage = 6,
  currentPage = 1,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [4, 6, 8, 12, 24, 48]
}) {
  if (totalItems === 0) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const curPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (curPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(totalItems, curPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (curPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (curPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", curPage - 1, curPage, curPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 mt-6 select-none">
      <div className="text-xs text-white/50 font-mono">
        Showing <strong className="text-white">{startIdx}</strong> to <strong className="text-white">{endIdx}</strong> of <strong className="text-[#B3FFC9]">{totalItems}</strong> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange && onPageChange(Math.max(1, curPage - 1))}
          disabled={curPage === 1}
          className="p-2 rounded-xl bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-[#B3FFC9]/40 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((p, idx) => (
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-xs font-mono text-white/30">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange && onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${curPage === p
                ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.3)] border border-[#B3FFC9]"
                : "bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                }`}
            >
              {p}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange && onPageChange(Math.min(totalPages, curPage + 1))}
          disabled={curPage === totalPages || totalPages === 0}
          className="p-2 rounded-xl bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-[#B3FFC9]/40 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Per Page Selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
          <span>Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2.5 py-1 rounded-lg bg-[#141414] border border-white/10 text-xs text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
