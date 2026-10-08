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

export function ProjectsSection() {
  const sliderRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll("our-projects");
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
                thumb: p.thumbnail || p.thumb || (yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ""),
                title: p.title || "Project Video"
              };
            })
            .filter((p) => Boolean(p.id));
          setProjectList(formatted);
        }
      } catch (err) {
        console.warn("Projects fetch notice:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProjects();
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
      className="elementor-element elementor-element-eb0cc07 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-16 sm:py-24 overflow-hidden select-none"
      data-id="eb0cc07"
      data-element_type="container"
      data-e-type="container"
      id="projects"
    >
      {/* Spacer */}
      <div
        className="elementor-element elementor-element-d3a48ef exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="d3a48ef"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Our Projects */}
      <div className="max-w-[1400px] 3xl:max-w-[1720px] 4xl:max-w-[2160px] w-full mx-auto px-6 sm:px-10 lg:px-14 4xl:px-16 mb-8 sm:mb-12 4xl:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-c33554c animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
            data-id="c33554c"
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
              Our <span style={{ color: "#B3FFC9" }}>Projects</span>
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
                A curated showcase of cinematic campaigns and creative excellence.<br className="hidden md:inline" />
                Crafted to captivate audiences and turn attention into measurable growth.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Horizontal Video Slider Container */}
      <div className="slider-wrapper relative w-full bg-black">
        {/* Navigation Left Arrow */}
        <button
          onClick={() => moveSlider(-1)}
          className="nav-arrow arrow-left absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 4xl:left-16 w-[52px] h-[52px] 4xl:w-[68px] 4xl:h-[68px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl 4xl:text-2xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Previous Project"
          title="Previous Project"
        >
          ❮
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => moveSlider(1)}
          className="nav-arrow arrow-right absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 4xl:right-16 w-[52px] h-[52px] 4xl:w-[68px] 4xl:h-[68px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl 4xl:text-2xl hidden md:flex shadow-2xl active:scale-95"
          aria-label="Next Project"
          title="Next Project"
        >
          ❯
        </button>

        {/* Scrollable Track */}
        <div
          ref={sliderRef}
          id="videoSlider"
          className="video-slider flex items-center justify-start gap-8 sm:gap-10 4xl:gap-14 relative bg-black py-[70px] 4xl:py-[100px] px-6 sm:px-14 4xl:px-24 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading && projectList.length === 0 ? (
            [1, 2, 3].map((n) => (
              <div
                key={`skel-${n}`}
                className="flex-shrink-0 w-[88vw] sm:w-[680px] md:w-[clamp(650px,64vw,980px)] 3xl:w-[1150px] 4xl:w-[1380px] aspect-video rounded-[22px] border border-white/10 bg-[#141414] animate-pulse flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
              </div>
            ))
          ) : (
            projectList.map((proj, index) => {
              const isOdd = index % 2 === 0;
              const isPlaying = activeVideo === proj.id;

              return (
                <div
                  key={`${proj.id}-${index}`}
                  onClick={() => {
                    if (!isPlaying) {
                      setActiveVideo(proj.id);
                      setLoadingVideo(true);
                    }
                  }}
                  className={`video-card flex-shrink-0 w-[88vw] sm:w-[680px] md:w-[clamp(650px,64vw,980px)] 3xl:w-[1150px] 4xl:w-[1380px] aspect-video rounded-[22px] border border-white/15 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-400 group hover:border-[#6ecf97] hover:shadow-[0_0_50px_rgba(110,207,151,0.3)] ${isPlaying ? "" : "hover:scale-[1.03] hover:z-20"}`}
                  style={{
                    animation: isPlaying
                      ? "none"
                      : isOdd
                        ? "floatUp 3.6s ease-in-out infinite"
                        : "floatDown 3.6s ease-in-out infinite",
                  }}
                >
                  {isPlaying ? (
                    <CarouselVideoPlayer
                      videoId={proj.id}
                      title={proj.title || `Project video ${proj.id}`}
                      loadingLabel="Loading video..."
                      roundedClassName="rounded-[22px]"
                      sectionId="projects"
                      onClose={() => {
                        setActiveVideo(null);
                        setLoadingVideo(false);
                      }}
                    />
                  ) : (
                    <div className="video-overlay w-full h-full relative overflow-hidden bg-[#111111]">
                      {/* Lazy-loaded optimized thumbnail with fallback */}
                      <img
                        src={proj.thumb}
                        alt={proj.title || "Project thumbnail"}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://img.youtube.com/vi/${proj.id}/hqdefault.jpg`;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60 pointer-events-none z-[1]" />

                      {/* Play Button */}
                      <div className="play-btn absolute bottom-6 right-7 w-[48px] h-[48px] rounded-full border border-[#6ecf97]/60 bg-black/60 backdrop-blur-[6px] text-[#6ecf97] flex items-center justify-center text-sm transition-all duration-300 z-[2] group-hover:bg-[#6ecf97] group-hover:text-black group-hover:scale-110 group-hover:border-[#6ecf97] group-hover:shadow-[0_0_25px_rgba(110,207,151,0.7)]">
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