import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsAPI } from "../../services/api";

const DEFAULT_SHORTS = [
  "VTBXEhkKT1Y",
  "yD7pK3WVp4M",
  "pgxT_b8yj0o",
  "vIVtrsp54Kc",
  "RgmoKjvP4Wk",
  "8XxNw40VlAo",
  "mlgM1RFbk1U",
  "0N-Rg64UbJc",
  "IHxOuDUIsGI",
  "Q3tTyeLjsyE",
];

function extractYoutubeId(urlOrId) {
  if (!urlOrId) return "";
  const trimmed = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*)/);
  return match && match[1] ? match[1] : trimmed;
}

export function ShortFormSection() {
  const stageRef = useRef(null);
  const [activeShort, setActiveShort] = useState(null);
  const [shortsList, setShortsList] = useState(DEFAULT_SHORTS);

  useEffect(() => {
    let isMounted = true;
    const fetchShorts = async () => {
      try {
        const data = await projectsAPI.getAll("short-form");
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const ids = data.map((p) => extractYoutubeId(p.youtubeId || p.videoUrl || p.id)).filter(Boolean);
          if (ids.length > 0) setShortsList(ids);
        }
      } catch (err) {
        console.warn("Short form fetch notice:", err);
      }
    };
    fetchShorts();
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
      className="elementor-element elementor-element-f320fa3 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-16 sm:py-24 overflow-hidden select-none"
      data-id="f320fa3"
      data-element_type="container"
      data-e-type="container"
      id="short-form"
    >
      {/* Spacer (elementor-element-9321b9c) */}
      <div
        className="elementor-element elementor-element-9321b9c exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="9321b9c"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Short Form Content */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="elementor-element elementor-element-5ce9fe8 animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          data-id="5ce9fe8"
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
            Short Form <span style={{ color: "#B3FFC9" }}>Content</span>
          </h2>
        </motion.div>
      </div>

      {/* Reels Container Wrapper with Navigation (elementor-element-dac7a3e) */}
      <div className="littroi-reels-container-wrapper relative w-full bg-black overflow-hidden">
        {/* Navigation Left Arrow */}
        <button
          onClick={() => scrollReels(-1)}
          className="littroi-scroll-arrow littroi-arrow-left absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 w-[50px] h-[50px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Previous Short Form Content"
          title="Previous Short Form Content"
        >
          ❮
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => scrollReels(1)}
          className="littroi-scroll-arrow littroi-arrow-right absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 w-[50px] h-[50px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Next Short Form Content"
          title="Next Short Form Content"
        >
          ❯
        </button>

        {/* Reels Stage (Horizontal Scroll Track) */}
        <div
          ref={stageRef}
          id="littroiReelsStage"
          className="littroi-reels-stage flex items-center justify-start gap-5 relative bg-black py-[60px] px-6 sm:px-14 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar z-[1]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {shortsList.map((videoId, index) => {
            const isOdd = index % 2 === 0;
            const isPlaying = activeShort === videoId;

            return (
              <div
                key={`${videoId}-${index}`}
                onClick={() => setActiveShort(videoId)}
                className="littroi-reel flex-shrink-0 w-[220px] aspect-[9/16] rounded-[22px] border border-white/12 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-300 group hover:border-[#6ecf97] hover:shadow-[0_0_60px_rgba(110,207,151,0.3)] hover:scale-[1.05] hover:z-20"
              >
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none rounded-[22px]"
                    title={`Short form content ${videoId}`}
                  />
                ) : (
                  <div className="littroi-reel-body w-full h-full relative overflow-hidden bg-[#111111]">
                    {/* Lazy thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt="Short form content thumbnail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        animation: isOdd
                          ? "littroi-rUp 3.4s ease-in-out infinite"
                          : "littroi-rDown 3.4s ease-in-out infinite",
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/60 pointer-events-none z-[1]" />

                    {/* Play Button Indicator */}
                    <div className="littroi-play-btn absolute bottom-5 right-6 w-[45px] h-[45px] rounded-full border border-[#6ecf97]/50 bg-black/40 backdrop-blur-[5px] text-[#6ecf97] flex items-center justify-center text-sm transition-all duration-300 z-[2] group-hover:bg-[#6ecf97] group-hover:text-black group-hover:scale-110 group-hover:border-[#6ecf97] group-hover:shadow-[0_0_20px_rgba(110,207,151,0.6)]">
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
