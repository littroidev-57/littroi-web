import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import iconSaas from "../../assets/b0761bef-fcd0-4a41-aa6a-ea8d8560f385.png";
import iconPodcast from "../../assets/9dba0400-26dd-416a-9cad-7fb6b32e4972.png";
import iconLongForm from "../../assets/05bc27a7-a8f0-49e6-be43-6b6905f440cb.png";
import iconShortForm from "../../assets/351c61e1-1ba2-48ee-a763-380efac7882d.png";
import iconMotion from "../../assets/ad968ebe-56b5-44db-95e2-b85576807f72.png";
import iconStatic from "../../assets/e6ea29c0-73ce-4918-bd46-d34cf5b57ed0.png";
import iconBrand from "../../assets/180b64fe-108b-429d-a9ca-1993185ed871.png";
import iconThumb from "../../assets/5025f549-4411-4e72-b344-5de673b2c154.png";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: "01",
    icon: iconSaas,
    title: "SAAS Video",
    tag: "Software & Tech",
    desc: "We turn complex software and SaaS products into clear, engaging videos people instantly understand. From product demos to high-converting launch videos, we make your value obvious.",
    bg: "#0a1a0f",
    accent: "#B3FFC9",
  },
  {
    num: "02",
    icon: iconPodcast,
    title: "Podcast Editing",
    tag: "Audio & Video",
    desc: "Clean cuts, engaging visual pacing, and crystal-clear audio engineering. We edit your episodes and turn conversations into magnetic clips that expand your reach.",
    bg: "#0a0f1a",
    accent: "#A8EDFF",
  },
  {
    num: "03",
    icon: iconLongForm,
    title: "Long Form Content",
    tag: "YouTube & Streaming",
    desc: "High-retention storytelling crafted to keep viewers watching till the very end. Perfect for YouTube documentary-style videos, in-depth breakdowns, and educational authority.",
    bg: "#150a1a",
    accent: "#D4B3FF",
  },
  {
    num: "04",
    icon: iconShortForm,
    title: "Short Form Content",
    tag: "Reels & TikTok",
    desc: "Fast, punchy, scroll-stopping videos designed for Instagram, TikTok, and YouTube Shorts to maximise virality and audience acquisition.",
    bg: "#1a120a",
    accent: "#FFD6A5",
  },
  {
    num: "05",
    icon: iconMotion,
    title: "Motion Graphics",
    tag: "Animation & VFX",
    desc: "Fluid 2D & 3D kinetic animations that elevate your brand perception. Custom kinetic typography, visual explainers, and dynamic overlays.",
    bg: "#1a0a10",
    accent: "#FF9DE2",
  },
  {
    num: "06",
    icon: iconStatic,
    title: "Static Creatives & Carousels",
    tag: "Design & Graphics",
    desc: "High-impact visual designs that communicate value within seconds. Promotional graphics to informative slide decks that drive organic shares.",
    bg: "#0a1510",
    accent: "#B3FFC9",
  },
  {
    num: "07",
    icon: iconBrand,
    title: "Brand Identity Development",
    tag: "Identity & Strategy",
    desc: "We build cohesive visual systems, logo design, typography, and color guidelines that make your business instantly recognisable and memorable everywhere.",
    bg: "#080a18",
    accent: "#A8EDFF",
  },
  {
    num: "08",
    icon: iconThumb,
    title: "Thumbnail Creation",
    tag: "Click-through & CTR",
    desc: "High-CTR visual packaging with psychology-driven compositions, vivid contrast, and emotive framing that command attention and boost click-through rates.",
    bg: "#1a150a",
    accent: "#FFD6A5",
  },
];

