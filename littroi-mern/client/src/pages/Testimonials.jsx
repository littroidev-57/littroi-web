import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  Quote,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Play,
  TrendingUp,
  Video,
  ShieldCheck,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Maximize2,
  Plus,
  Loader2
} from "lucide-react";
import { SEO } from "../utils/seo";
import { testimonialsAPI } from "../services/api";
import { CountUpNumber } from "../components/animations/CountUpNumber";

import avatarMarc from "../assets/Group 1100.png";
import avatarSpencer from "../assets/Group 1082.png";
import avatarHarrison from "../assets/Group 1079.png";

/**
 * Interactive 3D Cursor Spotlight Card
 * Inspired by Linear & Raycast award-winning UI interactions
 */
function SpotlightCard({ children, className = "", spotlightColor = "rgba(179, 255, 201, 0.14)" }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 transition-colors duration-300 ${className}`}
    >
      {/* Reactive Radial Torch Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      {/* Border reactive highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.8 : 0,
          border: "1px solid rgba(179, 255, 201, 0.3)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/**
 * Animated Soundwave Equalizer Component
 */
function SoundwaveEqualizer() {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[12, 16, 8, 14, 10, 15, 9].map((height, i) => (
        <motion.span
          key={i}
          animate={{ height: [4, height, 6, height] }}
          transition={{
            duration: 0.8 + i * 0.15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="w-[3px] bg-[#B3FFC9] rounded-full"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Loader Card for Video Testimonials
 */
function TestimonialSkeletonCard({ isEven = true }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 p-4 sm:p-7 md:p-10 animate-pulse">
      <div
        className={`flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-14 ${
          isEven ? "" : "lg:flex-row-reverse"
        }`}
      >
        {/* Video Player Column Skeleton */}
        <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] flex items-center justify-center relative shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Play size={20} className="text-white/20 ml-0.5" />
          </div>
        </div>

        {/* Quote & Author Column Skeleton */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, sIdx) => (
                  <div key={sIdx} className="w-3.5 h-3.5 rounded-sm bg-[#B3FFC9]/20" />
                ))}
              </div>
              <div className="w-20 h-5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/5" />
          </div>

          {/* Simulated Quote Lines */}
          <div className="space-y-2.5">
            <div className="h-4 bg-white/10 rounded-md w-full" />
            <div className="h-4 bg-white/10 rounded-md w-[92%]" />
            <div className="h-4 bg-white/10 rounded-md w-[75%]" />
          </div>

          {/* Simulated Author Info */}
          <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-white/10">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 border border-white/15 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-white/15 rounded w-32" />
                <div className="h-3.5 bg-[#B3FFC9]/15 rounded-full w-14" />
              </div>
              <div className="h-3 bg-white/10 rounded w-44" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCinemaVideo, setActiveCinemaVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    testimonialsAPI
      .getAll()
      .then((data) => {
        if (isMounted) {
          setTestimonials(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load dynamic testimonials:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter ONLY video testimonials
  const videoTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const vidId =
        t.videoId ||
        (t.videoUrl
          ? t.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)?.[1]
          : "");
      return Boolean(vidId || (t.type === "video" && t.videoUrl));
    });
  }, [testimonials]);

  // Video Testimonials Pagination
  const [visibleVideoCount, setVisibleVideoCount] = useState(4);
  const [isLoadingMoreVideos, setIsLoadingMoreVideos] = useState(false);

  const displayedVideos = videoTestimonials.slice(0, visibleVideoCount);
  const hasMoreVideos = visibleVideoCount < videoTestimonials.length;

  const handleLoadMoreVideos = () => {
    setIsLoadingMoreVideos(true);
    setTimeout(() => {
      setVisibleVideoCount((prev) => Math.min(prev + 4, videoTestimonials.length));
      setIsLoadingMoreVideos(false);
    }, 300);
  };

  return (
    <>
      <SEO
        title="Client Testimonials & Stories | Littroi"
        description="Discover how founders, creators, and podcasters scale their channels and content retention with Littroi. Watch client video reviews and read verified testimonials."
        canonical="/testimonials"
      />

      <div className="bg-black text-white min-h-screen select-none overflow-hidden">
        {/* =========================================================================
            CINEMA MODAL (FULLSCREEN THEATER MODE WITH BLUR BACKDROP)
           ========================================================================= */}
        <AnimatePresence>
          {activeCinemaVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
              onClick={() => setActiveCinemaVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(179,255,201,0.25)] bg-black"
              >
                <button
                  type="button"
                  onClick={() => setActiveCinemaVideo(null)}
                  className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white hover:text-[#B3FFC9] hover:scale-110 transition-all flex items-center justify-center cursor-pointer shadow-lg"
                  aria-label="Close Cinema Player"
                >
                  <X size={20} />
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${activeCinemaVideo.videoId}?autoplay=1&controls=1&rel=0`}
                  title={`${activeCinemaVideo.name} Full Client Review`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-none block"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            HERO SECTION
           ========================================================================= */}
        <section className="pt-32 sm:pt-44 pb-12 sm:pb-16 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16 relative">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#B3FFC9]/[0.035] rounded-full blur-[150px] pointer-events-none" />

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
              — TESTIMONIALS
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-14 pb-10 sm:pb-12 border-b border-white/10">
            {/* Left: Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <h1
                className="m-0 text-white tracking-tight"
                style={{
                  fontFamily: "'benzine', 'Benzin', sans-serif",
                  fontSize: "clamp(34px, 4.4vw, 56px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                Client <span style={{ color: "#B3FFC9" }}>Stories</span>
              </h1>
            </motion.div>

            {/* Right: Subtitle paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[680px]"
            >
              <p
                className="m-0"
                style={{
                  fontFamily: "'benzine', 'Benzin', sans-serif",
                  fontSize: "13px",
                  fontWeight: 200,
                  lineHeight: "22px",
                  color: "#FFFFFF94",
                }}
              >
                Real feedback from founders, creators, and brands who scaled their reach with Littroi — where every cut, strategy, and frame drives verified retention and real numbers.
              </p>
            </motion.div>
          </div>

          {/* Performance Metrics Strip with Floating Hover & Count-Up Transitions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 pt-6 sm:pt-10"
          >
            {[
              { label: "Organic Views Driven", value: "100M+", icon: TrendingUp },
              { label: "Videos Mastered", value: "1,200+", icon: Video },
              { label: "Channels Scaled", value: "40+", icon: Layers },
              { label: "On-Time Delivery", value: "100%", icon: ShieldCheck }
            ].map((stat, sIdx) => {
              const IconComp = stat.icon;
              return (
                <SpotlightCard
                  key={sIdx}
                  className="p-3.5 sm:p-5 md:p-6"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <p
                      className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#B3FFC9] m-0"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <CountUpNumber
                        value={stat.value}
                        duration={2.2}
                        delay={0.15 + sIdx * 0.12}
                      />
                    </p>
                    <IconComp size={16} className="text-white/30 shrink-0" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-mono text-white/60 m-0 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </p>
                </SpotlightCard>
              );
            })}
          </motion.div>
        </section>

        {/* =========================================================================
            ALL VIDEO STORIES CONTAINER WITH 3D SPOTLIGHT CARDS
           ========================================================================= */}
        {isLoading ? (
          <section className="py-6 sm:py-12 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
            <div className="space-y-10 sm:space-y-20">
              {[0, 1].map((idx) => (
                <TestimonialSkeletonCard key={idx} isEven={idx % 2 === 0} />
              ))}
            </div>
          </section>
        ) : videoTestimonials.length === 0 ? (
          <div className="py-24 text-center max-w-lg mx-auto space-y-4 px-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B3FFC9]">
              <Video size={24} />
            </div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              No Video Testimonials Found
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-mono">
              Client video reviews will appear dynamically here as soon as they are added in the Admin panel.
            </p>
          </div>
        ) : (
          <section className="py-6 sm:py-12 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
            <div className="space-y-10 sm:space-y-20">
              {displayedVideos.map((item, idx) => {
                const authorName = item.name || item.clientName || "Client";
                const authorRole = item.role || item.clientRole || "";
                const quoteText = item.quote || item.testimonial || "";
                const avatarSrc = item.avatar || item.clientImage || avatarMarc;
                const videoId =
                  item.videoId ||
                  (item.videoUrl
                    ? item.videoUrl.match(
                      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
                    )?.[1]
                    : "") ||
                  "";
                const isEven = idx % 2 === 0;

                return (
                  <SpotlightCard
                    key={item._id || item.id || idx}
                    className="p-4 sm:p-7 md:p-10"
                  >
                    <div
                      className={`flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-14 ${isEven ? "" : "lg:flex-row-reverse"
                        }`}
                    >
                      {/* Video Column with Cinema mode button */}
                      <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/15 bg-[#111111] shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative group">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?controls=1&rel=0&playsinline=0`}
                          title={`${authorName} Client Video Review`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-none block"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveCinemaVideo(item)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-black/80 hover:bg-[#B3FFC9] hover:text-black text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-lg cursor-pointer"
                          title="Open in Cinema Mode"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>

                      {/* Testimonial Quote Column */}
                      <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-4 sm:space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex text-[#B3FFC9]">
                              {[...Array(5)].map((_, sIdx) => (
                                <Star key={sIdx} size={15} className="fill-[#B3FFC9]" />
                              ))}
                            </div>
                            {item.metric && (
                              <span className="text-[10px] sm:text-[11px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 border border-[#B3FFC9]/25 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold ml-1">
                                {item.metric}
                              </span>
                            )}
                          </div>

                          <Quote
                            size={24}
                            className="sm:w-8 sm:h-8 text-white/15 group-hover:text-[#B3FFC9]/40 group-hover:scale-110 transition-all duration-300 shrink-0"
                          />
                        </div>

                        {quoteText && (
                          <p
                            className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line m-0"
                            style={{
                              fontFamily: "'benzine', sans-serif",
                              fontSize: "clamp(13px, 1.1vw, 16px)",
                              fontWeight: 300,
                              lineHeight: 1.7,
                              color: "rgba(255, 255, 255, 0.9)",
                            }}
                          >
                            "{quoteText}"
                          </p>
                        )}

                        <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-white/10">
                          <img
                            src={avatarSrc}
                            alt={authorName}
                            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border border-white/15 bg-white/5 p-0.5 shadow-md shrink-0"
                            onError={(e) => {
                              e.target.src = avatarMarc;
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <h4
                                className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide truncate m-0"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {authorName}
                              </h4>
                              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            </div>
                            <p
                              className="text-[11px] sm:text-xs text-gray-400 font-mono tracking-wide mt-0.5 sm:mt-1 truncate m-0"
                              style={{ fontFamily: "'benzine', 'Syne', sans-serif" }}
                            >
                              {authorRole}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>

            {/* Video Stories Pagination Button ("See More") */}
            <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-4">
              {hasMoreVideos ? (
                <button
                  type="button"
                  onClick={handleLoadMoreVideos}
                  disabled={isLoadingMoreVideos}
                  className="group px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-[#B3FFC9] text-white hover:text-black border border-white/20 hover:border-[#B3FFC9] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 shadow-lg hover:shadow-[0_0_30px_rgba(179,255,201,0.35)] hover:scale-105 cursor-pointer disabled:opacity-50"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {isLoadingMoreVideos ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>Loading Video Stories...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="text-[#B3FFC9] group-hover:text-black group-hover:rotate-90 transition-transform duration-300" />
                      <span>See More Video Testimonials</span>
                    </>
                  )}
                </button>
              ) : (
                videoTestimonials.length > 4 && (
                  <span className="px-4 py-1.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 text-xs font-mono text-[#B3FFC9] flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> All {videoTestimonials.length} Video Stories Loaded
                  </span>
                )
              )}
            </div>
          </section>
        )}

        {/* =========================================================================
            BOTTOM CALL-TO-ACTION SECTION WITH SLEEK GLOW
           ========================================================================= */}
        <section className="py-12 sm:py-20 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
          <SpotlightCard className="p-8 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-7 shadow-2xl relative overflow-hidden">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl mx-auto m-0 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              How much longer will you{" "}
              <span className="text-[#B3FFC9] whitespace-nowrap">settle for average?</span>
            </h2>

            <p
              className="text-white/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto m-0 leading-relaxed px-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book a direct strategy call with our production experts to review your content, audit retention bottlenecks, and receive a customized media roadmap.
            </p>

            <div className="flex items-center justify-center pt-2 sm:pt-3">
              <Link
                to="/contact-us"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span>Schedule a Strategy Call</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </SpotlightCard>
        </section>
      </div>
    </>
  );
}
