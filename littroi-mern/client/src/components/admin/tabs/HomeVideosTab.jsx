import React, { useState, useMemo } from "react";
import { Video, Play, Edit3, Trash2 } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";
import { projectsAPI } from "../../../services/api";

export function HomeVideosTab({
  projectsList = [],
  searchQuery = "",
  onOpenModal,
  onPreviewVideo,
  onDelete,
  onRefreshData,
  showToast
}) {
  const [videoCategoryFilter, setVideoCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const filteredProjects = useMemo(() => {
    let list = projectsList;
    if (videoCategoryFilter !== "all") {
      list = list.filter((p) => p.category === videoCategoryFilter);
      list = [...list].sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.categoryLabel || "").toLowerCase().includes(q) ||
          (p.videoUrl || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [projectsList, videoCategoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: `All (${projectsList.length})` },
            { key: "our-projects", label: `Our Projects (${projectsList.filter((p) => p.category === "our-projects").length})` },
            { key: "saas-video", label: `SaaS Video (${projectsList.filter((p) => p.category === "saas-video").length})` },
            { key: "podcast-clips", label: `Podcast Clips (${projectsList.filter((p) => p.category === "podcast-clips").length})` },
            { key: "short-form", label: `Short Form (${projectsList.filter((p) => p.category === "short-form").length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setVideoCategoryFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${videoCategoryFilter === tab.key
                ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.3)]"
                : "bg-white/5 text-white/60 hover:text-white"
                }`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#B3FFC9] text-[10px]">
            {videoCategoryFilter === "all" ? "Sorted: Latest Added First" : "Sorted: Category Sequence (1, 2, 3...)"}
          </span>
          <span>
            Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredProjects.length} videos)
          </span>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <Video size={26} />
          </div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Videos Found</p>
          <p className="text-xs text-white/40">Try adjusting your filters or upload a new home video showcase.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedProjects.map((p) => {
              const isReel = p.category === "podcast-clips" || p.category === "short-form";
              const yId =
                p.youtubeId ||
                (p.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*).*/)?.[1]) ||
                p.videoUrl;

              return (
                <div
                  key={p.id || p._id}
                  className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-3 group transition-all"
                >
                  <div className="space-y-2.5">
                    <div className={`rounded-xl overflow-hidden bg-[#161616] relative ${isReel ? "aspect-[9/14]" : "aspect-video"}`}>
                      <img
                        src={p.thumbnail || `https://img.youtube.com/vi/${yId}/hqdefault.jpg`}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[9px] font-semibold">
                        {p.categoryLabel || p.category}
                      </span>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[9px] font-mono border border-[#B3FFC9]/30 font-bold" title="Display sequence order in section">
                        Seq #{p.order ?? 1}
                      </span>
                      <button
                        onClick={() => onPreviewVideo(p.videoUrl || `https://www.youtube.com/watch?v=${yId}`)}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/70 text-[#B3FFC9] flex items-center justify-center hover:scale-110 hover:bg-[#B3FFC9] hover:text-black transition-all shadow-xl cursor-pointer"
                      >
                        <Play size={16} className="ml-0.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {p.title || "Video Showcase"}
                      </h4>
                      <p className="text-[11px] text-white/40 font-mono truncate">
                        ID: {yId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5" title="Set video sequence (1 = 1st, 2 = 2nd...)">
                      <span className="text-[10px] text-white/40 uppercase font-mono">Seq:</span>
                      <input
                        type="number"
                        min="1"
                        defaultValue={p.order ?? 1}
                        key={`seq-${p._id || p.id}-${p.order}`}
                        onBlur={async (e) => {
                          const newOrder = parseInt(e.target.value, 10);
                          if (!isNaN(newOrder) && newOrder !== p.order) {
                            try {
                              await projectsAPI.update(p._id || p.id, { ...p, order: newOrder });
                              showToast(`Sequence updated to #${newOrder}`);
                              if (onRefreshData) onRefreshData();
                            } catch {
                              showToast("Failed to update sequence");
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.target.blur();
                          }
                        }}
                        className="w-11 px-1.5 py-0.5 rounded bg-black/60 border border-white/15 text-[#B3FFC9] text-xs font-bold text-center focus:border-[#B3FFC9] focus:outline-none cursor-text"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenModal(p)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 size={11} /> Edit
                      </button>
                      <button
                        onClick={() => onDelete({ type: "homeVideo", id: p.id || p._id, title: p.title || "Home Video" })}
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
            totalItems={filteredProjects.length}
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
