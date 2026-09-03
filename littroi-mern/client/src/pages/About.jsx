import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SEO } from "../utils/seo";

// Animated counter component for Proven Results
function AnimatedCounter({ toValue, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp = null;
    const target = parseInt(toValue, 10);

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [inView, toValue, duration]);

  return (
    <span ref={ref} className="elementor-counter-number">
      {count}
      <span className="elementor-counter-number-suffix" style={{ color: "#B3FFC9" }}>
        {suffix}
      </span>
    </span>
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
      image: "https://littroi.com/wp-content/uploads/2026/06/Harpreet-Singh-COO-scaled.png",
    },
    {
      name: "Nishant Nair",
      role: "Media & Sales Manager",
      image: "https://littroi.com/wp-content/uploads/2026/06/Nishant-Nair-Media-Sales-Manager-scaled.png",
    },
    {
      name: "Snehdeep Kaur",
      role: "Sales Executive",
      image: "https://littroi.com/wp-content/uploads/2026/06/Snehdeep-Kaur-Sales-Executive-scaled.png",
    },
    {
      name: "Mansi",
      role: "Creative Designer",
      image: "https://littroi.com/wp-content/uploads/2026/06/Mansi-Saxena-Creative-Designer-scaled.png",
    },
    {
      name: "Ankit Kumar",
      role: "Video Editor",
      image: "https://littroi.com/wp-content/uploads/2026/06/Ankit-Kumar-Video-Editor-scaled.png",
    },
    {
      name: "Akshar Pahari",
      role: "Video Editor",
      image: "https://littroi.com/wp-content/uploads/2026/06/Akshar-Pahari-Video-Editor-scaled.png",
    },
    {
      name: "Arun Rawat",
      role: "Video Editor",
      image: "https://littroi.com/wp-content/uploads/2026/06/Arun-Rawat-Video-Editor-scaled.png",
    },
    {
      name: "Nirdesh Kumar",
      role: "Video Editor",
      image: "https://littroi.com/wp-content/uploads/2026/06/Nirdesh-Kumar-Video-Editor-scaled.png",
    },
    {
      name: "Vasu Kumar",
      role: "Video Editor",
      image: "https://littroi.com/wp-content/uploads/2026/06/Vasu-Verma-Video-Editor-scaled.png",
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
        <section className="pt-32 sm:pt-44 pb-14 sm:pb-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-14">
            {/* Left: Huge "About Us" with smooth bottom-to-top transition */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <h1
                className="elementor-heading-title elementor-size-default m-0 text-white tracking-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(48px, 6.8vw, 88px)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                About <span style={{ color: "#B3FFC9" }}>Us</span>
              </h1>
            </motion.div>

            {/* Right: Subtitle paragraph with smooth bottom-to-top transition */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[560px]"
            >
              <p
                className="text-white/70 text-sm sm:text-base leading-relaxed m-0"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                A media and brand studio built for the era of attention scarcity — where every word, frame, and idea earns its place.A media and brand studio built for the era of attention scarcity — where every word, frame, and idea earns its place.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Team Picture Banner (elementor-element-6b06f57) */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 mb-24 sm:mb-32">
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
              src="https://littroi.com/wp-content/uploads/2026/06/Team-Picture-scaled.png"
              alt="Littroi Team"
              className="w-full h-auto object-cover block"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </motion.div>
        </section>

        {/* 3. Our Belief Section (elementor-element-d74a0bf & e4f0fdc) */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 mb-28 sm:mb-36">
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

              {/* Big Belief statement */}
              <motion.div
                {...smoothFadeInUp}
                transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="elementor-heading-title elementor-size-default m-0 text-white font-bold leading-[1.22]"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(26px, 3.8vw, 54px)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Most brands look the same because most studios play it safe. We don't. We believe the best brand work is specific, honest, and a little uncomfortable — the kind that makes people stop and actually look.
                </h2>
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
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 mb-28 sm:mb-36">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1.1, delay: stat.delay, ease: [0.16, 1, 0.3, 1] }}
                className="elementor-counter p-6 sm:p-8 rounded-2xl bg-[#0c0c0c] border border-white/10 flex flex-col justify-between"
              >
                <div
                  className="elementor-counter-title text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.label}
                </div>
                <div
                  className="elementor-counter-number-wrapper text-white font-extrabold tracking-tight"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(36px, 4.5vw, 64px)",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter toValue={stat.value} suffix={stat.suffix} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Our Founder Section (elementor-element-56ff36b) */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 mb-28 sm:mb-36">
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
                src="https://littroi.com/wp-content/uploads/2026/06/Vishal-Singh-Mahar-Founder-scaled.png"
                alt="Vishal Singh Mahar"
                className="w-full h-auto object-cover block"
                onError={(e) => {
                  e.target.src = "https://littroi.com/wp-content/uploads/2026/06/Vishal-Singh-Mahar-Founder-685x1024.png";
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

              {/* Social Icons */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://www.instagram.com/littroi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[7px] bg-[#B3FFC9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/Littroius/61572722251178/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[7px] bg-[#B3FFC9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@Littroi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[7px] bg-[#B3FFC9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300"
                  aria-label="Youtube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/littroi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[7px] bg-[#B3FFC9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300"
                  aria-label="Linkedin"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. Team Grid Section (elementor-element-c92ad94) */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 mb-28 sm:mb-36">
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
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pb-24 sm:pb-32 text-center">
          <motion.div
            {...smoothFadeInUp}
            className="p-10 sm:p-20 rounded-3xl bg-[#080808] border border-white/10 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B3FFC9]/5 rounded-full blur-3xl pointer-events-none" />

            <h2
              className="elementor-heading-title elementor-size-default m-0 text-white font-extrabold leading-tight relative z-10"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(32px, 4.5vw, 68px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Let's build <br />
              <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                something worth
                <br />
                talking about.
              </span>
            </h2>

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
