import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag, Edit3, Share2, Sparkles, Check } from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { Badge } from "../components/ui/Badge";
import { BookCallButton } from "../components/shared/BookCallButton";
import { blogAPI, authAPI } from "../services/api";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center pt-24 pb-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#B3FFC9] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-white/50 tracking-wider uppercase">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center pt-24 pb-20 px-4 text-center">
        <div className="max-w-md w-full space-y-6 bg-[#0e0e0e] p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Article Not Found
          </h2>
          <p className="text-xs text-white/60">
            The insight or child article you're looking for may have been updated or moved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/blog"
              className="px-6 py-3 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] transition-all"
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
  const coverImg = post.featuredImage || post.coverImage || "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png";
  const tagsList = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(",").map(t => t.trim()) : ["Strategy", "Video", "Retention"]);

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(post.content || "");

  return (
    <>
      <SEO
        title={`${post.title} — Littroi Insights`}
        description={post.excerpt}
        ogImage={coverImg}
        canonical={`/blog/${post.slug || post.id}`}
        ogType="article"
      />

      <article className="pt-28 sm:pt-36 pb-24 bg-[#070707] text-white min-h-screen relative overflow-hidden">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#B3FFC9]/[0.03] blur-[140px] pointer-events-none" />

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

            <div className="flex items-center gap-3">
              {/* Share / Copy Link */}
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy Article URL"
              >
                {copied ? <Check size={13} className="text-[#B3FFC9]" /> : <Share2 size={13} />}
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>

              {/* Admin Direct Edit Shortcut */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3.5 py-1.5 rounded-full bg-[#B3FFC9]/10 hover:bg-[#B3FFC9]/20 border border-[#B3FFC9]/30 text-[#B3FFC9] text-xs font-bold flex items-center gap-1.5 transition-all"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Edit3 size={13} />
                  <span>Edit in Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/30 text-[#B3FFC9] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>
                {post.category || "Content Strategy"}
              </span>
              <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                <Clock size={12} /> {post.readTime || "4 min read"}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Author & Date Bar with Circle Initials */}
            <div className="flex items-center justify-between py-5 border-y border-white/10">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-full bg-[#B3FFC9] text-black font-extrabold flex items-center justify-center text-xs tracking-wider shadow-[0_0_20px_rgba(179,255,201,0.25)] select-none shrink-0"
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

              <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/5">
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
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Excerpt Callout */}
          {post.excerpt && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e0e0e] border-l-4 border-[#B3FFC9] border border-white/5 text-white/90 italic text-base sm:text-lg leading-relaxed font-serif">
              "{post.excerpt}"
            </div>
          )}

          {/* Article Main Body Content (HTML + Formatted text) */}
          <div className="article-body text-white/80 text-base sm:text-lg leading-relaxed space-y-6 pt-2">
            {isHtml ? (
              <div
                className="prose prose-invert max-w-none space-y-6 text-white/80 prose-headings:font-bold prose-headings:text-white prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-a:text-[#B3FFC9] prose-a:underline hover:prose-a:text-white prose-strong:text-white"
                style={{ fontFamily: "inherit" }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              post.content?.trim().split("\n\n").map((block, idx) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("- ")) {
                  const items = block.split("\n");
                  return (
                    <ul key={idx} className="space-y-2 list-disc list-inside text-white/70 pl-2">
                      {items.map((item, iIdx) => (
                        <li key={iIdx}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx} className="leading-relaxed text-white/80">{block}</p>;
              })
            )}
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-[#B3FFC9] mr-1" />
              {tagsList.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/5 hover:text-white hover:border-[#B3FFC9]/30 transition-all cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Strategy Call Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
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

          {/* Related Articles Carousel / Grid */}
          {relatedPosts.length > 0 && (
            <div className="pt-12 border-t border-white/10 space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Related Insights &amp; Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id || rPost._id}
                    to={`/blog/${rPost.slug || rPost.id}`}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 block space-y-3 group transition-all"
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#161616]">
                      <img
                        src={rPost.featuredImage || rPost.coverImage || "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png"}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] font-bold">
                      {rPost.category}
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
      </article>
    </>
  );
}
