import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, Plus, ChevronDown } from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { blogAPI, authAPI } from "../services/api";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";

const MARQUEE_WORDS = [
  "GROW FAST",
  "REMOTE-FIRST",
  "CREATIVE FREEDOM",
  "REAL OWNERSHIP",
  "NO MICROMANAGEMENT",
  "MOVE FAST",
  "BOLD IDEAS WELCOME",
  "BAREILLY TO THE WORLD"
];

function getCategoryColor(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("seo")) return { bg: "rgba(34, 211, 238, 0.1)", text: "#22D3EE", border: "rgba(34, 211, 238, 0.25)" };
  if (c.includes("cro") || c.includes("retention")) return { bg: "rgba(244, 114, 182, 0.1)", text: "#F472B6", border: "rgba(244, 114, 182, 0.25)" };
  if (c.includes("performance") || c.includes("growth")) return { bg: "rgba(179, 255, 201, 0.1)", text: "#B3FFC9", border: "rgba(179, 255, 201, 0.3)" };
  if (c.includes("marketing") || c.includes("brand")) return { bg: "rgba(251, 191, 36, 0.1)", text: "#FBBF24", border: "rgba(251, 191, 36, 0.25)" };
  return { bg: "rgba(167, 139, 250, 0.1)", text: "#A78BFA", border: "rgba(167, 139, 250, 0.25)" };
}

