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
    num: "01", icon: iconSaas, title: "SAAS Video", tag: "Software & Tech",
    desc: "We turn complex software and SaaS products into clear, engaging videos people instantly understand. From product demos to high-converting launch films, we make your value obvious.",
    bg: "#0a1a0f", accent: "#B3FFC9",
  },
  {
    num: "02", icon: iconPodcast, title: "Podcast Editing", tag: "Audio & Video",
    desc: "Clean cuts, engaging visual pacing, and crystal-clear audio engineering. We edit your episodes and turn conversations into magnetic clips that expand your reach.",
    bg: "#0a0f1a", accent: "#A8EDFF",
  },
  {
    num: "03", icon: iconLongForm, title: "Long Form Content", tag: "YouTube & Streaming",
    desc: "High-retention storytelling crafted to keep viewers watching till the very end. Perfect for YouTube documentary-style videos, in-depth breakdowns, and educational authority.",
    bg: "#150a1a", accent: "#D4B3FF",
  },
  {
    num: "04", icon: iconShortForm, title: "Short Form Content", tag: "Reels & TikTok",
    desc: "Fast, punchy, scroll-stopping videos designed for Reels, TikTok, and YouTube Shorts to maximise virality and audience acquisition.",
    bg: "#1a120a", accent: "#FFD6A5",
  },
  {
    num: "05", icon: iconMotion, title: "Motion Graphics", tag: "Animation & VFX",
    desc: "Fluid 2D & 3D kinetic animations that elevate your brand perception. Custom kinetic typography, visual explainers, and dynamic overlays.",
    bg: "#1a0a10", accent: "#FF9DE2",
  },
  {
    num: "06", icon: iconStatic, title: "Static Creatives & Carousels", tag: "Design & Graphics",
    desc: "High-impact visual designs that communicate value within seconds. Promotional graphics to informative slide decks that drive organic shares.",
    bg: "#0a1510", accent: "#B3FFC9",
  },
  {
    num: "07", icon: iconBrand, title: "Brand Identity Development", tag: "Identity & Strategy",
    desc: "We build cohesive visual systems, logo design, typography, and color guidelines that make your business instantly recognisable and memorable everywhere.",
    bg: "#080a18", accent: "#A8EDFF",
  },
  {
    num: "08", icon: iconThumb, title: "Thumbnails Creation", tag: "Click-through & CTR",
    desc: "High-CTR visual packaging with psychology-driven compositions, vivid contrast, and emotive framing that command attention and boost click-through rates.",
    bg: "#1a150a", accent: "#FFD6A5",
  },
];

