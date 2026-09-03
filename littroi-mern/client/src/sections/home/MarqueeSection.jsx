import React from "react";
import { Marquee } from "../../components/animations/Marquee";

export function MarqueeSection() {
  const marqueeItems = [
    "THINK. CREATE. DOMINATE.",
    "HIGH-RETENTION LONG FORM",
    "VIRAL REELS & SHORTS",
    "CINEMATIC SAAS PRODUCT VIDEOS",
    "3D MOTION GRAPHICS",
    "STRATEGY FIRST CREATIVE"
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-brand-surface via-brand-bg to-brand-surface border-y border-white/10 overflow-hidden">
      <Marquee speed="fast" pauseOnHover={true}>
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 px-4">
            <span className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white/90 hover:text-brand-accent transition-colors duration-300">
              {item}
            </span>
            <div className="w-3 h-3 rounded-full bg-brand-primary/60 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
