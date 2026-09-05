import React from "react";
import { motion } from "framer-motion";
import heroBannerImg from "../../assets/littroi-hero-page.png";

export function HeroSection() {
  const scrollToVideo = () => {
    const el = document.getElementById("showreel");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── elementor-element-7938d47: Hero Full 100vh Viewport Container ── */}
      <section
        className="elementor-element elementor-element-7938d47 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded relative bg-[#000000] overflow-hidden flex items-center justify-center w-full select-none"
        data-id="7938d47"
        data-element_type="container"
        data-e-type="container"
        style={{ minHeight: "100vh", height: "100vh" }}
      >
        {/* ── elementor-element-7bf9d12 fronttextt: EXACT DEAD CENTER in 100vh Viewport ── */}
        <div
          className="elementor-element elementor-element-7bf9d12 fronttextt exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-image flex items-center justify-center overflow-hidden w-full px-2 sm:px-4 text-center select-none"
          data-id="7bf9d12"
          data-element_type="widget"
          data-widget_type="image.default"
        >
          {/* Gentle subtle floating animation with minimal fade */}
          <motion.img
            initial={{ opacity: 0.85, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            fetchPriority="high"
            decoding="async"
            width={2048}
            height={423}
            src={heroBannerImg}
            srcSet={`${heroBannerImg} 2048w`}
            sizes="(max-width: 2048px) 100vw, 2048px"
            alt="Littroi"
            className="attachment-full size-full wp-image-4133 w-full max-w-full h-auto object-contain block mx-auto opacity-100 visible"
            style={{
              maxHeight: "56vh",
              userSelect: "none",
              pointerEvents: "none",
              animation: "floatUpDown 4.6s ease-in-out infinite",
            }}
          />
        </div>

        {/* ── elementor-element-5e2e98b: Hero Bottom Text Row — Positioned beneath LITTROI logo ── */}
        <div
          className="elementor-element elementor-element-5e2e98b e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-child absolute bottom-12 sm:bottom-26 md:bottom-30 lg:bottom-[calc(var(--spacing)*50)] left-1/2 -translate-x-1/2 w-[94%] max-w-[1400px] flex items-end justify-between px-4 sm:px-8 pointer-events-auto z-20"
          data-id="5e2e98b"
          data-element_type="container"
          data-e-type="container"
        >
          {/* Left Title: Think. Create. Dominate. */}
          <div
            className="elementor-element elementor-element-55907e1 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
            data-id="55907e1"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0"
              style={{
                fontFamily: "'Syne', 'benzine', sans-serif",
                fontSize: "clamp(15px, 1.4vw, 20px)",
                fontWeight: 600,
                color: "#B3FFC9",
                letterSpacing: "0.01em",
                lineHeight: 1.3,
              }}
            >
              Think. Create. Dominate.
            </h2>
          </div>

          {/* Right Subtitle: We've killed average for a living since day one */}
          <div
            className="elementor-element elementor-element-76094d2 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading text-left"
            data-id="76094d2"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0"
              style={{
                fontFamily: "'Syne', 'benzine', sans-serif",
                fontSize: "clamp(14px, 1.4vw, 20px)",
                fontWeight: 600,
                color: "#B3FFC9",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
              }}
            >
              We've killed average for<br />
              a living since day one
            </h2>
          </div>
        </div>
      </section>

      {/* ── elementor-element-40b85c9: The Next Wave of Content Creation ── */}
      <section
        className="elementor-element elementor-element-40b85c9 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-[#000000] min-h-[85vh] lg:min-h-screen flex flex-col items-center justify-center text-center px-4 w-full relative overflow-hidden"
        data-id="40b85c9"
        data-element_type="container"
        data-e-type="container"
        style={{ padding: "clamp(80px, 10vw, 160px) 16px" }}
      >
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">

          {/* Line 1: The Next Wave of — smooth slow bottom-to-top transition */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-d6ff41b animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading w-full text-center"
            data-id="d6ff41b"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-center whitespace-nowrap"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(30px, 5.2vw, 75px)",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              The <span style={{ color: "#B3FFC9" }}>Next Wave</span> of
            </h2>
          </motion.div>

          {/* Line 2: Content Creation — smooth slow bottom-to-top transition */}
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-df25cbb animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading w-full text-center mt-1 sm:mt-2"
            data-id="df25cbb"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-center whitespace-nowrap"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(30px, 5.2vw, 75px)",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              Content Creation
            </h2>
          </motion.div>

          {/* Line 3 (Sub Tagline): Smart strategy backed by precise execution. */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-174882f animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-text-editor w-full text-center"
            data-id="174882f"
            data-element_type="widget"
            data-widget_type="text-editor.default"
            style={{ marginTop: "clamp(16px, 2.5vw, 30px)" }}
          >
            <p
              className="m-0 text-center mx-auto max-w-2xl whitespace-nowrap"
              style={{
                fontFamily: "'benzine', 'Syne', sans-serif",
                fontSize: "clamp(13px, 1.6vw, 24px)",
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "0.01em",
                lineHeight: 1.4,
              }}
            >
              Smart strategy backed by precise execution.
            </p>
          </motion.div>

        </div>
      </section>
    </>
  );
}
