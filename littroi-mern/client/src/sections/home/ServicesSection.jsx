import React, { useEffect, useRef } from "react";
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
    desc: "We turn complex software and SaaS products into clear, engaging videos people instantly understand. From product demos to high-converting launch films, we make your value obvious.",
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
    desc: "Fast, punchy, scroll-stopping videos designed for Reels, TikTok, and YouTube Shorts to maximise virality and audience acquisition.",
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
    title: "Thumbnails Creation",
    tag: "Click-through & CTR",
    desc: "High-CTR visual packaging with psychology-driven compositions, vivid contrast, and emotive framing that command attention and boost click-through rates.",
    bg: "#1a150a",
    accent: "#FFD6A5",
  },
];

function ServiceCard({ srv, index }) {
  const cardRef  = useRef(null);
  const numRef   = useRef(null);
  const titleRef = useRef(null);
  const descRef  = useRef(null);
  const tagRef   = useRef(null);
  const lineRef  = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      // Animate inner content when card enters the sticky position
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        [numRef.current, tagRef.current],
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        );
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="sticky top-0 w-full"
      style={{ height: "100dvh", zIndex: 10 + index }}
    >
      {/* Full bleed background */}
      <div
        className="relative w-full h-full flex flex-col justify-between overflow-hidden"
        style={{ backgroundColor: srv.bg }}
      >
        {/* Top noise/grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
            opacity: 0.4,
          }}
        />

        {/* Accent radial glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-[50vw] h-[50vh]"
          style={{
            background: `radial-gradient(ellipse at top right, ${srv.accent}18 0%, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-[30vw] h-[30vh]"
          style={{
            background: `radial-gradient(ellipse at bottom left, ${srv.accent}0a 0%, transparent 70%)`,
          }}
        />

        {/* ─── TOP BAR ─── */}
        <div
          className="flex items-center justify-between px-6 sm:px-10 lg:px-14 pt-7 pb-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <span
              ref={numRef}
              className="font-mono text-xs tracking-[0.2em] uppercase"
              style={{ color: srv.accent }}
            >
              {srv.num} / {String(SERVICES.length).padStart(2, "0")}
            </span>
            <span
              ref={tagRef}
              className="hidden sm:inline-block text-xs px-3 py-1 rounded-full border"
              style={{
                color: `${srv.accent}cc`,
                borderColor: `${srv.accent}33`,
                background: `${srv.accent}0d`,
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {srv.tag}
            </span>
          </div>

          {/* Service icon – top right */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center p-2"
            style={{
              background: `${srv.accent}12`,
              border: `1px solid ${srv.accent}28`,
            }}
          >
            <img src={srv.icon} alt={srv.title} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-6 sm:py-10">
          {/* Large title */}
          <div style={{ overflow: "hidden" }}>
            <h3
              ref={titleRef}
              className="m-0 font-extrabold text-white leading-tight sm:leading-none tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 6.5vw, 110px)",
              }}
            >
              {srv.title}
            </h3>
          </div>

          {/* Divider */}
          <div
            ref={lineRef}
            className="my-8 h-px"
            style={{
              background: `linear-gradient(to right, ${srv.accent}66, rgba(255,255,255,0.06))`,
            }}
          />

          {/* Description — constrained width */}
          <p
            ref={descRef}
            className="m-0 leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(15px, 1.5vw, 20px)",
              maxWidth: "55ch",
            }}
          >
            {srv.desc}
          </p>
        </div>

        {/* ─── BOTTOM BAR ─── */}
        <div
          className="flex items-center justify-between px-6 sm:px-10 lg:px-14 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="m-0 text-xs uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Syne', sans-serif" }}
          >
            [ WHAT WE DO ]
          </p>
          {/* Scroll hint on last card removed, else show arrow */}
          {index < SERVICES.length - 1 ? (
            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.25)" }}>
              <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M8 13l-4-4M8 13l4-4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <p className="m-0 text-xs tracking-widest uppercase font-mono" style={{ color: srv.accent }}>
              That's all our services ↑
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const wrapperRef = useRef(null);

  /* Section header entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-header-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} id="services" className="relative bg-black select-none">
      {/* ── Intro header (scrolls away before cards start) ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              className="services-header-anim m-0 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#B3FFC9", fontFamily: "'Syne', sans-serif" }}
            >
              [ WHAT WE DO ]
            </p>
            <h2
              className="services-header-anim text-white font-extrabold m-0 tracking-tight"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.06,
              }}
            >
              Our{" "}
              <span style={{ color: "#B3FFC9" }}>Services</span>
            </h2>
          </div>
          <p
            className="services-header-anim text-white/50 text-sm sm:text-base max-w-sm leading-relaxed m-0 md:text-right"
          >
            Scroll through to explore every service we craft for your brand.
          </p>
        </div>
      </div>

      {/* ── Sticky stacked cards (dzinrstudio-style) ── */}
      <div>
        {SERVICES.map((srv, i) => (
          <ServiceCard key={i} srv={srv} index={i} />
        ))}
      </div>
    </section>
  );
}
