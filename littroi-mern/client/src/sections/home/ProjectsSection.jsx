import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsAPI } from "../../services/api";

const DEFAULT_PROJECTS = [
  { id: "MWdasGhL9o0", thumb: "https://img.youtube.com/vi/MWdasGhL9o0/maxresdefault.jpg" },
  { id: "rBNWNtLIA4s", thumb: "https://img.youtube.com/vi/rBNWNtLIA4s/maxresdefault.jpg" },
  { id: "Ya8-PsyzTR4", thumb: "https://img.youtube.com/vi/Ya8-PsyzTR4/maxresdefault.jpg" },
  { id: "6-qp1PNaGiM", thumb: "https://img.youtube.com/vi/6-qp1PNaGiM/maxresdefault.jpg" },
  { id: "Rmeb2Cv6haA", thumb: "https://img.youtube.com/vi/Rmeb2Cv6haA/maxresdefault.jpg" },
  { id: "BQ8yYuzlovk", thumb: "https://littroi.com/wp-content/uploads/2026/06/Ron-7-scaled.png" },
  { id: "_kcU6ZxSrzw", thumb: "https://img.youtube.com/vi/_kcU6ZxSrzw/maxresdefault.jpg" },
  { id: "c1Bb2gW248A", thumb: "https://img.youtube.com/vi/c1Bb2gW248A/maxresdefault.jpg" },
  { id: "yHTgr-JzxrI", thumb: "https://img.youtube.com/vi/yHTgr-JzxrI/maxresdefault.jpg" },
  { id: "iw0Fyvb095s", thumb: "https://img.youtube.com/vi/iw0Fyvb095s/maxresdefault.jpg" },
];

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
  const [projectList, setProjectList] = useState(DEFAULT_PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await projectsAPI.getAll("our-projects");
      if (data && data.length) {
        const formatted = data.map((p) => {
          const yId = extractYoutubeId(p.youtubeId || p.videoUrl);
          return {
            id: yId,
            thumb: p.thumbnail || `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`,
            title: p.title
          };
        });
        setProjectList(formatted);
      }
    };
    fetchProjects();
  }, []);


  const moveSlider = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
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

      {/* Header: Our Projects with fadeInLeft transition */}
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8">
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
            className="elementor-heading-title elementor-size-default m-0 text-white"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Our <span style={{ color: "#B3FFC9" }}>Projects</span>
          </h2>
        </motion.div>
      </div>

      {/* Horizontal Video Slider Container */}
      <div className="slider-wrapper relative w-full bg-black">
        {/* Navigation Left Arrow */}
        <button
          onClick={() => moveSlider(-750)}
          className="nav-arrow arrow-left absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 w-[52px] h-[52px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl"
          aria-label="Previous Project"
        >
          ❮
        </button>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => moveSlider(750)}
          className="nav-arrow arrow-right absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 w-[52px] h-[52px] rounded-full bg-[#111111]/90 border border-white/20 text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#6ecf97] hover:text-black hover:border-[#6ecf97] hover:shadow-[0_0_25px_rgba(110,207,151,0.6)] text-xl hidden md:flex shadow-2xl"
          aria-label="Next Project"
        >
          ❯
        </button>

        {/* Scrollable Track */}
        <div
          ref={sliderRef}
          id="videoSlider"
          className="video-slider flex items-center justify-start gap-8 sm:gap-10 relative bg-black py-[70px] px-6 sm:px-14 overflow-x-auto flex-nowrap scroll-smooth no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {projectList.map((proj, index) => {
            const isOdd = index % 2 === 0;
            const isPlaying = activeVideo === proj.id;

            return (
              <div
                key={`${proj.id}-${index}`}
                onClick={() => setActiveVideo(proj.id)}
                className="video-card flex-shrink-0 w-[88vw] sm:w-[680px] md:w-[clamp(650px,64vw,980px)] aspect-video rounded-[22px] border border-white/15 bg-[#111111] overflow-hidden cursor-pointer relative transition-all duration-400 group hover:border-[#6ecf97] hover:shadow-[0_0_50px_rgba(110,207,151,0.3)] hover:scale-[1.03] hover:z-20"
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
                    src={`https://www.youtube.com/embed/${proj.id}?autoplay=1&modestbranding=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-none"
                    title={`Project video ${proj.id}`}
                  />
                ) : (
                  <div
                    className="video-overlay w-full h-full flex relative bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${proj.thumb}')` }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60 pointer-events-none z-[1]" />

                    {/* Play Button: dark transparent with green border by default, fills solid green on card hover */}
                    <div className="play-btn absolute bottom-6 right-7 w-[48px] h-[48px] rounded-full border border-[#6ecf97]/60 bg-black/60 backdrop-blur-[6px] text-[#6ecf97] flex items-center justify-center text-sm transition-all duration-300 z-[2] group-hover:bg-[#6ecf97] group-hover:text-black group-hover:scale-110 group-hover:border-[#6ecf97] group-hover:shadow-[0_0_25px_rgba(110,207,151,0.7)]">
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
