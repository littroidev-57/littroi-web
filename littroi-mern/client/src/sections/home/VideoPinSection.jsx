import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import showreelVideo from "../../assets/vidssave.com-Littroi-Showreel-720P.mp4";

gsap.registerPlugin(ScrollTrigger);

export function VideoPinSection() {
  const sectionRef = useRef(null);
  const vidWrapRef = useRef(null);
  const vidRef = useRef(null);
  const dockTargetRef = useRef(null);
  const contentRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Toggle audio on / off
  const toggleSound = () => {
    const vid = vidRef.current;
    if (!vid) return;

    if (vid.muted) {
      vid.muted = false;
      setIsMuted(false);
      if (vid.paused) {
        vid.play().catch(() => { });
      }
    } else {
      vid.muted = true;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const vidWrap = vidWrapRef.current;
    const vid = vidRef.current;
    const dock = dockTargetRef.current;
    const content = contentRef.current;

    if (!section || !vidWrap || !vid) return;

    // Autoplay muted video when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    // GSAP ScrollTrigger for desktop (>768px)
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const calculateDock = () => {
          if (!section || !dock) return { x: 40, y: 180, sx: 0.25, sy: 0.25 };
          const sRect = section.getBoundingClientRect();
          const dRect = dock.getBoundingClientRect();
          return {
            x: dRect.left - sRect.left,
            y: dRect.top - sRect.top,
            sx: dRect.width / (sRect.width || window.innerWidth),
            sy: dRect.height / (sRect.height || window.innerHeight),
          };
        };

        // Hardware-accelerated initial setup
        gsap.set(vidWrap, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          borderRadius: 0,
          force3D: true,
          transformOrigin: "left top",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=2000",
            scrub: 0.8,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress > 0.03 && vid.paused) {
                vid.play().catch(() => { });
              }
            },
          },
        });

        // 1. Silky smooth GPU-accelerated translation and scaling
        tl.to(
          vidWrap,
          {
            x: () => calculateDock().x,
            y: () => calculateDock().y,
            scaleX: () => calculateDock().sx,
            scaleY: () => calculateDock().sy,
            borderRadius: 16,
            force3D: true,
            ease: "power1.inOut",
          },
          0
        );

        // 2. Fade in the surrounding editorial content
        if (content) {
          tl.fromTo(
            content,
            {
              opacity: 0,
              y: 35,
            },
            {
              opacity: 1,
              y: 0,
              force3D: true,
              ease: "power1.out",
            },
            0.15
          );
        }
      });
    }, section);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section 
      id="showreel"
      className="relative w-full bg-black overflow-hidden select-none"
    >
      {/* ── DESKTOP: GSAP Scroll-Pinned Fullscreen-to-Dock Video with Rich Editorial Content ── */}
      <div
        id="video-pin-section"
        ref={sectionRef}
        className="hidden md:block relative w-full h-screen bg-black overflow-hidden"
        style={{
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {/* Fullscreen Video Wrapper that docks seamlessly via GPU transforms */}
        <div
          id="vps-vid-wrap"
          ref={vidWrapRef}
          className="absolute top-0 left-0 w-full h-full z-20 overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
          style={{
            transformOrigin: "left top",
            willChange: "transform, border-radius",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
          onClick={toggleSound}
          title="Click to toggle sound"
        >
          <video
            id="vps-vid"
            ref={vidRef}
            src={showreelVideo}
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover block cursor-pointer"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />
        </div>

        {/* Floating Sound Toggle Button */}
        <button
          type="button"
          id="vps-sound-status"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className={`absolute bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide backdrop-blur-md border transition-all duration-300 shadow-2xl cursor-pointer ${isMuted
              ? "bg-black/70 text-white/90 border-white/20 hover:border-[#B3FFC9] hover:text-[#B3FFC9] hover:bg-black/90"
              : "bg-[#B3FFC9] text-black border-[#B3FFC9] font-semibold hover:bg-[#9effba]"
            }`}
        >
          <span className="relative flex h-2 w-2">
            {!isMuted && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isMuted ? "bg-white/40" : "bg-black"
                }`}
            ></span>
          </span>
          <span>
            {isMuted ? "🔇 Tap for sound" : "🔊 Sound ON · Tap to mute"}
          </span>
        </button>

        {/* Dynamic Editorial Content Revealing with Text Floating Around the Docked Video */}
        <div
          id="vps-content"
          ref={contentRef}
          className="absolute inset-0 z-10 w-full h-full flex flex-col justify-center px-6 lg:px-14 xl:px-20 py-12 max-w-[1440px] mx-auto pointer-events-auto"
          style={{ opacity: 0 }}
        >
          {/* Top Eyebrow Tag */}
          <div className="w-fit rounded-full text-xs sm:text-sm font-semibold text-[#B3FFC9] tracking-wider uppercase mb-6 lg:mb-8">
            [ ! ] Be the brand they never stop talking about
          </div>

          {/* Headline with Float-Left Dock Box for Video */}
          <div className="w-full">
            {/* The reserved float box that the video tweens into — text wraps naturally around it */}
            <div
              ref={dockTargetRef}
              className="float-left w-[260px] md:w-[300px] lg:w-[360px] xl:w-[420px] aspect-video mr-6 lg:mr-8 mb-4 rounded-2xl opacity-0 pointer-events-none"
            />

            <h2
              className="text-2xl md:text-3xl lg:text-[2.6rem] xl:text-[3.1rem] text-white font-bold leading-[1.18] tracking-[-0.02em] m-0"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Design on the web isn't static anymore. Today's brands need energy, personality and meaning. We bring together strategy, design and storytelling to build digital experiences that grab attention, move fast and make people feel.
            </h2>
            <div className="clear-both" />
          </div>
        </div>
      </div>

      {/* ── MOBILE (<=768px): Inline Video & Matching Rich Content Layout ── */}
      <div className="block md:hidden w-full px-5 py-12 space-y-8">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <video
            src={showreelVideo}
            controls
            preload="auto"
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="text-xs font-semibold text-[#B3FFC9] tracking-wider uppercase">
            [ ! ] Be the brand they never stop talking about
          </div>

          <h2
            className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight m-0"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Design on the web isn't static anymore. Today's brands need energy, personality and meaning. We bring together strategy, design and storytelling to build digital experiences that grab attention, move fast and make people feel.
          </h2>

          <div className="bg-white/15 h-[1px] w-full" />


        </div>
      </div>
    </section>
  );
}