function getAuthorInitial(author) {
  const name = typeof author === "object" ? author?.name : author;
  if (!name) return "V";
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase();
}

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc' | 'date-asc' | 'title-asc'
  const [posts, setPosts] = useState(fallbackBlogs);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await authAPI.getMe();
      if (user) setIsAdmin(true);
    };
    checkAdmin();

    const loadPosts = async () => {
      const data = await blogAPI.getAll();
      if (data && data.length) {
        setPosts(data);
      }
    };
    loadPosts();
  }, []);

  const categories = [
    { key: "all", label: "ALL" },
    { key: "Performance Marketing", label: "PERFORMANCE MARKETING" },
    { key: "CRO", label: "CRO" },
    { key: "Marketing", label: "MARKETING" },
    { key: "SEO", label: "SEO" }
  ];

  // Filter & Sort Posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((p) => {
      const matchCat =
        selectedCategory === "all" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Performance Marketing" && p.category?.toLowerCase().includes("performance")) ||
        (selectedCategory === "CRO" && p.category?.toLowerCase().includes("cro")) ||
        (selectedCategory === "Marketing" && p.category?.toLowerCase().includes("market")) ||
        (selectedCategory === "SEO" && p.category?.toLowerCase().includes("seo"));

      const matchSearch =
        !searchQuery.trim() ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });

    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0));
    } else if (sortBy === "title-asc") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const featuredPost = filteredAndSortedPosts[0] || null;
  const standardPosts = filteredAndSortedPosts.slice(1);

  return (
    <>
      <SEO
        title="Blog & Insights — Littroi Media"
        description="Straight talk on SEO, branding, content & performance marketing — no fluff, no gatekeeping. Just what actually works."
        canonical="/blog"
      />

      <div className="min-h-screen bg-black text-white flex flex-col select-none">

        {/* ==================== PAGE HEADER HERO ==================== */}
        <section className="pt-32 sm:pt-40 pb-16 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-5 h-[2px] bg-[#B3FFC9]" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-white font-bold">
              BLOG
            </span>
          </div>

          {/* Title and Subtitle Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            <div className="flex-1">
              <h1
                className="text-white tracking-[0.4px] m-0 whitespace-normal sm:whitespace-nowrap"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(38px, 4.5vw, 57px)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  color: "#FFFFFF"
                }}
              >
                Ideas that<br />
                <span style={{ color: "#B3FFC9", fontStyle: "italic" }}> move</span> markets.
              </h1>
            </div>

            <div className="shrink-0 text-left lg:text-right pb-1">
              <p
                className="m-0"
                style={{
                  fontFamily: "'benzine', 'Syne', sans-serif",
                  fontSize: "13px",
                  fontWeight: 200,
                  lineHeight: "22px",
                  color: "#FFFFFF94"
                }}
              >
                Straight talk on&nbsp;<strong style={{ fontWeight: 600, color: "#FFFFFF" }}>SEO, branding, content &amp;</strong><br className="hidden sm:inline" />
                <strong style={{ fontWeight: 600, color: "#FFFFFF" }}>performance marketing</strong> —no fluff, <br className="hidden sm:inline" />
                no gatekeeping. Just what <br className="hidden sm:inline" />
                actually works.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== CONTINUOUS MARQUEE RIBBON ==================== */}
        <div className="border-t border-b border-white/[0.07] py-3.5 bg-[#B3FFC9]/[0.02] overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {[...Array(3)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center">
                {MARQUEE_WORDS.map((word, wIdx) => (
                  <React.Fragment key={`${loopIdx}-${wIdx}`}>
                    <span
                      className="px-7 text-[11px] font-bold tracking-[0.16em] uppercase text-white/30 font-mono"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3FFC9] opacity-30 flex-shrink-0" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== MAIN CONTENT SECTION ==================== */}
        <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto space-y-12">

          {/* Filter, Search & Sort Bar matching Screenshot 1 */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">

            {/* Category Tabs (Left) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${isActive
                      ? "bg-[#132c1e] text-[#B3FFC9] border border-[#B3FFC9]/40 shadow-[0_0_20px_rgba(179,255,201,0.2)]"
                      : "bg-[#0e0e0e] text-white/50 border border-white/10 hover:text-white hover:border-white/20"
                      }`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Stacked Search & Sort */}
            <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="w-full pl-4 pr-10 py-2.5 rounded-full bg-[#0e0e0e] border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#B3FFC9] transition-all"
                />
                <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" aria-label="Search">
                  <Search size={14} />
                </button>
              </div>

              {/* Sort Row */}
              <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono uppercase tracking-wider">
                <span>SORT BY</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#0e0e0e] border border-white/10 text-[#B3FFC9] text-xs font-bold pl-3 pr-7 py-1.5 rounded-full cursor-pointer focus:outline-none focus:border-[#B3FFC9]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    <option value="date-desc">LATEST</option>
                    <option value="date-asc">OLDEST</option>
                    <option value="title-asc">A–Z</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* If No Posts Found */}
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl p-8 space-y-4">
              <p className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                No articles match your search or filter
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">

              {/* ==================== FEATURED ARTICLE (HERO CARD) ==================== */}
              {featuredPost && (
                <FadeIn>
                  <Link
                    to={`/blog/${featuredPost.slug || featuredPost.id || featuredPost._id}`}
                    className="block group p-6 sm:p-8 rounded-[28px] bg-[#0c0c0c] border border-white/10 hover:border-[#B3FFC9]/40 transition-all duration-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(179,255,201,0.08)]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                      {/* Left Image Wrap (5 cols) */}
                      <div className="lg:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden bg-[#161616] relative">
                        <img
                          src={
                            featuredPost.featuredImage ||
                            featuredPost.coverImage ||
                            "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png"
                          }
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>

                      {/* Right Body Content (7 cols) */}
                      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                        <div className="space-y-4">
                          {/* Tags row */}
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const style = getCategoryColor(featuredPost.category);
                              return (
                                <span
                                  className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border"
                                  style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                                >
                                  {featuredPost.category || "Strategy"}
                                </span>
                              );
                            })()}
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#1c3024] text-[#B3FFC9] border border-[#B3FFC9]/30">
                              Featured
                            </span>
                          </div>

                          {/* Title */}
                          <h2
                            className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#B3FFC9] transition-colors leading-[1.2]"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {featuredPost.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-white/60 text-sm sm:text-base leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        {/* Bottom Meta & Arrow Link */}
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full bg-[#181818] border border-white/20 flex items-center justify-center font-bold text-xs text-white select-none shrink-0"
                              style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                              {getAuthorInitial(featuredPost.author)}
                            </div>
                            <div className="text-xs font-mono text-white/50">
                              <span className="text-white font-semibold">
                                {typeof featuredPost.author === "object" ? featuredPost.author?.name : (featuredPost.author || "Vishal Singh Mahar")}
                              </span>
                              <span className="mx-1.5">·</span>
                              <span>{featuredPost.date || "Recent"}</span>
                              <span className="mx-1.5">·</span>
                              <span>{featuredPost.readTime || "4 min read"}</span>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-base transition-all group-hover:rotate-45">
                            <ArrowUpRight size={18} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                </FadeIn>
              )}

              {/* ==================== REMAINING POSTS GRID ==================== */}
              {standardPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {standardPosts.map((post, idx) => {
                    const articleSlug = post.slug || post.id || post._id;
                    const coverImage =
                      post.featuredImage ||
                      post.coverImage ||
                      "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png";
                    const catStyle = getCategoryColor(post.category);

                    return (
                      <FadeIn key={post.id || post._id || idx} delay={0.06 * idx} className="h-full">
                        <Link
                          to={`/blog/${articleSlug}`}
                          className="p-5 sm:p-6 rounded-[24px] bg-[#0c0c0c] border border-white/10 flex flex-col justify-between h-full group hover:border-[#B3FFC9]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(179,255,201,0.06)] transition-all duration-300 block space-y-4"
                        >
                          <div className="space-y-4">
                            {/* Card Image */}
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#161616] relative">
                              <img
                                src={coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                              />
                              <div className="absolute top-3 left-3">
                                <span
                                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md"
                                  style={{ backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
                                >
                                  {post.category || "Insight"}
                                </span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-2.5">
                              <h3
                                className="text-lg sm:text-xl font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {post.title}
                              </h3>

                              <p className="text-white/50 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer: Meta + Arrow */}
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full bg-[#181818] border border-white/20 flex items-center justify-center font-bold text-[10px] text-white select-none shrink-0"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {getAuthorInitial(post.author)}
                              </div>
                              <div className="text-[11px] font-mono text-white/40">
                                <span>{post.date || "Recent"}</span>
                                <span className="mx-1">·</span>
                                <span>{post.readTime || "4 min"}</span>
                              </div>
                            </div>

                            <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all group-hover:rotate-45">
                              <ArrowUpRight size={14} />
                            </span>
                          </div>
                        </Link>
                      </FadeIn>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </section>
      </div>
    </>
  );
}
