import React from "react";
import { SEO } from "../utils/seo";
import { HeroSection } from "../sections/home/HeroSection";
import { ClientsSection } from "../sections/home/ClientsSection";
import { VideoPinSection } from "../sections/home/VideoPinSection";
import { ProjectsSection } from "../sections/home/ProjectsSection";
import { PodcastClipsSection } from "../sections/home/PodcastClipsSection";
import { ShortFormSection } from "../sections/home/ShortFormSection";
import { SaasVideoSection } from "../sections/home/SaasVideoSection";
import { ServicesSection } from "../sections/home/ServicesSection";
import { TestimonialsSection } from "../sections/home/TestimonialsSection";
import { CtaMarqueeSection } from "../sections/home/CtaMarqueeSection";
import { CtaSection } from "../sections/home/CtaSection";

export function Home() {
  return (
    <main>
      <SEO title="Home" canonical="/" />
      {/* 1. Hero — Big LITTROI text, Think. Create. Dominate. */}
      <HeroSection />

      {/* 2. Our Clients — Masscie dual-row marquee */}
      <ClientsSection />

      {/* 3. Showreel — Scroll-pinned full-screen video shrinking to bottom left with side text */}
      <VideoPinSection />

      {/* 4. Our Projects — Landscape 16:9 Video Slider */}
      <ProjectsSection />

      {/* 5. Podcast Clips — 9:16 Reels Video Slider */}
      <PodcastClipsSection />

      {/* 6. Short Form Content — 9:16 Reels Video Slider */}
      <ShortFormSection />

      {/* 7. Saas Video — Large 16:9 Showcase */}
      <SaasVideoSection />

      {/* 8. Our Services — 8-Card Floating Grid */}
      <ServicesSection />

      {/* 9. Testimonials */}
      <TestimonialsSection />

      {/* 10. Gradient CTA Marquee Banner */}
      <CtaMarqueeSection />

      {/* 11. CTA */}
      {/* <CtaSection /> */}
    </main>
  );
}
