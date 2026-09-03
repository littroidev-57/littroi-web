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
  const soundStatusRef = useRef(null);
  const [soundStatusText, setSoundStatusText] = useState("🔊 Tap anywhere for sound");

  useEffect(() => {
    const section = sectionRef.current;
    const vidWrap = vidWrapRef.current;
    const vid = vidRef.current;
    const txt = txtRef.current;
    const soundStatus = soundStatusRef.current;

    if (!section || !vidWrap || !vid) return;

    // Autoplay when section comes into view
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

    // Global click to unmute
    const handleUnmute = () => {
      if (vid && vid.muted) {
        vid.muted = false;
        setSoundStatusText("🎵 Audio Active");
        if (soundStatus) {
          setTimeout(() => {
            soundStatus.style.opacity = "0";
          }, 2000);
        }
      }
      document.removeEventListener("click", handleUnmute);
    };
    document.addEventListener("click", handleUnmute);

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
      document.removeEventListener("click", handleUnmute);
      ctx.revert();
    };
  }, []);

  return (
    <section className="relative w-full bg-black overflow-hidden select-none">
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

        {/* Floating Sound Status Indicator */}
        <div
          id="vps-sound-status"
          ref={soundStatusRef}
          className="absolute bottom-5 right-5 z-30 bg-black/60 text-white px-3.5 py-1.5 rounded-full text-xs font-mono pointer-events-none border border-white/20 transition-opacity duration-500"
        >
          {soundStatusText}
        </div>

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
