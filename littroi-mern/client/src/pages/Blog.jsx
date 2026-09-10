import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, ChevronDown, Eye, Clock, Sparkles, TrendingUp, X, BookOpen, Flame } from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { blogAPI, authAPI } from "../services/api";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";

const MARQUEE_WORDS = [
  "GROW FAST",
  "RETENTION ENGINEERING",
  "CREATIVE FREEDOM",
  "DATA-BACKED STRATEGY",
  "ALGORITHM DECODED",
  "HIGH-VELOCITY CREATIVE",
  "PERFORMANCE MARKETING",
  "BAREILLY TO THE WORLD"
];

function formatViews(num) {
  if (num === null || num === undefined) return "1.2K";
  const n = Number(num);
  if (isNaN(n)) return "1.2K";
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

function getCategoryColor(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("seo")) return { bg: "rgba(34, 211, 238, 0.1)", text: "#22D3EE", border: "rgba(34, 211, 238, 0.3)" };
  if (c.includes("cro") || c.includes("retention")) return { bg: "rgba(244, 114, 182, 0.1)", text: "#F472B6", border: "rgba(244, 114, 182, 0.3)" };
  if (c.includes("performance") || c.includes("growth") || c.includes("video")) return { bg: "rgba(179, 255, 201, 0.1)", text: "#B3FFC9", border: "rgba(179, 255, 201, 0.35)" };
  if (c.includes("marketing") || c.includes("brand")) return { bg: "rgba(251, 191, 36, 0.1)", text: "#FBBF24", border: "rgba(251, 191, 36, 0.3)" };
  return { bg: "rgba(167, 139, 250, 0.1)", text: "#A78BFA", border: "rgba(167, 139, 250, 0.3)" };
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
  const [sortBy, setSortBy] = useState("date-desc"); // 'date-desc' | 'views-desc' | 'date-asc' | 'title-asc'
  const [posts, setPosts] = useState(fallbackBlogs);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await authAPI.getMe();
      if (user) setIsAdmin(true);
    };
    checkAdmin();

    const loadPosts = async () => {
      try {
        const data = await blogAPI.getAll();
        if (data && data.length) {
          setPosts(data);
        }
      } catch (e) {
        console.warn("Failed to load blog posts:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Dynamically extract only categories that exist in uploaded posts from the DB
  const categories = useMemo(() => {
    const list = [{ key: "all", label: "ALL" }];
    const seen = new Set();

    posts.forEach((p) => {
      const rawCat = (p.category || "").trim();
      if (!rawCat) return;
      const lower = rawCat.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        list.push({
          key: lower,
          label: rawCat.toUpperCase(),
        });
      }
    });

    return list;
  }, [posts]);

  // Reset category to "all" if the selected category is no longer present in DB posts
  useEffect(() => {
    if (
      selectedCategory !== "all" &&
      !categories.some(
        (c) => c.key === selectedCategory || c.key.toLowerCase() === selectedCategory.toLowerCase()
      )
    ) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  // Calculate total views across all posts
  const totalViewsCount = useMemo(() => {
    return posts.reduce((acc, p) => acc + (Number(p.views) || 1200), 0);
  }, [posts]);

  // Filter & Sort Posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((p) => {
      const postCat = (p.category || "").trim().toLowerCase();
      const matchCat =
        selectedCategory === "all" ||
        postCat === selectedCategory.toLowerCase();

      const matchSearch =
        !searchQuery.trim() ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchCat && matchSearch;
    });

    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
    } else if (sortBy === "views-desc") {
      result.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
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

      <div className="min-h-screen bg-[#060606] text-white flex flex-col selection:bg-[#B3FFC9] selection:text-black relative overflow-hidden">

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#B3FFC9]/[0.04] blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute top-48 -right-48 w-96 h-96 bg-[#22D3EE]/[0.03] blur-[140px] pointer-events-none rounded-full" />

        {/* ==================== PAGE HEADER HERO ==================== */}
        <section className="pt-32 sm:pt-40 pb-14 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto relative z-10">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span
              className="text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-white hover:text-[#B3FFC9] transition-colors duration-300 cursor-pointer select-none inline-block"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              — BLOG
            </span>
          </motion.div>

          {/* Title and Subtitle Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <h1
                className="text-white tracking-tight m-0"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(40px, 5.2vw, 68px)",
                  fontWeight: 900,
                  lineHeight: 1.05
                }}
              >
                Ideas that<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B3FFC9] via-[#85ffaa] to-white italic">
                  move
                </span> markets.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 text-left lg:text-right pb-1 max-w-md"
            >
              <p
                className="m-0 text-sm sm:text-[15px] leading-relaxed text-white/65 font-normal"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Straight talk on <strong className="text-white font-semibold">SEO, video retention, creative strategy &amp; performance marketing</strong> — zero fluff, zero gatekeeping. Just what delivers outsized enterprise ROI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ==================== CONTINUOUS MARQUEE RIBBON ==================== */}
        <div className="border-t border-b border-white/[0.08] py-3 bg-[#B3FFC9]/[0.02] overflow-hidden whitespace-nowrap backdrop-blur-sm">
          <div className="flex w-max animate-marquee">
            {[...Array(3)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center">
                {MARQUEE_WORDS.map((word, wIdx) => (
                  <React.Fragment key={`${loopIdx}-${wIdx}`}>
                    <span
                      className="px-8 text-[11px] font-bold tracking-[0.18em] uppercase text-white/40 hover:text-[#B3FFC9] transition-colors font-mono"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3FFC9] opacity-40 shadow-[0_0_6px_#B3FFC9] flex-shrink-0" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== MAIN CONTENT SECTION ==================== */}
        <section className="py-12 sm:py-16 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto space-y-12 relative z-10">

          {/* Filter, Search & Sort Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">

            {/* Category Tabs (Left) */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-[#132c1e] text-[#B3FFC9] border border-[#B3FFC9]/60 shadow-[0_0_25px_rgba(179,255,201,0.25)]"
                        : "bg-[#0f0f0f] text-white/60 border border-white/10 hover:text-white hover:border-white/25 hover:bg-white/[0.04]"
                      }`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Stacked Search & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search Bar with Clear Button */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles & topics…"
                  className="w-full pl-9 pr-8 py-2.5 rounded-full bg-[#0e0e0e] border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#B3FFC9] focus:ring-1 focus:ring-[#B3FFC9]/40 transition-all shadow-inner"
                />
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Sort Row */}
              <div className="flex items-center justify-end gap-2 text-[11px] text-white/40 font-mono uppercase tracking-wider shrink-0">
                <span>SORT</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#0e0e0e] border border-white/10 text-[#B3FFC9] text-xs font-bold pl-3 pr-7 py-2 rounded-full cursor-pointer focus:outline-none focus:border-[#B3FFC9] transition-all"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    <option value="date-desc">LATEST</option>
                    <option value="views-desc">MOST READ</option>
                    <option value="date-asc">OLDEST</option>
                    <option value="title-asc">A–Z</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary if filtering */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center justify-between py-2 text-xs font-mono text-white/50 border-b border-white/5">
              <span>Showing {filteredAndSortedPosts.length} article{filteredAndSortedPosts.length === 1 ? "" : "s"}</span>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-[#B3FFC9] hover:underline cursor-pointer flex items-center gap-1"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* If No Posts Found */}
          {filteredAndSortedPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 border border-dashed border-white/15 rounded-3xl p-8 space-y-4 bg-white/[0.01]"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mx-auto">
                <BookOpen size={24} />
              </div>
              <p className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                No articles match your search or filter
              </p>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Try searching for different keywords like "video", "retention", "SaaS", or "SEO".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] transition-all cursor-pointer shadow-[0_0_20px_rgba(179,255,201,0.2)]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-12">

              {/* ==================== FEATURED ARTICLE (HERO CARD) ==================== */}
              {featuredPost && (
                <FadeIn>
                  <Link
                    to={`/blog/${featuredPost.slug || featuredPost.id || featuredPost._id}`}
                    className="block group p-6 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#101010] to-[#0a0a0a] border border-white/10 hover:border-[#B3FFC9]/50 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(179,255,201,0.1)] relative overflow-hidden"
                  >
                    {/* Subtle top edge gradient reflection */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9]/30 to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                      {/* Left Image Wrap (5 cols) */}
                      <div className="lg:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden bg-[#161616] relative">
                        <img
                          src={
                            featuredPost.featuredImage ||
                            featuredPost.coverImage
                          }
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Hover Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                        {/* Top Tag Badges over Image */}
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-black/80 backdrop-blur-md text-[#B3FFC9] border border-[#B3FFC9]/40 flex items-center gap-1 shadow-lg">
                            <Flame size={12} className="text-[#B3FFC9]" />
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Right Body Content (7 cols) */}
                      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                        <div className="space-y-4">

                          {/* Tags & Views Row */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            {(() => {
                              const style = getCategoryColor(featuredPost.category);
                              return (
                                <span
                                  className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border backdrop-blur-sm"
                                  style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                                >
                                  {featuredPost.category || "Strategy"}
                                </span>
                              );
                            })()}

                            {/* Views Count Pill */}
                            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/[0.04] text-white/80 border border-white/10 flex items-center gap-1.5 shadow-sm">
                              <Eye size={12} className="text-[#B3FFC9]" />
                              <span>{formatViews(featuredPost.views)} reads</span>
                            </span>

                            <span className="px-3 py-1 rounded-full text-[11px] font-mono text-white/50 bg-white/[0.02] border border-white/5 flex items-center gap-1.5">
                              <Clock size={11} className="text-white/40" />
                              <span>{featuredPost.readTime || "4 min read"}</span>
                            </span>
                          </div>

                          {/* Title */}
                          <h2
                            className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#B3FFC9] transition-colors duration-300 leading-[1.18] tracking-tight"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            {featuredPost.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-white/65 text-sm sm:text-base leading-relaxed line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        {/* Bottom Meta & Arrow Link */}
                        <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full bg-[#1b2f23] border border-[#B3FFC9]/30 flex items-center justify-center font-bold text-xs text-[#B3FFC9] shadow-sm shrink-0"
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
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-base transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 shadow-lg">
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
                      post.coverImage;
                    const catStyle = getCategoryColor(post.category);

                    return (
                      <FadeIn key={post.id || post._id || idx} delay={0.05 * (idx % 6)} className="h-full">
                        <Link
                          to={`/blog/${articleSlug}`}
                          className="p-5 sm:p-6 rounded-[28px] bg-[#0c0c0c] border border-white/10 flex flex-col justify-between h-full group hover:border-[#B3FFC9]/40 hover:bg-[#0e0e0e] hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(179,255,201,0.08)] hover:-translate-y-1 transition-all duration-400 block space-y-4 relative overflow-hidden"
                        >
                          <div className="space-y-4">
                            {/* Card Image */}
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#161616] relative">
                              <img
                                src={coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                              {/* Category Tag on Image */}
                              <div className="absolute top-3 left-3">
                                <span
                                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-md"
                                  style={{ backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
                                >
                                  {post.category || "Insight"}
                                </span>
                              </div>

                              {/* Views Pill Overlay on Image */}
                              <div className="absolute bottom-2.5 right-2.5">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/80 backdrop-blur-md text-white/90 border border-white/10 flex items-center gap-1 shadow-md">
                                  <Eye size={11} className="text-[#B3FFC9]" />
                                  <span>{formatViews(post.views)}</span>
                                </span>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-2.5">
                              <h3
                                className="text-lg sm:text-xl font-bold text-white group-hover:text-[#B3FFC9] transition-colors duration-300 leading-snug tracking-tight line-clamp-2"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {post.title}
                              </h3>

                              <p className="text-white/55 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer: Meta + Arrow */}
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-full bg-[#181818] border border-white/20 flex items-center justify-center font-bold text-[10px] text-white select-none shrink-0"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {getAuthorInitial(post.author)}
                              </div>
                              <div className="text-[11px] font-mono text-white/45 flex items-center gap-1">
                                <span>{post.date || "Recent"}</span>
                                <span className="mx-1">·</span>
                                <span>{post.readTime || "4 min"}</span>
                              </div>
                            </div>

                            <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all duration-300 group-hover:rotate-45 shadow-sm">
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
