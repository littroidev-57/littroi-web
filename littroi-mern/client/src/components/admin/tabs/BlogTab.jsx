import React, { useState, useMemo } from "react";
import { FileText, Eye, Edit3, Trash2 } from "lucide-react";
import { AdminPagination } from "../ui/AdminPagination";

export function BlogTab({
  blogsList = [],
  searchQuery = "",
  onOpenModal,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((post) => {
      const q = (searchQuery || "").toLowerCase();
      const matchSearch =
        (post.title || "").toLowerCase().includes(q) ||
        (post.category || "").toLowerCase().includes(q) ||
        (post.excerpt || "").toLowerCase().includes(q) ||
        (typeof post.author === "string" ? post.author : post.author?.name || "").toLowerCase().includes(q);
      return matchSearch;
    });
  }, [blogsList, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedBlogs = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, safePage, itemsPerPage]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-white/50 font-mono">
          Showing page <strong className="text-white">{safePage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredBlogs.length} articles total)
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <FileText size={26} />
          </div>
          <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Articles Found</p>
          <p className="text-xs text-white/40">Try adjusting your search or write a new insights post.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBlogs.map((post) => (
              <div
                key={post.id || post._id}
                className="p-4 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#161616] relative">
                    <img
                      src={post.featuredImage || post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#B3FFC9] text-[10px] font-semibold">
                      {post.category || "Article"}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[10px] font-mono flex items-center gap-1">
                      <Eye size={10} /> {(Number(post.views) || 0).toLocaleString()} views
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {post.title}
                  </h4>

                  <p className="text-xs text-white/50 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 text-white/40 font-mono">
                    <span>{typeof post.author === "object" ? post.author?.name : (post.author || "Editorial")}</span>
                    <span>{post.readTime || "4 min"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onOpenModal(post)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete({ type: "blog", id: post.id || post._id, title: post.title || "Blog Article" })}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <AdminPagination
            totalItems={filteredBlogs.length}
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
