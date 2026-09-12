import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Edit3,
  Share2,
  Check,
  Eye,
  ChevronUp,
  ArrowUpRight
} from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { BookCallButton } from "../components/shared/BookCallButton";
import { blogAPI, authAPI } from "../services/api";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";
import { autoFormatTextToHtml } from "../utils/blogFormatter";

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

export function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Top Reading Progress Bar (Framer Motion)
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Smart semantic article formatter hook (called unconditionally at top level)
  const formattedContent = useMemo(() => {
    return autoFormatTextToHtml(post?.content || "");
  }, [post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if logged in as Admin
    const checkAdmin = async () => {
      const user = await authAPI.getMe();
      if (user) setIsAdmin(true);
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const found = await blogAPI.getBySlug(slug);
        if (found) {
          setPost(found);
        } else {
          // Check static fallback
          const staticMatch = fallbackBlogs.find((b) => b.slug === slug || b.id === slug);
          if (staticMatch) setPost(staticMatch);
        }

        // Fetch related posts
        const allPosts = await blogAPI.getAll();
        if (allPosts && allPosts.length) {
          setRelatedPosts(allPosts.filter((p) => (p.slug || p.id) !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Session-guarded View Increment
  useEffect(() => {
    if (!slug) return;
    const sessionKey = `viewed_blog_${slug}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      blogAPI.recordView(slug).then((newViews) => {
        if (newViews !== null && newViews !== undefined) {
          setPost((prev) => (prev ? { ...prev, views: newViews } : prev));
        }
      });
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center pt-24 pb-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#B3FFC9] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(179,255,201,0.3)]" />
          <p className="text-xs font-mono text-white/50 tracking-wider uppercase">Loading Article &amp; Insights...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center pt-24 pb-20 px-4 text-center">
        <div className="max-w-md w-full space-y-6 bg-[#0e0e0e] p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Article Not Found
          </h2>
          <p className="text-xs text-white/60">
            The insight or editorial article you're looking for may have been updated or moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/blog"
              className="px-6 py-3 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] transition-all shadow-[0_0_20px_rgba(179,255,201,0.25)]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Back to All Insights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorName = typeof post.author === "object" ? post.author?.name : (post.author || "Vishal Singh Mahar");
  const authorInitials = authorName
    ? authorName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "VM";
  const coverImg = post.featuredImage || post.coverImage;
  const tagsList = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",").map(t => t.trim()) : ["Strategy", "Video", "Retention"]);
  const catStyle = getCategoryColor(post.category);

  return (
    <>
      <SEO
        title={`${post.title} — Littroi Insights`}
        description={post.excerpt}
        ogImage={coverImg}
        canonical={`/blog/${post.slug || post.id}`}
        ogType="article"
      />

      {/* Top Sticky Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B3FFC9] via-[#85ffaa] to-[#22D3EE] origin-left z-50 shadow-[0_0_10px_#B3FFC9]"
      />

      <article className="pt-28 sm:pt-36 pb-24 bg-[#060606] text-white min-h-screen relative overflow-hidden selection:bg-[#B3FFC9] selection:text-black">

        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#B3FFC9]/[0.04] blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute top-96 -left-48 w-80 h-80 bg-[#22D3EE]/[0.02] blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 space-y-10 relative z-10">

          {/* Top Navigation Bar & Action Buttons */}
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors uppercase tracking-wider group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to all insights</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Copy URL */}
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy Article URL"
              >
                {copied ? <Check size={13} className="text-[#B3FFC9]" /> : <Share2 size={13} />}
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>


            </div>
          </div>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md"
                style={{ backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
              >
                {post.category || "Strategy"}
              </span>

              {/* Live Views Counter Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-white/40 text-xs font-mono shadow-sm">

                <Eye size={12} className="text-white/40" />
                <span><strong className="text-white font-bold">{formatViews(post.views)}</strong> readers</span>
              </div>

              <span className="text-xs font-mono text-white/40 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                <Clock size={12} /> {post.readTime || "4 min read"}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Author & Date Bar with Circle Initials */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-white/10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-full bg-[#B3FFC9] text-black font-extrabold flex items-center justify-center text-xs tracking-wider shadow-[0_0_20px_rgba(179,255,201,0.25)] select-none shrink-0"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {authorInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 font-mono">
                    Written by
                  </span>
                  <span
                    className="font-bold text-white text-sm sm:text-base tracking-tight leading-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {authorName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-white/50 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/5">
                <Calendar size={13} className="text-[#B3FFC9]" />
                <span>{post.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Featured Hero Image */}
          <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-[#141414] border border-white/10 shadow-2xl relative group">
            <img
              src={coverImg}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Article Excerpt Callout */}
          {post.excerpt && (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0f0f0f] to-[#0a0a0a] border-l-4 border-[#B3FFC9] border border-white/5 text-white/90 italic text-base sm:text-lg leading-relaxed shadow-lg">
              "{post.excerpt}"
            </div>
          )}

          {/* Article Main Body Content */}
          <div
            className="article-body blog-rich-content max-w-none text-white/80 text-base sm:text-lg leading-relaxed space-y-6 pt-2"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Tags & Quick Social Share Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {tagsList.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={13} className="text-[#B3FFC9] mr-1" />
                {tagsList.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/5 hover:text-white hover:border-[#B3FFC9]/30 transition-all cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : <div />}


          </div>

          {/* Strategy Call Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B3FFC9]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Ready to transform your content strategy?
              </h4>
              <p className="text-xs sm:text-sm text-white/50">
                Book a 1-on-1 strategic growth session with Littroi Media today.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <BookCallButton variant="glow" size="md" />
            </div>
          </div>

          {/* Related Articles Grid with Views */}
          {relatedPosts.length > 0 && (
            <div className="pt-12 border-t border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Related Insights &amp; Breakdowns
                </h3>
                <Link to="/blog" className="text-xs font-mono text-[#B3FFC9] hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id || rPost._id}
                    to={`/blog/${rPost.slug || rPost.id}`}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 block space-y-3 group transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#161616] relative">
                      <img
                        src={rPost.featuredImage || rPost.coverImage}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-white/80 border border-white/10 flex items-center gap-1">
                        <Eye size={10} className="text-[#B3FFC9]" />
                        {formatViews(rPost.views)}
                      </span>
                    </div>

                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] font-bold uppercase tracking-wider inline-block">
                      {rPost.category || "Strategy"}
                    </span>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {rPost.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Floating Back to Top Button */}
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-[#122319] border border-[#B3FFC9]/40 text-[#B3FFC9] hover:bg-[#B3FFC9] hover:text-black shadow-[0_0_25px_rgba(179,255,201,0.3)] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Back to Top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}

      </article>
    </>
  );
}
