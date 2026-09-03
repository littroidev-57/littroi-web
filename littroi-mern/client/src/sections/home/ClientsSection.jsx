import React from "react";
import { motion } from "framer-motion";

// Row 1 logos — exact order from littroi.com WP HTML (forward, 50.51s)
import g1082 from "../../assets/Group 1082.png";
import g1080 from "../../assets/Group 1080.png";
import g1079 from "../../assets/Group 1079.png";
import g1078 from "../../assets/Group 1078.png";
import g1077 from "../../assets/Group 1077.png";
import g1076 from "../../assets/Group 1076.png";
import g1075 from "../../assets/Group 1075.png";
import mindset90 from "../../assets/Mindset90.png";
import g1072 from "../../assets/Group 1072.png";
import g1073 from "../../assets/Group 1073.png";
import g1070 from "../../assets/Group 1070.png";
import g1052 from "../../assets/Group 1052.png";
import g1049 from "../../assets/Group 1049.png";

// Row 2 logos — exact order from littroi.com WP HTML (reverse, 54.42s)
import g1100 from "../../assets/Group 1100.png";
import g1099 from "../../assets/Group 1099.png";
import g1098 from "../../assets/Group 1098.png";
import g1097 from "../../assets/Group 1097.png";
import g1096 from "../../assets/Group 1096.png";
import g1094 from "../../assets/Group 1094.png";
import g1093 from "../../assets/Group 1093.png";
import g1091 from "../../assets/Group 1091.png";
import g1090 from "../../assets/Group 1090.png";
import g1089 from "../../assets/Group 1089.png";
import g1085 from "../../assets/Group 1085.png";
import g1084 from "../../assets/Group 1084.png";
import treeline from "../../assets/TreelinePress.png";
import tst from "../../assets/TST.png";

const ROW1 = [
  { src: g1082, alt: "Group 1082" },
  { src: g1080, alt: "Group 1080" },
  { src: g1079, alt: "Group 1079" },
  { src: g1078, alt: "Group 1078" },
  { src: g1077, alt: "Group 1077" },
  { src: g1076, alt: "Group 1076" },
  { src: g1075, alt: "Group 1075" },
  { src: mindset90, alt: "Mindset90" },
  { src: g1072, alt: "Group 1072" },
  { src: g1073, alt: "Group 1073" },
  { src: g1070, alt: "Group 1070" },
  { src: g1052, alt: "Group 1052" },
  { src: g1049, alt: "Group 1049" },
];

const ROW2 = [
  { src: g1100, alt: "Group 1100" },
  { src: g1099, alt: "Group 1099" },
  { src: g1098, alt: "Group 1098" },
  { src: g1097, alt: "Group 1097" },
  { src: g1096, alt: "Group 1096" },
  { src: g1094, alt: "Group 1094" },
  { src: g1093, alt: "Group 1093" },
  { src: g1091, alt: "Group 1091" },
  { src: g1090, alt: "Group 1090" },
  { src: g1089, alt: "Group 1089" },
  { src: g1085, alt: "Group 1085" },
  { src: g1084, alt: "Group 1084" },
  { src: treeline, alt: "TreelinePress" },
  { src: tst, alt: "TST" },
];

