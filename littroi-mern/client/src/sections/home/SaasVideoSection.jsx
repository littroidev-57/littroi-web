import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsAPI } from "../../services/api";

const DEFAULT_SAAS = [
  {
    id: "tV-bkSj05OA",
    thumb: "https://img.youtube.com/vi/tV-bkSj05OA/maxresdefault.jpg",
    title: "SaaS Video Showcase"
  }
];

function extractYoutubeId(urlOrId) {
  if (!urlOrId) return "";
  const trimmed = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*)/);
  return match && match[1] ? match[1] : trimmed;
}

export function SaasVideoSection() {
  const sliderRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [saasList, setSaasList] = useState(DEFAULT_SAAS);

  useEffect(() => {
    let isMounted = true;
    const fetchSaas = async () => {
      try {
        const data = await projectsAPI.getAll("saas-video");
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p) => {
            const yId = extractYoutubeId(p.youtubeId || p.videoUrl || p.id);
            return {
              id: yId,
              thumb: p.thumbnail || p.thumb || `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`,
              title: p.title || "SaaS Video"
            };
          });
          setSaasList(formatted);
        }
      } catch (err) {
        console.warn("SaaS videos fetch notice:", err);
      }
    };
    fetchSaas();
    return () => {
      isMounted = false;
    };
  }, []);

  const moveSlider = (direction) => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const step = Math.min(clientWidth * 0.85, 750);

    if (direction > 0) {
      if (scrollLeft + clientWidth >= scrollWidth - 60) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 60) {
        sliderRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="elementor-element elementor-element-233657b e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-16 sm:py-24 overflow-hidden select-none"
      data-id="233657b"
      data-element_type="container"
      data-e-type="container"
      id="saas-video"
    >
      {/* Spacer (elementor-element-4cd19a5) */}
      <div
        className="elementor-element elementor-element-4cd19a5 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="4cd19a5"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Saas Video */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="elementor-element elementor-element-b475ecf animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          data-id="b475ecf"
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
            Saas <span style={{ color: "#B3FFC9" }}>Video</span>
          </h2>
        </motion.div>
      </div>

      {/* Video Container Wrapper (elementor-element-74cd85a) */}
      <div className="slider-wrapper relative w-full bg-black">
        {/* Navigation Left Arrow */}
        {saasList.length >= 2 && (
          <button
            onClick={() => moveSlider(-1)}
            className="nav-arrow arrow-left absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 w-[52px] h-[52px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
            aria-label="Previous SaaS Video"
            title="Previous SaaS Video"
          >
            ❮
          </button>
        )}

        {/* Navigation Right Arrow */}
        {saasList.length >= 2 && (
          <button
            onClick={() => moveSlider(1)}
            className="nav-arrow arrow-right absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 w-[52px] h-[52px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl active:scale-95"
            aria-label="Next SaaS Video"
            title="Next SaaS Video"
          >
            ❯
          </button>
        )}

        {/* Horizontal Track */}
        <div
          ref={sliderRef}
          id="videoSlider"
          className="video-slider flex items-center justify-start gap-[30px] relative bg-black py-[60px] px-6 sm:px-14 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {saasList.map((item, idx) => {
            const isPlaying = activeVideo === item.id;
            const isOdd = idx % 2 === 0;

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setActiveVideo(item.id)}
                className="video-card flex-shrink-0 w-[85vw] sm:w-[680px] md:w-[920px] aspect-video rounded-[20px] border border-white/10 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-400 group hover:border-[#6ecf97] hover:shadow-[0_0_50px_rgba(110,207,151,0.25)] hover:scale-[1.04] hover:z-10"
                style={{
                  animation: isPlaying
                    ? "none"
                    : isOdd
                    ? "floatUp 3.6s ease-in-out infinite"
                    : "floatDown 3.6s ease-in-out infinite",
                }}
              >
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${item.id}?autoplay=1&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none"
                    title={item.title || "Saas Video"}
                  />
                ) : (
                  <div className="video-overlay w-full h-full relative overflow-hidden bg-[#111111]">
                    {/* Lazy thumbnail */}
                    <img
                      src={item.thumb}
                      alt={item.title || "Saas Video thumbnail"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50 pointer-events-none z-[1]" />

                    {/* Play Button */}
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
