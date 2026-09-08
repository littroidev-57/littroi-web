import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { SEO } from "../utils/seo";

// Animated counter card component for Proven Results with reload and scroll animation
function StatCounterCard({ label, value, suffix, delay = 0 }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let frameId;
    let startTimestamp = null;
    let timeoutId = null;
    const duration = 1800;
    const target = parseInt(value, 10);

    const runCountAnimation = () => {
      setCount(0);
      startTimestamp = null;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) clearTimeout(timeoutId);

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Smooth ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        setCount(current);
        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        } else {
          setCount(target); // Stop cleanly when target reached
        }
      };

      timeoutId = setTimeout(() => {
        frameId = window.requestAnimationFrame(step);
      }, delay * 1000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountAnimation();
          } else {
            // Reset to 0 when out of view so re-entry replays
            setCount(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [value, delay]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="elementor-counter p-4 sm:p-5 md:p-6 lg:p-7 rounded-2xl bg-[#0c0c0c] border border-white/10 flex flex-col justify-between overflow-hidden min-w-0"
    >
      <div
        className="elementor-counter-title text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4 truncate"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {label}
      </div>
      <div
        className="elementor-counter-number-wrapper text-white font-extrabold tracking-tight min-w-0"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(26px, 3.2vw, 48px)",
          fontWeight: 800,
          lineHeight: 1.05,
        }}
      >
        <span className="elementor-counter-number inline-flex items-baseline flex-nowrap min-w-0">
          <span>{count}</span>
          <span className="elementor-counter-number-suffix ml-0.5 flex-shrink-0" style={{ color: "#B3FFC9" }}>
            {suffix}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

// Interactive Cursor Arrow Spotlight Blur Reveal component for Our Belief statement
function BlurHoverBeliefText() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
  const containerRef = useRef(null);

  const statement =
    "Most brands look the same because most studios play it safe. We don't. We believe the best brand work is specific, honest, and a little uncomfortable — the kind that makes people stop and actually look.";

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    });
  };

  // Radius in pixels around the mouse arrow where text is sharp and unblurred
  const spotlightRadius = 180;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -9999, y: -9999 });
      }}
      className="relative cursor-default select-none py-2"
    >


      {/* Text Container with Dual Layer Mask Effect */}
      <div className="relative">
        {/* BASE LAYER: Always frosted & blurred across entire statement */}
        <h2
          className="elementor-heading-title elementor-size-default m-0 font-bold leading-[1.22] text-white"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(26px, 3.8vw, 54px)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            filter: "blur(9px)",
            opacity: 0.25,
            transition: "opacity 0.4s ease",
            userSelect: "none",
          }}
          aria-hidden={isHovered ? "true" : "false"}
        >
          {statement}
        </h2>

        {/* SHARP LAYER: Revealed ONLY in circular radius directly around cursor arrow */}
        <h2
          className="elementor-heading-title elementor-size-default m-0 font-bold leading-[1.22] text-white absolute inset-0 pointer-events-none"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(26px, 3.8vw, 54px)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            filter: "none",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            WebkitMaskImage: isHovered
              ? `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`
              : "none",
            maskImage: isHovered
              ? `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`
              : "none",
            userSelect: "none",
          }}
        >
          {statement}
        </h2>

        {/* Subtle mint aura halo following the mouse arrow */}
        {isHovered && mousePos.x > -100 && (
          <div
            className="pointer-events-none absolute w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              background: "radial-gradient(circle, rgba(179,255,201,0.14) 0%, rgba(179,255,201,0.03) 50%, transparent 70%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

// Interactive CTA Heading where lines 2 & 3 highlight on hover
function CtaBuildHeading() {
  const [hoveredLine, setHoveredLine] = useState(null);
  const [isBlockHovered, setIsBlockHovered] = useState(false);

  return (
    <h2
      className="elementor-heading-title elementor-size-default m-0 text-white font-extrabold leading-tight relative z-10 select-none"
      style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(32px, 4.5vw, 68px)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
      }}
    >
      <span className="block text-white">Let's build</span>
      <span
        className="block cursor-pointer"
        onMouseEnter={() => setIsBlockHovered(true)}
        onMouseLeave={() => {
          setIsBlockHovered(false);
          setHoveredLine(null);
        }}
      >
        <span
          onMouseEnter={() => setHoveredLine(2)}
          onMouseLeave={() => setHoveredLine(null)}
          className="block transition-all duration-300 ease-out"
          style={{
            color:
              hoveredLine === 2
                ? "#B3FFC9"
                : isBlockHovered
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.4)",
            textShadow:
              hoveredLine === 2
                ? "0 0 35px rgba(179, 255, 201, 0.65), 0 0 10px rgba(179, 255, 201, 0.3)"
                : isBlockHovered
                ? "0 0 20px rgba(255, 255, 255, 0.35)"
                : "none",
            transform:
              hoveredLine === 2 ? "scale(1.02) translateY(-2px)" : "none",
          }}
        >
          something worth
        </span>
        <span
          onMouseEnter={() => setHoveredLine(3)}
          onMouseLeave={() => setHoveredLine(null)}
          className="block transition-all duration-300 ease-out"
          style={{
            color:
              hoveredLine === 3
                ? "#B3FFC9"
                : isBlockHovered
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.4)",
            textShadow:
              hoveredLine === 3
                ? "0 0 35px rgba(179, 255, 201, 0.65), 0 0 10px rgba(179, 255, 201, 0.3)"
                : isBlockHovered
                ? "0 0 20px rgba(255, 255, 255, 0.35)"
                : "none",
            transform:
              hoveredLine === 3 ? "scale(1.02) translateY(-2px)" : "none",
          }}
        >
          talking about.
        </span>
      </span>
    </h2>
  );
}

