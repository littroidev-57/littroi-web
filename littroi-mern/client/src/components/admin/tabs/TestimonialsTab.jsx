import React, { useState, useMemo } from "react";
import { Video, Play, Edit3, Trash2, Plus } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";

export function TestimonialsTab({
  testimonialsList = [],
  searchQuery = "",
  onOpenModal,
  onPreviewVideo,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredTestimonials = useMemo(() => {
    return testimonialsList.filter((t) => {
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (t.name || t.clientName || "").toLowerCase().includes(q) ||
        (t.company || t.clientCompany || "").toLowerCase().includes(q) ||
        (t.quote || t.testimonial || "").toLowerCase().includes(q) ||
        (t.role || t.clientRole || "").toLowerCase().includes(q);
      return matchSearch;
    });
  }, [testimonialsList, searchQuery]);

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedTestimonials = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredTestimonials.slice(start, start + itemsPerPage);
  }, [filteredTestimonials, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 text-xs font-bold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
            <Video size={14} />
            <span>Video Testimonials ({filteredTestimonials.length})</span>
          </span>
        </div>

        <div className="text-xs text-white/50 font-mono">
          Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredTestimonials.length} video stories)
        </div>
      </div>

      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-[#0d0d0d] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-[#B3FFC9]">
            <Video size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Video Testimonials Found</h3>
            <p className="text-xs text-white/40 mt-1">Post a client YouTube video review with key results and quote.</p>
          </div>
          <button
            onClick={() => onOpenModal()}
            className="px-4 py-2 rounded-full bg-[#B3FFC9] text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Add Video Testimonial
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTestimonials.map((t, tIdx) => {
              const tId = t._id || t.id || tIdx;
              const author = t.name || t.clientName || "Client";
              const role = t.role || t.clientRole || "";
              const company = t.company || t.clientCompany || "";
              const quote = t.quote || t.testimonial || "";
              const avatar = t.avatar || t.clientImage;
              const vidId =
                t.videoId ||
                (t.videoUrl
                  ? t.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)?.[1]
                  : "");

              return (
                <div
                  key={tId}
                  className="rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#B3FFC9]/30 p-5 space-y-4 flex flex-col justify-between transition-all group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.03)]"
                >
                  <div className="space-y-3">
                    {/* Format Badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Video size={11} />
                        <span>Video Testimonial</span>
                      </span>

                      {t.metric && (
                        <span className="text-[10px] font-mono text-[#B3FFC9] bg-white/5 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                          {t.metric}
                        </span>
                      )}
                    </div>

                    {/* Video Preview / Embed Thumbnail */}
                    {vidId ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 bg-black group/vid">
                        <img
                          src={`https://img.youtube.com/vi/${vidId}/hqdefault.jpg`}
                          alt={author}
                          className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500"
                        />
                        <button
                          type="button"
                          onClick={() => onPreviewVideo(`https://www.youtube.com/watch?v=${vidId}`)}
                          className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#B3FFC9] text-black flex items-center justify-center shadow-lg transform group-hover/vid:scale-110 transition-transform">
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                          </div>
                        </button>
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] text-[#B3FFC9] font-mono font-bold">
                          {t.videoFirst !== false ? "Video: Left" : "Video: Right"}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-yellow-400">⚠️ Missing YouTube URL</span>
                      </div>
                    )}

                    {/* Author Row */}
                    <div className="flex items-center gap-3 pt-1">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={author}
                          className="w-11 h-11 rounded-full object-cover border border-white/15 bg-white/5 p-0.5 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#B3FFC9]/20 text-[#B3FFC9] flex items-center justify-center font-bold text-sm shrink-0 border border-[#B3FFC9]/30">
                          {author.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#B3FFC9] transition-colors truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {author}
                        </h4>
                        <p className="text-xs text-white/50 truncate font-mono">{role}</p>
                        {company && <p className="text-[10px] text-[#B3FFC9]/80 truncate">{company}</p>}
                      </div>
                    </div>

                    {/* Quote Text */}
                    <div className="relative pl-3 border-l-2 border-[#B3FFC9]/40 py-1">
                      <p className="text-xs text-white/70 line-clamp-3 leading-relaxed italic">
                        "{quote}"
                      </p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${t.isActive !== false ? "bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30" : "bg-white/5 text-white/40"
                      }`}>
                      {t.isActive !== false ? "Live on Home" : "Hidden"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenModal(t)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button
                        onClick={() => onDelete({ type: "testimonial", id: tId, title: `${author}'s Testimonial` })}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <AdminPagination
            totalItems={filteredTestimonials.length}
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
