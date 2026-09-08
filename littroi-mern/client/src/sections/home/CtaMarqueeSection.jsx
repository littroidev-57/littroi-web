import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Deterministic pseudo-random wobble per letter index, so any text
// length works without a hand-tuned per-character data array.
function seededWobble(i) {
  const seed = Math.sin(i * 12.9898) * 43758.5453;
  const frac = seed - Math.floor(seed);
  const y = (frac - 0.5) * 120; // -60% to +60%
  const seed2 = Math.sin((i + 1) * 78.233) * 12543.185;
  const frac2 = seed2 - Math.floor(seed2);
  const r = (frac2 - 0.5) * 30; // -15deg to +15deg
  return { y, r };
}

export function CtaMarqueeSection({
  text = "So, are you Ready to Stand out?",
}) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const el = textRef.current;
    if (!section || !pin || !el) return;

    let panTween = null;
    const subTweens = [];
    let ctx;
    let cancelled = false; // <-- guards against StrictMode double-invoke

    const setup = () => {
      if (cancelled) return; // effect was already cleaned up, bail out
      ctx = gsap.context(() => {
        el.innerHTML = text
          .split("")
          .map((ch) =>
            ch === " "
              ? `<span class="inline-block w-14 h-4 flex-shrink-0"> </span>`
              : `<span class="letter inline-block will-change-transform" style="display:inline-block; transform-origin:center center;">${ch}</span>`
          )
          .join("");

        const letters = el.querySelectorAll(".letter");
        const getScrollDist = () => Math.max(0, el.scrollWidth - window.innerWidth);

        panTween = gsap.to(el, {
          x: () => -getScrollDist(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin,
            scrub: 0.5,
            start: "top top",
            end: () => `+=${getScrollDist()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        letters.forEach((letterEl, i) => {
          const { y, r } = seededWobble(i);
          const tw = gsap.fromTo(
            letterEl,
            { yPercent: y, rotation: r },
            {
              yPercent: 0,
              rotation: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: letterEl,
                containerAnimation: panTween,
                start: "left 100%",
                end: "left 25%",
                scrub: 0.5,
              },
            }
          );
          subTweens.push(tw);
        });

        // Recalculate once everything (fonts/images) has truly settled
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, section);
    };

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(setup);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true; // stops a pending setup() from running after unmount
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
      subTweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      panTween?.scrollTrigger?.kill();
      panTween?.kill();
      ctx?.revert();
    };
  }, [text]);

  return (
    <section
      ref={sectionRef}
      id="brand-marquee"
      className="relative overflow-hidden w-full bg-foreground text-background"
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center overflow-hidden select-none"
      >
        <p
          ref={textRef}
          className="flex w-max whitespace-nowrap px-[101vw] text-[25vw] leading-[0.9] tracking-tighter will-change-transform lg:text-[16vw] font-extrabold"
          style={{ fontFamily: "'Syne', sans-serif", margin: 0 }}
        >
          {text}
        </p>
      </div>
    </section>
  );
}