function MarqueeGroup({ logos, isReverse = false }) {
  return (
    <div className={`masscie-group ${isReverse ? "reverse" : ""}`}>
      {logos.map((logo, i) => (
        <div key={i} className="masscie-team-member">
          <div className="masscie-team-member-content">
            <div className="masscie-team-member-image">
              <img decoding="async" src={logo.src} alt={logo.alt} loading="lazy" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClientsSection() {
  return (
    <section
      className="elementor-element elementor-element-7bba5fd e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-[#000000] select-none overflow-hidden"
      id="clients"
      data-id="7bba5fd"
      data-element_type="container"
      data-e-type="container"
      style={{ paddingTop: "clamp(60px, 8vw, 110px)", paddingBottom: "clamp(50px, 6vw, 90px)" }}
    >
      {/* elementor-element-7bba5fd — Our Clients Header Section */}
      <div className="e-con-inner max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-12 sm:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          {/* elementor-element-6bfc39e: Left Heading "Our Clients" with fadeInLeft entrance transition */}
          <div
            className="elementor-element elementor-element-6bfc39e e-flex e-con-boxed wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-child"
            data-id="6bfc39e"
            data-element_type="container"
            data-e-type="container"
          >
            <div className="e-con-inner">
              <motion.div
                initial={{ opacity: 0, x: -90 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="elementor-element elementor-element-5b1fcab animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
                data-id="5b1fcab"
                data-element_type="widget"
                data-widget_type="heading.default"
              >
                <h2
                  className="elementor-heading-title elementor-size-default m-0"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(30px, 3.8vw, 46px)",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  Our <span style={{ color: "#B3FFC9" }}>Clients</span>
                </h2>
              </motion.div>
            </div>
          </div>

          {/* elementor-element-fca3cff: Right Text formatted in EXACT 3 lines matching screenshot */}
          <div
            className="elementor-element elementor-element-fca3cff e-flex e-con-boxed wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-child max-w-[700px]"
            data-id="fca3cff"
            data-element_type="container"
            data-e-type="container"
          >
            <div className="e-con-inner">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="elementor-element elementor-element-a986dcb elementor-widget__width-initial exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-text-editor"
                data-id="a986dcb"
                data-element_type="widget"
                data-widget_type="text-editor.default"
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
                  Your brand has a story. We make sure it's seen, felt and<br className="hidden md:inline" />
                  remembered. We design logos, build brands and create<br className="hidden md:inline" />
                  moments that turn attention into action.
                </p>
              </motion.div>
            </div>
          </div>

        </div>

        {/* elementor-element-c8dc35c: Spacer */}
        <div
          className="elementor-element elementor-element-c8dc35c exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer mt-6"
          data-id="c8dc35c"
          data-element_type="widget"
          data-widget_type="spacer.default"
        >
          <div className="elementor-spacer h-[10px]">
            <div className="elementor-spacer-inner"></div>
          </div>
        </div>
      </div>

      {/* elementor-element-9676491: Dual Row Masscie Marquee Container with increased vertical gap */}
      <div
        className="elementor-element elementor-element-9676491 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded space-y-10 sm:space-y-14"
        data-id="9676491"
        data-element_type="container"
        data-e-type="container"
      >
        {/* ROW 1: Forward Marquee (elementor-element-2d0051e) — Fast smooth speed */}
        <div
          className="elementor-element elementor-element-2d0051e exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-masscie-team-members-marquee"
          data-id="2d0051e"
          data-element_type="widget"
          data-widget_type="masscie-team-members-marquee.default"
        >
          <div className="elementor-widget-container">
            <div
              className="masscie-marquee-wrap masscie-mask-edges"
              data-speed="86"
              data-gap="60"
              data-reverse="no"
              data-pause="yes"
              style={{ "--masscie-gap": "60px", "--masscie-duration": "25s" }}
            >
              <div className="masscie-track">
                <MarqueeGroup logos={ROW1} />
                <MarqueeGroup logos={ROW1} />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Reverse Marquee (elementor-element-909c5d7) — Fast smooth speed */}
        <div
          className="elementor-element elementor-element-909c5d7 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-masscie-team-members-marquee"
          data-id="909c5d7"
          data-element_type="widget"
          data-widget_type="masscie-team-members-marquee.default"
        >
          <div className="elementor-widget-container">
            <div
              className="masscie-marquee-wrap masscie-mask-edges"
              data-speed="86"
              data-gap="60"
              data-reverse="yes"
              data-pause="yes"
              style={{ "--masscie-gap": "60px", "--masscie-duration": "27s" }}
            >
              <div className="masscie-track">
                <MarqueeGroup logos={ROW2} isReverse={true} />
                <MarqueeGroup logos={ROW2} isReverse={true} />
              </div>
            </div>
          </div>
        </div>

        {/* elementor-element-294f273 & 16c2296: Spacers */}
        <div
          className="elementor-element elementor-element-294f273 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
          data-id="294f273"
          data-element_type="widget"
          data-widget_type="spacer.default"
        >
          <div className="elementor-spacer h-[15px]">
            <div className="elementor-spacer-inner"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