export function About() {
  const stats = [
    { label: "Views", value: 116, suffix: "M+", delay: 0.05 },
    { label: "Years", value: 5, suffix: "+", delay: 0.1 },
    { label: "Channel Helped", value: 70, suffix: "+", delay: 0.15 },
    { label: "Videos", value: 11, suffix: "K+", delay: 0.2 },
  ];

  const team = [
    {
      name: "Harpreet Singh",
      role: "COO",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583462/Harpreet-Singh-COO-scaled_1.png",
    },
    {
      name: "Nishant Nair",
      role: "Media & Sales Manager",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583675/Nishant-Nair-Media-Sales-Manager-scaled.png",
    },
    {
      name: "Snehdeep Kaur",
      role: "Sales Executive",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583724/Snehdeep-Kaur-Sales-Executive-scaled.png",
    },
    {
      name: "Mansi",
      role: "Creative Designer",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583570/Mansi-Saxena-Creative-Designer-scaled.png",
    },
    {
      name: "Ankit Kumar",
      role: "Video Editor",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583261/Ankit-Kumar-Video-Editor-scaled.png",
    },
    {
      name: "Akshar Pahari",
      role: "Video Editor",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583196/Akshar-Pahari-Video-Editor-scaled.png",
    },
    {
      name: "Arun Rawat",
      role: "Video Editor",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583342/Arun-Rawat-Video-Editor-scaled_1.png",
    },
    {
      name: "Nirdesh Kumar",
      role: "Video Editor",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583624/Nirdesh-Kumar-Video-Editor-scaled.png",
    },
    {
      name: "Vasu Kumar",
      role: "Video Editor",
      image: "https://res.cloudinary.com/eikgki2a/image/upload/v1788583781/Vasu-Verma-Video-Editor-scaled.png",
    },
  ];

  const smoothFadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <>
      <SEO
        title="About us"
        description="A media and brand studio built for the era of attention scarcity — where every word, frame, and idea earns its place."
        canonical="/about-us"
      />

      <div className="bg-black text-white min-h-screen select-none overflow-hidden">
        {/* 1. Page Header (elementor-element-ed9e992) */}
        <section className="pt-32 sm:pt-44 pb-12 sm:pb-16 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
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
              — ABOUT US
            </span>
          </motion.div>

          <div className="elementor-element elementor-element-ed9e992 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-14">
            {/* Left: About Us Heading (elementor-element-cbfa4ce) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="elementor-element elementor-element-cbfa4ce shrink-0"
            >
              <h2
                className="elementor-heading-title elementor-size-default m-0 text-white tracking-tight"
                style={{
                  fontFamily: "'benzine', 'Benzin', sans-serif",
                  fontSize: "clamp(34px, 4.4vw, 56px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                About <span style={{ color: "#B3FFC9" }}>Us</span>
              </h2>
            </motion.div>

            {/* Right: Subtitle paragraph (elementor-element-cb57ad8) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="elementor-element elementor-element-cb57ad8 w-full max-w-[680px]"
            >
              <div className="page-header">
                <p
                  className="sec-sub fade in m-0"
                  style={{
                    fontFamily: "'benzine', 'Benzin', sans-serif",
                    fontSize: "13px",
                    fontWeight: 200,
                    lineHeight: "22px",
                    color: "#FFFFFF94",
                  }}
                >
                  A media and brand studio built for the era of attention scarcity — where every word,<br className="hidden md:block" />
                  frame, and idea earns its place.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Team Picture Banner (elementor-element-6b06f57) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-28 sm:mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0d]"
          >
            <img
              fetchPriority="high"
              decoding="async"
              width={2560}
              height={1588}
              src="https://res.cloudinary.com/eikgki2a/image/upload/v1788583870/Team-Picture-scaled.png"
              alt="Littroi Team"
              className="w-full h-auto object-cover block"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </motion.div>
        </section>

        {/* 3. Our Belief Section (elementor-element-d74a0bf & e4f0fdc) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-28 sm:mb-40">
          <div className="flex flex-col space-y-16 sm:space-y-20">
            {/* Top Belief Statement */}
            <div className="space-y-6 max-w-[1340px]">
              {/* Category label: Our belief */}
              <motion.div {...smoothFadeInUp}>
                <h2
                  className="elementor-heading-title elementor-size-default m-0 text-white/60 text-sm sm:text-base font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Our belief
                </h2>
              </motion.div>

              {/* Big Belief statement with interactive hover reveal */}
              <motion.div
                {...smoothFadeInUp}
                transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <BlurHoverBeliefText />
              </motion.div>
            </div>

            {/* 3 Philosophy Icon Box Columns (elementor-element-9bfe9c0) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 pt-8 border-t border-white/10">
              {/* Card 1: Strategy first (13a7746) */}
              <motion.div
                {...smoothFadeInUp}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start space-y-4 group"
              >
                <div className="w-10 h-[3px] bg-[#B3FFC9] rounded-full mb-1 group-hover:w-14 transition-all duration-300" />
                <h3
                  className="elementor-icon-box-title m-0 text-2xl font-bold text-white group-hover:text-[#B3FFC9] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  Strategy first
                </h3>
                <p
                  className="elementor-icon-box-description m-0 text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400 }}
                >
                  We don't open Illustrator before we understand your business. Every visual decision is backed by a reason.
                </p>
              </motion.div>

              {/* Card 2: Craft over speed (346a9c8) */}
              <motion.div
                {...smoothFadeInUp}
                transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start space-y-4 group"
              >
                <div className="w-10 h-[3px] bg-[#B3FFC9] rounded-full mb-1 group-hover:w-14 transition-all duration-300" />
                <h3
                  className="elementor-icon-box-title m-0 text-2xl font-bold text-white group-hover:text-[#B3FFC9] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  Craft over speed
                </h3>
                <p
                  className="elementor-icon-box-description m-0 text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400 }}
                >
                  Fast and forgettable isn't a win. We'd rather take the time to make something that holds up.
                </p>
              </motion.div>

              {/* Card 3: Honest partnership (33f74e2) */}
              <motion.div
                {...smoothFadeInUp}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start space-y-4 group"
              >
                <div className="w-10 h-[3px] bg-[#B3FFC9] rounded-full mb-1 group-hover:w-14 transition-all duration-300" />
                <h3
                  className="elementor-icon-box-title m-0 text-2xl font-bold text-white group-hover:text-[#B3FFC9] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  Honest partnership
                </h3>
                <p
                  className="elementor-icon-box-description m-0 text-white/60 text-sm sm:text-base leading-relaxed max-w-sm"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400 }}
                >
                  We tell you when an idea isn't working. You're paying for perspective, not just execution.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Our Proven Result Section (elementor-element-7363700 & 242664f) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-28 sm:mb-40">
          <motion.div {...smoothFadeInUp} className="mb-12">
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-white font-extrabold"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(34px, 4.2vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              Our Proven <span style={{ color: "#B3FFC9" }}>Result</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat) => (
              <StatCounterCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                delay={stat.delay}
              />
            ))}
          </div>
        </section>

        {/* 5. Our Founder Section (elementor-element-56ff36b) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-28 sm:mb-40">
          <motion.div {...smoothFadeInUp} className="mb-12">
            <h2
              className="elementor-heading-title elementor-size-default m-0 font-extrabold"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(34px, 4.2vw, 60px)",
                fontWeight: 800,
                color: "#B3FFC9",
                letterSpacing: "-0.01em",
              }}
            >
              Our Founder
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Founder Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]"
            >
              <img
                src="https://res.cloudinary.com/eikgki2a/image/upload/v1788583992/Vishal-Singh-Mahar-Founder-scaled.png"
                alt="Vishal Singh Mahar"
                className="w-full h-auto object-cover block"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/eikgki2a/image/upload/v1788584201/Vishal-Singh-Mahar-Founder-685x1024_1.png";
                }}
              />
            </motion.div>

            {/* Founder Story & Socials */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start space-y-6"
            >
              <h3
                className="m-0 text-white/90 font-normal leading-relaxed text-base sm:text-xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                I got addicted to great content. The problem was, I couldn't find enough of it. Everywhere I looked, businesses with incredible products were posting content nobody cared about. Bad hooks. No story. Zero personality. After watching the same mistakes over and over again, I stopped complaining and started LITTROI. Now we're on a mission to make content so good people choose to watch it instead of scrolling past it.
              </h3>

              <div className="pt-2">
                <h4
                  className="m-0 text-2xl sm:text-3xl font-extrabold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Vishal Singh Mahar
                </h4>
                <p className="m-0 text-sm sm:text-base font-semibold text-[#B3FFC9] mt-1">
                  Founder &amp; CEO
                </p>
              </div>

              {/* Social Icons with Official OG Brand Logos & Colors */}
              <div className="flex items-center gap-2.5 pt-2">
                {/* Instagram — Official Gradient */}
                <a
                  href="https://www.instagram.com/littroi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[8px] text-white flex items-center justify-center hover:scale-110 hover:shadow-[0_0_18px_rgba(225,48,108,0.6)] transition-all duration-300 shadow-md"
                  style={{
                    background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </a>

                {/* Facebook — Official Blue */}
                <a
                  href="https://www.facebook.com/people/Littroius/61572722251178/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[8px] bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166fe5] hover:scale-110 hover:shadow-[0_0_18px_rgba(24,119,242,0.6)] transition-all duration-300 shadow-md"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 512 512">
                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                  </svg>
                </a>

                {/* YouTube — Official Red */}
                <a
                  href="https://www.youtube.com/@Littroi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[8px] bg-[#FF0000] text-white flex items-center justify-center hover:bg-[#e60000] hover:scale-110 hover:shadow-[0_0_18px_rgba(255,0,0,0.6)] transition-all duration-300 shadow-md"
                  aria-label="Youtube"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 576 512">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                  </svg>
                </a>

                {/* LinkedIn — Official Blue */}
                <a
                  href="https://www.linkedin.com/company/littroi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[8px] bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#095196] hover:scale-110 hover:shadow-[0_0_18px_rgba(10,102,194,0.6)] transition-all duration-300 shadow-md"
                  aria-label="Linkedin"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 448 512">
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Team Grid Section (elementor-element-c92ad94) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 mb-28 sm:mb-40">
          <motion.div {...smoothFadeInUp} className="mb-12">
            <h2
              className="elementor-heading-title elementor-size-default m-0 font-extrabold"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(34px, 4.2vw, 60px)",
                fontWeight: 800,
                color: "#B3FFC9",
                letterSpacing: "-0.01em",
              }}
            >
              Team
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.1, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-start space-y-3"
              >
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-lg relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <h3
                  className="m-0 text-xl font-bold text-white pt-1 group-hover:text-[#B3FFC9] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  {member.name}
                </h3>
                <p className="m-0 text-xs sm:text-sm font-semibold text-white/50 uppercase tracking-wider">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Bottom CTA Section (elementor-element-743a65f) */}
        <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pb-28 sm:pb-40 text-center">
          <motion.div
            {...smoothFadeInUp}
            className="p-10 sm:p-20 rounded-3xl bg-[#080808] border border-white/10 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B3FFC9]/5 rounded-full blur-3xl pointer-events-none" />

            <CtaBuildHeading />

            <a
              href="https://calendly.com/littroi-info/strategy-call"
              target="_blank"
              rel="noopener noreferrer"
              className="elementor-button elementor-button-link relative z-10 px-8 py-4 rounded-full bg-[#B3FFC9] text-black font-bold text-base uppercase tracking-wider hover:bg-[#9effba] hover:scale-105 hover:shadow-[0_0_30px_rgba(179,255,201,0.4)] transition-all duration-300"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="elementor-button-content-wrapper">
                <span className="elementor-button-text">Start The Conversation</span>
              </span>
            </a>
          </motion.div>
        </section>
      </div>
    </>
  );
}
