import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import showreelVideo from "../../assets/vidssave.com-Littroi-Showreel-720P.mp4";

gsap.registerPlugin(ScrollTrigger);

export function VideoPinSection() {
  const sectionRef = useRef(null);
  const vidWrapRef = useRef(null);
  const vidRef = useRef(null);
  const txtRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Toggle voice on / off whenever clicked anywhere on the section/video
  const toggleSound = () => {
    const vid = vidRef.current;
    if (!vid) return;

    if (vid.muted) {
      vid.muted = false;
      setIsMuted(false);
      if (vid.paused) {
        vid.play().catch(() => {});
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
    const txt = txtRef.current;

    if (!section || !vidWrap || !vid) return;

    // Autoplay muted video when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
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
        const endScale = 0.28;
        const endX = window.innerWidth * 0.055;
        const endY = -window.innerHeight * 0.07;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=2000",
            scrub: 1.2,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > 0.03 && vid.paused) {
                vid.play().catch(() => {});
              }
            },
          },
        });

        tl.to(
          vidWrap,
          {
            scale: endScale,
            x: endX,
            y: endY,
            borderRadius: 14,
            ease: "none",
          },
          0
        );

        if (txt) {
          tl.to(
            txt,
            {
              opacity: 1,
              y: 0,
              ease: "none",
            },
            0.55
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
      className="relative w-full bg-black overflow-hidden select-none cursor-pointer"
      onClick={toggleSound}
      title="Click anywhere to toggle audio"
    >
      {/* ── DESKTOP: GSAP Scroll-Pinned Fullscreen-to-Corner Video ── */}
      <div
        id="video-pin-section"
        ref={sectionRef}
        className="hidden md:block relative w-full h-screen bg-black overflow-hidden"
        style={{
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {/* Fullscreen Video Wrapper that scales down & moves to bottom-left */}
        <div
          id="vps-vid-wrap"
          ref={vidWrapRef}
          className="absolute inset-0 w-full h-full overflow-hidden z-10"
          style={{
            transformOrigin: "left bottom",
            willChange: "transform",
          }}
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
          />
        </div>

        {/* Floating Sound Status Indicator / Toggle Button */}
        <button
          type="button"
          id="vps-sound-status"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className={`absolute bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide backdrop-blur-md border transition-all duration-300 shadow-2xl cursor-pointer ${
            isMuted
              ? "bg-black/70 text-white/90 border-white/20 hover:border-[#1FD655] hover:text-[#1FD655] hover:bg-black/90"
              : "bg-[#1FD655] text-black border-[#1FD655] font-semibold hover:bg-[#1FD655]/90"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {!isMuted && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isMuted ? "bg-white/40" : "bg-black"
              }`}
            ></span>
          </span>
          <span>
            {isMuted ? "🔇 Tap anywhere for sound" : "🔊 Sound ON · Tap to mute"}
          </span>
        </button>

        {/* Dynamic Text Appearing to the right of the shrunken video */}
        <div
          id="vps-txt"
          ref={txtRef}
          className="absolute z-20 pointer-events-none"
          style={{
            opacity: 0,
            transform: "translateY(18px)",
            bottom: "7vh",
            left: "37vw",
            width: "57vw",
          }}
        >
          <h2
            className="m-0 text-white"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(18px, 2.5vw, 40px)",
              lineHeight: 1.18,
              letterSpacing: "0.01em",
            }}
          >
            Smart strategy backed by precise execution, because ideas alone are never enough.{" "}
            Get seen. Get trusted. Get chosen.
          </h2>
        </div>
      </div>

      {/* ── MOBILE (<=768px): Inline Video & Heading matching Elementor layout ── */}
      <div className="block md:hidden w-full px-4 py-10 space-y-6">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <video
            src={showreelVideo}
            controls
            preload="auto"
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-2">
          <h2
            className="text-lg sm:text-xl font-bold text-white leading-snug"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Smart strategy backed by precise execution, because ideas alone are never enough.{" "}
            Get seen. Get trusted. Get chosen.
          </h2>
        </div>
      </div>
    </section>
  );
}
