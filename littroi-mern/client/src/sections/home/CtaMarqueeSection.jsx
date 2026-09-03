import React from "react";

export function CtaMarqueeSection() {
  const marqueeText = "Ready to make your brand impossible to ignore?";

  return (
    <section
      className="elementor-element elementor-element-70ddcde e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded w-full h-screen min-h-screen relative overflow-hidden select-none flex items-center justify-center bg-[#b3ffc9]"
      data-id="70ddcde"
      data-element_type="container"
      data-e-type="container"
      style={{
        height: "100vh",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#b3ffc9",
      }}
      id="brand-marquee"
    >
      {/* Infinite Marquee Track (elementor-element-8da0eee) */}
      <div className="marquee w-full overflow-hidden flex items-center">
        <div
          className="marquee__inner flex w-fit whitespace-nowrap"
          style={{
            animation: "marquee 18s linear infinite",
          }}
        >
          {[...Array(6)].map((_, idx) => (
            <span
              key={idx}
              className="text-black inline-block normal-case leading-none select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 6.8vw, 98px)",
                fontWeight: 800,
                paddingRight: "80px",
                color: "#000000",
                whiteSpace: "nowrap",
              }}
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}