/* ─────────────────────────────────────────────
   The section layout:

   1.  A small "header" block that SCROLLS AWAY naturally.
   2.  The pin-wrap: exactly 100dvh tall. GSAP pins THIS
       element when its top touches the viewport top.
       Cards are absolutely stacked inside it.
   3.  A spacer div below pin-wrap that gives scroll distance
       for the card transitions (7 × 100vh).
─────────────────────────────────────────────── */
export function ServicesSection() {
  const pinWrapRef = useRef(null);
  const spacerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const spacer = spacerRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!pinWrap || !spacer || cards.length === 0) return;

    const N = cards.length;      // 8
    const STEPS = N - 1;             // 7 transitions

    /* ── Initial card states ── */
    cards.forEach((card, i) => {
      // Stack cards; later ones start off-screen below
      gsap.set(card, {
        yPercent: i === 0 ? 0 : 100,
        zIndex: 10 + i,
        force3D: true,
      });

      const els = {
        num: card.querySelector(".svc-num"),
        tag: card.querySelector(".svc-tag"),
        title: card.querySelector(".svc-title"),
        line: card.querySelector(".svc-line"),
        desc: card.querySelector(".svc-desc"),
      };

      if (i === 0) {
        // First card visible immediately — animate text in
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo([els.num, els.tag].filter(Boolean),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.65, ease: "power3.out" })
          .fromTo(els.title,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
          .fromTo(els.line,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
          .fromTo(els.desc,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, "-=0.4");
      } else {
        // Hide all text for cards not yet shown
        gsap.set([els.num, els.tag, els.title, els.desc].filter(Boolean), { opacity: 0, y: 30 });
        if (els.line) gsap.set(els.line, { scaleX: 0, transformOrigin: "left center" });
      }
    });

    /* ── Master scrubbed timeline ──
       Trigger: pinWrap itself ("top top") so card fills
       full viewport immediately when section reaches top.
       Scroll distance: STEPS full viewports.
    ── */
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinWrap,
        start: "top top",
        end: () => "+=" + (STEPS * window.innerHeight),
        pin: true,          // pins pinWrap itself
        pinSpacing: false,         // spacer below handles the scroll room
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Give the spacer the right height so there is scroll room
    spacer.style.height = STEPS * window.innerHeight + "px";

    cards.forEach((card, i) => {
      if (i >= STEPS) return;

      const next = cards[i + 1];
      const at = i;        // timeline position (1 unit per step)
      const textAt = at + 0.5;

      /* Outgoing card: dims, shrinks slightly */
      masterTl.to(card, {
        scale: 0.93,
        opacity: 0,
        filter: "brightness(0.25) blur(4px)",
        duration: 0.45,
        ease: "power2.in",
      }, at + 0.38);

      /* Incoming card: slides up */
      masterTl.fromTo(next,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.85, ease: "power2.inOut" },
        at
      );

      /* Text reveals — simple opacity+y only (no clipPath during scrub) */
      const nEls = {
        num: next.querySelector(".svc-num"),
        tag: next.querySelector(".svc-tag"),
        title: next.querySelector(".svc-title"),
        line: next.querySelector(".svc-line"),
        desc: next.querySelector(".svc-desc"),
      };

      if (nEls.num)
        masterTl.fromTo(nEls.num, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" }, textAt);
      if (nEls.tag)
        masterTl.fromTo(nEls.tag, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" }, textAt + 0.04);
      if (nEls.title)
        masterTl.fromTo(nEls.title, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out" }, textAt + 0.1);
      if (nEls.line)
        masterTl.fromTo(nEls.line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.28, ease: "power3.out" }, textAt + 0.22);
      if (nEls.desc)
        masterTl.fromTo(nEls.desc, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.26, ease: "power3.out" }, textAt + 0.28);
    });

    return () => {
      masterTl.scrollTrigger?.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section id="services" className="relative bg-black select-none">

      {/* ── Intro header — scrolls away naturally ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p
              className="m-0 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#B3FFC9", fontFamily: "'Syne', sans-serif" }}
            >
              [ WHAT WE DO ]
            </p>
            <h2
              className="text-white font-extrabold m-0 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.06 }}
            >
              Our <span style={{ color: "#B3FFC9" }}>Services</span>
            </h2>
          </div>
          <p className="text-white/50 text-sm sm:text-base max-w-xs leading-relaxed m-0 md:text-right">
            Scroll to explore every service we craft for your brand.
          </p>
        </div>
      </div>

      {/* ── Pin wrap: exactly 100dvh, cards stack inside ──
           GSAP pins THIS element when top touches viewport top.
      ── */}
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
            ref={(el) => { if (el) cardRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: srv.bg,
              overflow: "hidden",
              willChange: "transform, opacity, filter",
            }}
          >
            {/* Noise */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay", opacity: 0.45,
            }} />
            {/* Accent top-right glow */}
            <div aria-hidden style={{
              position: "absolute", top: 0, right: 0, width: "55vw", height: "55vh", pointerEvents: "none",
              background: `radial-gradient(ellipse at top right, ${srv.accent}1e 0%, transparent 65%)`,
            }} />
            {/* Accent bottom-left glow */}
            <div aria-hidden style={{
              position: "absolute", bottom: 0, left: 0, width: "40vw", height: "40vh", pointerEvents: "none",
              background: `radial-gradient(ellipse at bottom left, ${srv.accent}0e 0%, transparent 65%)`,
            }} />

            {/* Card layout */}
            <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>

              {/* TOP BAR */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "clamp(18px,2.8vh,32px) clamp(24px,4vw,64px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span className="svc-num" style={{
                    fontFamily: "monospace", fontSize: 11, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: srv.accent,
                  }}>
                    {srv.num} / {String(SERVICES.length).padStart(2, "0")}
                  </span>
                  <span className="svc-tag" style={{
                    fontSize: 11, padding: "4px 13px", borderRadius: 999,
                    border: `1px solid ${srv.accent}33`, background: `${srv.accent}0d`,
                    color: `${srv.accent}cc`, fontFamily: "'Syne',sans-serif", letterSpacing: "0.05em",
                  }}>
                    {srv.tag}
                  </span>
                </div>
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center",
                  justifyContent: "center", padding: 10,
                  background: `${srv.accent}13`, border: `1px solid ${srv.accent}2a`,
                }}>
                  <img src={srv.icon} alt={srv.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              </div>

              {/* MAIN CONTENT — vertically centred */}
              <div style={{
                flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "0 clamp(24px,4vw,64px)",
                minHeight: 0,
              }}>
                {/* Progress pips */}
                <div style={{ display: "flex", gap: 6, marginBottom: "clamp(28px,4vh,48px)" }}>
                  {SERVICES.map((_, di) => (
                    <div key={di} style={{
                      height: 2, flex: 1, borderRadius: 2,
                      background: di === i ? srv.accent : "rgba(255,255,255,0.1)",
                    }} />
                  ))}
                </div>

                {/* Title */}
                <h3
                  className="svc-title"
                  style={{
                    margin: 0, fontFamily: "'Syne',sans-serif", fontWeight: 800,
                    color: "#fff", lineHeight: 0.95, letterSpacing: "-0.025em",
                    fontSize: "clamp(42px, 8vw, 120px)",
                  }}
                >
                  {srv.title}
                </h3>

                {/* Accent line */}
                <div
                  className="svc-line"
                  style={{
                    height: 1,
                    margin: "clamp(22px,3.5vh,42px) 0",
                    background: `linear-gradient(to right, ${srv.accent}77, rgba(255,255,255,0.04))`,
                    transformOrigin: "left center",
                  }}
                />

                {/* Description */}
                <p
                  className="svc-desc"
                  style={{
                    margin: 0, color: "rgba(255,255,255,0.58)", lineHeight: 1.75,
                    maxWidth: "50ch", fontSize: "clamp(15px, 1.5vw, 20px)",
                  }}
                >
                  {srv.desc}
                </p>
              </div>

              {/* BOTTOM BAR */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "clamp(14px,2.2vh,26px) clamp(24px,4vw,64px)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}>
                <p style={{
                  margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.2)", fontFamily: "'Syne',sans-serif",
                }}>
                  LITTROI PRODUCTION SUITE
                </p>
                {i < SERVICES.length - 1 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.28)" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      Scroll
                    </span>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="currentColor"
                        strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <p style={{
                    margin: 0, fontFamily: "monospace", fontSize: 10,
                    textTransform: "uppercase", letterSpacing: "0.15em", color: srv.accent,
                  }}>
                    All services explored ↑
                  </p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ── Spacer that provides the scroll distance for card transitions ── */}
      <div ref={spacerRef} style={{ background: "#000" }} />

    </section>
  );
}
