import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { testimonialsAPI } from "../../services/api";

import avatarMarc from "../../assets/Group 1100.png";
import avatarSpencer from "../../assets/Group 1082.png";
import avatarHarrison from "../../assets/Group 1079.png";

/**
 * Interactive Cursor Spotlight Card
 */
function HomeSpotlightCard({ children, className = "" }) {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 transition-colors duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(179, 255, 201, 0.12), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.75 : 0,
          border: "1px solid rgba(179, 255, 201, 0.35)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Failed to load dynamic testimonials on home:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Home page shows ONLY video testimonials (no text testimonials) limited to 3
  const videoOnlyTestimonials = testimonials.filter((t) => {
    const vidId =
      t.videoId ||
      (t.videoUrl
        ? t.videoUrl.match(
          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
        )?.[1]
        : "");
    return Boolean(vidId || (t.type === "video" && t.videoUrl));
  });

  const displayTestimonials = videoOnlyTestimonials.slice(0, 3);

  return (
    <section
      className="elementor-element elementor-element-d095e46 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-20 sm:py-32 overflow-hidden select-none"
      data-id="d095e46"
      data-element_type="container"
      data-e-type="container"
      id="testimonials"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#B3FFC9]/[0.025] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* Header: Hear it directly from Our Clients */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24 space-y-5">
          {/* Eyebrow Tag */}


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-white sm:whitespace-nowrap"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(20px, 2.5vw, 38px)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Hear it directly from{" "}
              <span style={{ color: "#B3FFC9" }}>Our Clients</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="elementor-heading-title elementor-size-default text-gray-300 max-w-4xl mx-auto text-center"
              style={{
                fontFamily: "'benzine', 'Syne', sans-serif",
                fontSize: "clamp(13px, 1.05vw, 15.5px)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.72)",
              }}
            >
              <span className="block sm:whitespace-nowrap">
                Real feedback from brands and creators we've worked with. From content to design,
              </span>
              <span className="block sm:whitespace-nowrap ">
                our work is built to help people stand out, grow faster and create impact online.
              </span>
            </p>
          </motion.div>

          {/* Top See More CTA with magnetic transition */}

        </div>

        {/* Dynamic Testimonials List */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#B3FFC9] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Loading client stories...
            </span>
          </div>
        ) : displayTestimonials.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-mono text-white/50">No video testimonials published yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-16 sm:space-y-24">
              <AnimatePresence>
                {displayTestimonials.map((item, idx) => {
                  const authorName = item.name || item.clientName || "Client";
                  const authorRole = item.role || item.clientRole || "";
                  const quoteText = item.quote || item.testimonial || "";
                  const avatarSrc = item.avatar || item.clientImage || avatarMarc;
                  const vidId =
                    item.videoId ||
                    (item.videoUrl
                      ? item.videoUrl.match(
                        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
                      )?.[1]
                      : "");
                  const isVideoFirst =
                    item.videoFirst !== undefined ? item.videoFirst : idx % 2 === 0;

                  return (
                    /* Video Testimonial Row with Left & Right Viewport Fade-In */
                    <div
                      key={item._id || item.id || idx}
                      className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 ${isVideoFirst ? "" : "lg:flex-row-reverse"
                        }`}
                    >
                      {/* Left Column (Video) - Viewport Fade In from Left/Right */}
                      <motion.div
                        initial={{ opacity: 0, x: isVideoFirst ? -45 : 45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.85, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="w-full lg:w-1/2 aspect-video rounded-3xl overflow-hidden border border-white/10 hover:border-[#B3FFC9]/50 bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(179,255,201,0.15)] transition-colors duration-500 group relative transform-gpu"
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${vidId}?controls=1&rel=0&playsinline=0`}
                          title={`${authorName} Testimonial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-none block"
                        />
                      </motion.div>

                      {/* Right Column (Testimonial Quote) - Viewport Fade In from Right/Left */}
                      <motion.div
                        initial={{ opacity: 0, x: isVideoFirst ? 45 : -45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.85, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="w-full lg:w-1/2 transform-gpu"
                      >
                        <HomeSpotlightCard className="p-6 sm:p-8 md:p-11 flex flex-col justify-between space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="flex text-[#B3FFC9]">
                                {[...Array(item.rating || 5)].map((_, sIdx) => (
                                  <Star
                                    key={sIdx}
                                    size={15}
                                    className="text-[#B3FFC9] fill-[#B3FFC9]"
                                  />
                                ))}
                              </div>
                              {item.metric && (
                                <span className="text-[11px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 px-2.5 py-0.5 rounded-full font-bold ml-2">
                                  {item.metric}
                                </span>
                              )}
                            </div>
                            <Quote
                              size={28}
                              className="text-white/10 hover:text-[#B3FFC9]/30 transition-colors duration-300"
                            />
                          </div>

                          <p
                            className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line m-0"
                            style={{
                              fontFamily: "'benzine', sans-serif",
                              fontSize: "clamp(14px, 1.1vw, 16px)",
                              fontWeight: 300,
                              lineHeight: 1.75,
                              color: "rgba(255, 255, 255, 0.88)",
                            }}
                          >
                            "{quoteText}"
                          </p>

                          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                            <img
                              src={avatarSrc}
                              alt={authorName}
                              className="w-14 h-14 rounded-full object-cover border border-white/15 bg-white/5 p-0.5 shadow-md shrink-0"
                              onError={(e) => {
                                e.target.src = avatarMarc;
                              }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4
                                  className="text-base sm:text-lg font-bold text-white tracking-wide truncate m-0"
                                  style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                  {authorName}
                                </h4>
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 px-2 py-0.5 rounded-full shrink-0">
                                  <CheckCircle2 size={11} /> Verified
                                </span>
                              </div>
                              <p
                                className="text-xs text-gray-400 font-mono tracking-wide mt-1 truncate m-0"
                                style={{ fontFamily: "'benzine', 'Syne', sans-serif" }}
                              >
                                {authorRole}
                              </p>
                            </div>
                          </div>
                        </HomeSpotlightCard>
                      </motion.div>
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* =========================================================================
                BOTTOM REDIRECT CALL TO ACTION: SEE MORE TESTIMONIALS
               ========================================================================= */}
            <div className="mt-16 sm:mt-24 pt-10 border-t border-white/10 flex items-center justify-center">
              <Link
                to="/testimonials"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-[#B3FFC9] hover:text-black hover:border-[#B3FFC9] text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_30px_rgba(179,255,201,0.35)] hover:scale-105"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <span>See More Testimonials</span>
                <ArrowRight
                  size={15}
                  className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-white group-hover:text-black"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
