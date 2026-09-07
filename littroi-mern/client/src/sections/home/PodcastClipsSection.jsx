import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsAPI } from "../../services/api";

const DEFAULT_REELS = [
  "d_8rxpIULNI",
  "cunqekHZxwA",
  "12i0lRjvUoE",
  "feS8f6KNNrE",
  "yhCBiH0SoBU",
  "uuP2xg3aFcg",
  "61wm0FE1mew",
  "8IGD7yLvhmo",
  "CvhHiuMMDYo",
  "n5kGbHE4mRI",
];

function extractYoutubeId(urlOrId) {
  if (!urlOrId) return "";
  const trimmed = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*)/);
  return match && match[1] ? match[1] : trimmed;
}

export function PodcastClipsSection() {
  const stageRef = useRef(null);
  const [activeReel, setActiveReel] = useState(null);
  const [reelsList, setReelsList] = useState(DEFAULT_REELS);

  useEffect(() => {
    let isMounted = true;
    const fetchReels = async () => {
      try {
        const data = await projectsAPI.getAll("podcast-clips");
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const ids = data.map((p) => extractYoutubeId(p.youtubeId || p.videoUrl || p.id)).filter(Boolean);
          if (ids.length > 0) setReelsList(ids);
        }
      } catch (err) {
        console.warn("Podcast clips fetch notice:", err);
      }
    };
    fetchReels();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollReels = (direction) => {
    if (!stageRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = stageRef.current;
    const step = Math.min(clientWidth * 0.75, 480);

    if (direction > 0) {
      if (scrollLeft + clientWidth >= scrollWidth - 40) {
        stageRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        stageRef.current.scrollBy({ left: step, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 40) {
        stageRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        stageRef.current.scrollBy({ left: -step, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="elementor-element elementor-element-dd67070 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-16 sm:py-24 overflow-hidden select-none"
      data-id="dd67070"
      data-element_type="container"
      data-e-type="container"
      id="podcast-clips"
    >
      {/* Spacer (elementor-element-3de4963) */}
      <div
        className="elementor-element elementor-element-3de4963 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="3de4963"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Podcast Clips */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="elementor-element elementor-element-202176e animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          data-id="202176e"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <h2
            className="elementor-heading-title elementor-size-default m-0 text-white"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Podcast <span style={{ color: "#B3FFC9" }}>Clips</span>
          </h2>
        </motion.div>
      </div>

      {/* Reels Container Wrapper with Navigation (elementor-element-0f96534) */}
      <div className="reels-container-wrapper relative w-full bg-black">
        {/* Navigation Left Arrow */}
        <button
          onClick={() => scrollReels(-1)}
          className="scroll-arrow arrow-left absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 w-[50px] h-[50px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Previous Clips"
          title="Previous Clips"
        >
          ❮
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => scrollReels(1)}
          className="scroll-arrow arrow-right absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 w-[50px] h-[50px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Next Clips"
          title="Next Clips"
        >
          ❯
        </button>

        {/* Reels Stage (Horizontal Scroll Track) */}
        <div
          ref={stageRef}
          id="reelsStage"
          className="reels-stage flex items-center justify-start gap-5 relative bg-black py-[60px] px-6 sm:px-14 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {reelsList.map((videoId, index) => {
            const isOdd = index % 2 === 0;
            const isPlaying = activeReel === videoId;

            return (
              <div
                key={`${videoId}-${index}`}
                onClick={() => setActiveReel(videoId)}
                className="reel flex-shrink-0 w-[220px] aspect-[9/16] rounded-[22px] border border-white/10 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-300 group hover:border-[#6ecf97] hover:shadow-[0_0_60px_rgba(110,207,151,0.3)] hover:scale-[1.05] hover:z-20"
                style={{
                  animation: isPlaying
                    ? "none"
                    : isOdd
                    ? "rUp 3.4s ease-in-out infinite"
                    : "rDown 3.4s ease-in-out infinite",
                }}
              >
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none rounded-[22px]"
                    title={`Podcast reel ${videoId}`}
                  />
                ) : (
                  <div className="reel-body w-full h-full relative overflow-hidden bg-[#111111]">
                    {/* Lazy thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Podcast reel thumbnail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/60 pointer-events-none z-[1]" />

                    {/* Play Button Indicator */}
                    <div className="play-btn absolute bottom-5 right-6 w-[45px] h-[45px] rounded-full border border-[#6ecf97]/50 bg-black/40 backdrop-blur-[5px] text-[#6ecf97] flex items-center justify-center text-sm transition-all duration-300 z-[2] group-hover:bg-[#6ecf97] group-hover:text-black group-hover:scale-110 group-hover:border-[#6ecf97] group-hover:shadow-[0_0_20px_rgba(110,207,151,0.6)]">
                      ▶
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
