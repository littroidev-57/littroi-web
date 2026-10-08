import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsAPI } from "../../services/api";
import { CarouselVideoPlayer } from "../../components/ui/CarouselVideoPlayer";

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
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [shortsList, setShortsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchShorts = async () => {
      try {
        const data = await projectsAPI.getAll("short-form");
        if (isMounted && data && Array.isArray(data)) {
          const formatted = data
            .filter((p) => p.isActive !== false)
            .sort((a, b) => {
              const orderA = typeof a.order === "number" ? a.order : 999;
              const orderB = typeof b.order === "number" ? b.order : 999;
              if (orderA !== orderB) return orderA - orderB;
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            })
            .map((p) => {
              const yId = extractYoutubeId(p.youtubeId || p.videoUrl || p.id || p._id);
              return {
                id: yId,
                thumb: p.thumbnail || (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ""),
                title: p.title || "Short Form Content"
              };
            })
            .filter((item) => Boolean(item.id));

          setShortsList(formatted);
        }
      } catch (err) {
        console.warn("Short form fetch notice:", err);
      } finally {
        if (isMounted) setLoading(false);
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
      <div className="max-w-[1400px] 3xl:max-w-[1720px] 4xl:max-w-[2160px] w-full mx-auto px-6 sm:px-10 lg:px-14 4xl:px-16 mb-8 sm:mb-12 4xl:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
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
              className="elementor-heading-title elementor-size-default m-0 text-white 4xl:text-6xl"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(30px, 3.8vw, 46px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Short Form <span style={{ color: "#B3FFC9" }}>Content</span>
            </h2>
          </motion.div>

          <div className="max-w-[700px] 4xl:max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="m-0 lg:text-left 4xl:text-[17px]"
                style={{
                  fontFamily: "'benzine', sans-serif",
                  fontSize: "clamp(12.5px, 1.05vw, 14px)",
                  fontWeight: 200,
                  lineHeight: 1.65,
                  color: "rgba(255, 255, 255, 0.58)",
                  letterSpacing: "0.015em",
                }}
              >
                Binge-worthy vertical videos designed for Reels, Shorts, and TikTok.<br className="hidden md:inline" />
                Fast-paced storytelling crafted to build community and drive organic traction.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reels Container Wrapper with Navigation (elementor-element-dac7a3e) */}
      <div className="littroi-reels-container-wrapper relative w-full bg-black overflow-hidden">
        {/* Navigation Left Arrow */}
        <button
          onClick={() => scrollReels(-1)}
          className="littroi-scroll-arrow littroi-arrow-left absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 4xl:left-14 w-[50px] h-[50px] 4xl:w-[68px] 4xl:h-[68px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl 4xl:text-2xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Previous Short Form Content"
          title="Previous Short Form Content"
        >
          ❮
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => scrollReels(1)}
          className="littroi-scroll-arrow littroi-arrow-right absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 4xl:right-14 w-[50px] h-[50px] 4xl:w-[68px] 4xl:h-[68px] rounded-full bg-[#111111]/85 border border-white/15 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_20px_rgba(110,207,151,0.6)] text-xl 4xl:text-2xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Next Short Form Content"
          title="Next Short Form Content"
        >
          ❯
        </button>

        {/* Reels Stage (Horizontal Scroll Track) */}
        <div
          ref={stageRef}
          id="littroiReelsStage"
          className="littroi-reels-stage flex items-center justify-start gap-5 4xl:gap-8 relative bg-black py-[60px] 4xl:py-[90px] px-6 sm:px-14 4xl:px-24 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar z-[1]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading && shortsList.length === 0 ? (
            [1, 2, 3, 4, 5].map((n) => (
              <div
                key={`skel-short-${n}`}
                className="littroi-reel flex-shrink-0 w-[220px] 3xl:w-[270px] 4xl:w-[320px] aspect-[9/16] rounded-[22px] border border-white/10 bg-[#141414] animate-pulse flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
              </div>
            ))
          ) : (
            shortsList.map((item, index) => {
              const isOdd = index % 2 === 0;
              const videoId = item.id || item;
              const thumbUrl = item.thumb || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              const isPlaying = activeShort === videoId;

              return (
                <div
                  key={`${videoId}-${index}`}
                  onClick={() => {
                    if (!isPlaying) {
                      setActiveShort(videoId);
                      setLoadingVideo(true);
                    }
                  }}
                  className={`littroi-reel flex-shrink-0 w-[220px] 3xl:w-[270px] 4xl:w-[320px] aspect-[9/16] rounded-[22px] border border-white/12 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-300 group hover:border-[#6ecf97] hover:shadow-[0_0_60px_rgba(110,207,151,0.3)] ${isPlaying ? "" : "hover:scale-[1.05] hover:z-20"}`}
                >
                  {isPlaying ? (
                    <CarouselVideoPlayer
                      videoId={videoId}
                      title={item.title || `Short form content ${videoId}`}
                      loadingLabel="Loading short..."
                      roundedClassName="rounded-[22px]"
                      sectionId="short-form"
                      onClose={() => {
                        setActiveShort(null);
                        setLoadingVideo(false);
                      }}
                    />
                  ) : (
                    <div className="littroi-reel-body w-full h-full relative overflow-hidden bg-[#111111]">
                      {/* Lazy thumbnail with fallback */}
                      <img
                        src={thumbUrl}
                        alt={item.title || "Short form content thumbnail"}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
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
            })
          )}
        </div>
      </div>
    </section>
  );
}