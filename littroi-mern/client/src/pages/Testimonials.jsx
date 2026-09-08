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

const CATEGORIES = [
  { id: "all", label: "All Stories", icon: Sparkles },
  { id: "video", label: "Video Testimonials", icon: Video },
  { id: "text", label: "Written Reviews", icon: Quote },
  { id: "podcast", label: "Podcast Growth", icon: Layers },
  { id: "retention", label: "Retention & Social", icon: TrendingUp }
];

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

export function Testimonials() {
  const [activeTab, setActiveTab] = useState("all");
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCinemaVideo, setActiveCinemaVideo] = useState(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

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

  // Filtered list based on active category tab
  const filteredTestimonials = useMemo(() => {
    if (activeTab === "all") return testimonials;
    if (activeTab === "video") {
      return testimonials.filter((t) => Boolean(t.videoId || (t.type === "video" && t.videoUrl)));
    }
    if (activeTab === "text") {
      return testimonials.filter((t) => (!t.videoId && !t.videoUrl) || t.type === "text");
    }
    return testimonials.filter(
      (t) => t.category === activeTab || t.categoryLabel?.toLowerCase().includes(activeTab)
    );
  }, [activeTab, testimonials]);

  // Separate video featured cards and written quote cards
  const videoTestimonials = filteredTestimonials.filter((t) =>
    Boolean(t.videoId || (t.type === "video" && t.videoUrl))
  );
  const writtenTestimonials = filteredTestimonials.filter(
    (t) => (!t.videoId && !t.videoUrl) || t.type === "text"
  );

  // Independent Pagination states (+3 for Videos, +3 for Text Reviews)
  const [visibleVideoCount, setVisibleVideoCount] = useState(3);
  const [visibleTextCount, setVisibleTextCount] = useState(3);
  const [isLoadingMoreVideos, setIsLoadingMoreVideos] = useState(false);
  const [isLoadingMoreTexts, setIsLoadingMoreTexts] = useState(false);

  // Reset pagination to 3 whenever user switches category tabs
  useEffect(() => {
    setVisibleVideoCount(3);
    setVisibleTextCount(3);
  }, [activeTab]);

  const displayedVideos = videoTestimonials.slice(0, visibleVideoCount);
  const hasMoreVideos = visibleVideoCount < videoTestimonials.length;

  const handleLoadMoreVideos = () => {
    setIsLoadingMoreVideos(true);
    setTimeout(() => {
      setVisibleVideoCount((prev) => Math.min(prev + 3, videoTestimonials.length));
      setIsLoadingMoreVideos(false);
    }, 300);
  };

  const displayedTexts = writtenTestimonials.slice(0, visibleTextCount);
  const hasMoreTexts = visibleTextCount < writtenTestimonials.length;

  const handleLoadMoreTexts = () => {
    setIsLoadingMoreTexts(true);
    setTimeout(() => {
      setVisibleTextCount((prev) => Math.min(prev + 3, writtenTestimonials.length));
      setIsLoadingMoreTexts(false);
    }, 300);
  };

  const featuredVideoList = useMemo(() => {
    return testimonials.filter((t) => Boolean(t.videoId || t.videoUrl));
  }, [testimonials]);

  const currentHeroStory = featuredVideoList[activeStoryIdx % (featuredVideoList.length || 1)] || featuredVideoList[0];

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
                Testi<span style={{ color: "#B3FFC9" }}>monials</span>
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
              { label: "Organic Views Driven", value: "50M+", icon: TrendingUp },
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
            CATEGORY FILTER TABS (WITH LIQUID SLIDING PILL & TOUCH SCROLL)
           ========================================================================= */}
        <section className="py-4 sm:py-8 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="w-full overflow-x-auto pb-2 -mb-2 no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-max backdrop-blur-md">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeTab === cat.id;
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveTab(cat.id)}
                      className={`relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${isSelected ? "text-black font-bold" : "text-white/70 hover:text-white"
                        }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeStoryTabLiquid"
                          className="absolute inset-0 bg-[#B3FFC9] rounded-xl shadow-[0_0_24px_rgba(179,255,201,0.45)]"
                          transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        />
                      )}
                      <IconComponent
                        size={13}
                        className={`relative z-10 transition-colors ${isSelected ? "text-black" : "text-white/50"
                          }`}
                      />
                      <span className="relative z-10">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Count Indicator Pill with Transition */}
            <motion.div
              key={filteredTestimonials.length}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-white/60 self-start sm:self-auto"
            >
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            ALL STORIES CONTAINER WITH 3D SPOTLIGHT CARDS & BLUR-FADE TRANSITIONS
           ========================================================================= */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#B3FFC9] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Loading dynamic client stories...
            </span>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="py-24 text-center max-w-lg mx-auto space-y-4 px-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B3FFC9]">
              <Quote size={24} />
            </div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              No Testimonials Found
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-mono">
              New client stories will appear dynamically here as soon as they are added in the Admin panel.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* FEATURED VIDEO STORIES WITH CURSOR SPOTLIGHT */}
              {videoTestimonials.length > 0 && (
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
                      "FApmJphhF9Y";
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

                {/* =========================================================================
                    VIDEO TESTIMONIALS PAGINATION ("LOAD MORE +3")
                   ========================================================================= */}
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
                          <span>See More</span>
                        </>
                      )}
                    </button>
                  ) : (
                    videoTestimonials.length > 3 && (
                      <span className="px-4 py-1.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 text-xs font-mono text-[#B3FFC9] flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> All {videoTestimonials.length} Video Stories Loaded
                      </span>
                    )
                  )}
                </div>
              </section>
            )}

            {/* WRITTEN CLIENT PRAISE GRID WITH 3D SPOTLIGHT CARDS */}
            {writtenTestimonials.length > 0 && (
              <section className="py-8 sm:py-14 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
                <div className="mb-6 sm:mb-10 text-left">
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-1.5 sm:mb-2">
                    IN-DEPTH PERSPECTIVES
                  </span>
                  <h2
                    className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white m-0"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    More Stories from High-Growth Creators
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {displayedTexts.map((item, idx) => {
                    const authorName = item.name || item.clientName || "Client";
                    const authorRole = item.role || item.clientRole || "";
                    const quoteText = item.quote || item.testimonial || "";
                    const avatarSrc = item.avatar || item.clientImage || avatarMarc;

                    return (
                      <SpotlightCard
                        key={item._id || item.id || idx}
                        className="p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-5"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex text-[#B3FFC9]">
                              {[...Array(5)].map((_, sIdx) => (
                                <Star key={sIdx} size={13} className="fill-[#B3FFC9]" />
                              ))}
                            </div>
                            {item.metric && (
                              <span className="text-[9px] sm:text-[10px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 px-2 sm:px-2.5 py-0.5 rounded-full font-bold">
                                {item.metric}
                              </span>
                            )}
                          </div>

                          <p
                            className="text-white/85 text-xs sm:text-sm leading-relaxed m-0"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            "{quoteText}"
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3.5 sm:pt-4 border-t border-white/10">
                          <img
                            src={avatarSrc}
                            alt={authorName}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/15 bg-white/5 shrink-0"
                            onError={(e) => {
                              e.target.src = avatarMarc;
                            }}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4
                                className="text-xs sm:text-sm font-bold text-white truncate m-0"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                {authorName}
                              </h4>
                              <CheckCircle2 size={11} className="text-[#B3FFC9] shrink-0" />
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-white/50 font-mono truncate m-0">
                              {authorRole}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>

                {/* =========================================================================
                    TEXT TESTIMONIALS PAGINATION ("LOAD MORE +3")
                   ========================================================================= */}
                <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/50">
                      Showing <strong className="text-[#B3FFC9]">{displayedTexts.length}</strong> of <strong className="text-white">{writtenTestimonials.length}</strong> Written Reviews
                    </span>
                  </div>

                  {hasMoreTexts ? (
                    <button
                      type="button"
                      onClick={handleLoadMoreTexts}
                      disabled={isLoadingMoreTexts}
                      className="group px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-[#B3FFC9] text-white hover:text-black border border-white/20 hover:border-[#B3FFC9] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 shadow-lg hover:shadow-[0_0_30px_rgba(179,255,201,0.35)] hover:scale-105 cursor-pointer disabled:opacity-50"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {isLoadingMoreTexts ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-black" />
                          <span>Loading Text Reviews...</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="text-[#B3FFC9] group-hover:text-black group-hover:rotate-90 transition-transform duration-300" />
                          <span>Load More Text Testimonials (+3)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    writtenTestimonials.length > 3 && (
                      <span className="px-4 py-1.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 text-xs font-mono text-[#B3FFC9] flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> All {writtenTestimonials.length} Text Reviews Loaded
                      </span>
                    )
                  )}
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      )}

        {/* =========================================================================
            BOTTOM CALL-TO-ACTION SECTION WITH SLEEK GLOW
           ========================================================================= */}
        <section className="py-12 sm:py-20 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14">
          <SpotlightCard className="p-5 sm:p-10 md:p-14 text-center space-y-5 sm:space-y-6 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#B3FFC9]/10 border border-[#B3FFC9]/30 text-[10px] sm:text-xs font-mono text-[#B3FFC9] tracking-wider uppercase">
              <Sparkles size={13} />
              <span>JOIN OUR GROWING ROSTER</span>
            </div>

            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto m-0 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to Be Our Next <br />
              <span className="text-[#B3FFC9]">Success Story?</span>
            </h2>

            <p
              className="text-white/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto m-0 leading-relaxed px-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book a direct strategy call with our production leadership to review your content, audit retention bottlenecks, and receive a customized media roadmap.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Link
                to="/contact-us"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] hover:scale-105 hover:shadow-[0_0_30px_rgba(179,255,201,0.4)] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span>Schedule a Strategy Call</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                to="/case-studies"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/30 text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span>Explore Case Studies</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </SpotlightCard>
        </section>
      </div>
    </>
  );
}