export function ServicesSection() {
  const pinWrapRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!pinWrap || cards.length === 0) return;

    const N = cards.length;
    const STEPS = N - 1;

    // Reset initial card states
    cards.forEach((card, i) => {
      gsap.set(card, {
        yPercent: i === 0 ? 0 : 100,
        zIndex: 10 + i,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        force3D: true,
      });

      const line = card.querySelector(".svc-line");
      if (line) {
        gsap.set(line, {
          scaleX: i === 0 ? 1 : 0,
          transformOrigin: "left center",
        });
      }
    });

    // Master scrubbed timeline with native pinSpacing
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrap,
        start: "top top",
        end: () => "+=" + (STEPS * window.innerHeight),
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      if (i >= STEPS) return;

      const next = cards[i + 1];
      const at = i;

      // Outgoing card (underneath):
      // Blurs smoothly into the background, DOES NOT turn black or darken!
      // Remains bright, colorful, and fully visible with soft blur depth.
      masterTl.to(
        card,
        {
          filter: "blur(14px)",
          scale: 0.96,
          yPercent: -10,
          duration: 1,
          ease: "none",
        },
        at
      );

      // Incoming card (on top):
      // Smoothly slides up from 100% to 0% crisp, sharp, unblurred
      masterTl.fromTo(
        next,
        { yPercent: 100, filter: "blur(0px)" },
        { yPercent: 0, filter: "blur(0px)", duration: 1, ease: "none" },
        at
      );

      // Divider line animation
      const nextLine = next.querySelector(".svc-line");
      if (nextLine) {
        masterTl.fromTo(
          nextLine,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.45, ease: "power2.out" },
          at + 0.35
        );
      }
    });

    return () => {
      masterTl.scrollTrigger?.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      className="elementor-element elementor-element-abe7507 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-12 sm:py-16 select-none"
      data-id="abe7507"
      data-element_type="container"
      data-e-type="container"
      id="services"
    >
      {/* Spacer */}
      <div
        className="elementor-element elementor-element-fa8c9a3 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="fa8c9a3"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Our Services with fadeInLeft transition matching previous sections */}
      <div className="max-w-[1480px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8 sm:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-3fed575 animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
            data-id="3fed575"
            data-element_type="widget"
            data-widget_type="heading.default"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(30px, 3.8vw, 46px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Our <span style={{ color: "#B3FFC9" }}>Services</span>
            </h2>
          </motion.div>

          <div className="max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="m-0 lg:text-left"
                style={{
                  fontFamily: "'benzine', sans-serif",
                  fontSize: "clamp(12.5px, 1.05vw, 14px)",
                  fontWeight: 200,
                  lineHeight: 1.65,
                  color: "rgba(255, 255, 255, 0.58)",
                  letterSpacing: "0.015em",
                }}
              >
                Comprehensive end-to-end creative production and strategic branding.<br className="hidden md:inline" />
                Tailored solutions engineered to scale your audience and maximize market ROI.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Pin wrap: exactly 100dvh, cards stack inside ── */}
      <div
        ref={pinWrapRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {SERVICES.map((srv, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: srv.bg,
              overflow: "hidden",
              boxShadow: i > 0 ? "0 -25px 60px rgba(0,0,0,0.85)" : "none",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
              willChange: "transform, filter",
            }}
          >
            {/* Background noise overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                mixBlendMode: "overlay",
                opacity: 0.45,
              }}
            />

            {/* Accent top-right glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "60vw",
                height: "60vh",
                pointerEvents: "none",
                background: `radial-gradient(ellipse at top right, ${srv.accent}26 0%, transparent 65%)`,
              }}
            />

            {/* Accent bottom-left glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "45vw",
                height: "45vh",
                pointerEvents: "none",
                background: `radial-gradient(ellipse at bottom left, ${srv.accent}14 0%, transparent 65%)`,
              }}
            />

            {/* Card layout */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* TOP BAR */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "clamp(18px,2.8vh,32px) clamp(24px,4vw,64px)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span
                    className="svc-num"
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: srv.accent,
                    }}
                  >
                    {srv.num} / {String(SERVICES.length).padStart(2, "0")}
                  </span>
                  <span
                    className="svc-tag"
                    style={{
                      fontSize: 11,
                      padding: "4px 13px",
                      borderRadius: 999,
                      border: `1px solid ${srv.accent}33`,
                      background: `${srv.accent}0d`,
                      color: `${srv.accent}cc`,
                      fontFamily: "'Syne', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {srv.tag}
                  </span>
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                    background: `${srv.accent}13`,
                    border: `1px solid ${srv.accent}2a`,
                  }}
                >
                  <img
                    src={srv.icon}
                    alt={srv.title}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* MAIN CONTENT — vertically centred */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 clamp(24px,4vw,64px)",
                  minHeight: 0,
                }}
              >
                {/* Title */}
                <h3
                  className="svc-title"
                  style={{
                    margin: 0,
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    color: "#ffffff",
                    lineHeight: 1,
                    letterSpacing: "-0.025em",
                    fontSize: "clamp(36px, 6.5vw, 100px)",
                  }}
                >
                  {srv.title}
                </h3>

                {/* Accent line */}
                <div
                  className="svc-line"
                  style={{
                    height: 1,
                    margin: "clamp(20px,3.5vh,38px) 0",
                    background: `linear-gradient(to right, ${srv.accent}77, rgba(255,255,255,0.04))`,
                    transformOrigin: "left center",
                  }}
                />

                {/* Description */}
                <p
                  className="svc-desc"
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.7,
                    maxWidth: "54ch",
                    fontSize: "clamp(15px, 1.4vw, 19px)",
                  }}
                >
                  {srv.desc}
                </p>
              </div>

              {/* BOTTOM BAR */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "clamp(14px,2.2vh,24px) clamp(24px,4vw,64px)",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  [ WHAT WE DO ]
                </p>
                {i < SERVICES.length - 1 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                      }}
                    >
                      Scroll
                    </span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3v10M8 13l-4-4M8 13l4-4"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "monospace",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                      color: srv.accent,
                    }}
                  >
                    All services explored ↑
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
