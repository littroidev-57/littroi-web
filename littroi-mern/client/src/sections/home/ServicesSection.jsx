import React from "react";
import { motion } from "framer-motion";

import iconSaas from "../../assets/b0761bef-fcd0-4a41-aa6a-ea8d8560f385.png";
import iconPodcast from "../../assets/9dba0400-26dd-416a-9cad-7fb6b32e4972.png";
import iconLongForm from "../../assets/05bc27a7-a8f0-49e6-be43-6b6905f440cb.png";
import iconShortForm from "../../assets/351c61e1-1ba2-48ee-a763-380efac7882d.png";
import iconMotion from "../../assets/ad968ebe-56b5-44db-95e2-b85576807f72.png";
import iconStatic from "../../assets/e6ea29c0-73ce-4918-bd46-d34cf5b57ed0.png";
import iconBrand from "../../assets/180b64fe-108b-429d-a9ca-1993185ed871.png";
import iconThumb from "../../assets/5025f549-4411-4e72-b344-5de673b2c154.png";

const SERVICES_DATA = [
  {
    num: "01",
    icon: iconSaas,
    title: "SAAS Video",
    desc: "We turn complex products into clear, engaging videos that people actually understand. From demos to launch videos, we help your product feel simple, valuable and worth trying.",
    dur: "3.8s",
    delay: "0s",
  },
  {
    num: "02",
    icon: iconPodcast,
    title: "Podcast Editing",
    desc: "Clean cuts, smooth pacing and polished audio that keeps listeners locked in. We handle the edits so your podcast sounds professional without losing its personality.",
    dur: "4.4s",
    delay: "0.3s",
  },
  {
    num: "03",
    icon: iconLongForm,
    title: "Long Form Content",
    desc: "Videos built to hold attention, tell stories and keep viewers watching till the end. Perfect for YouTube, interviews, educational content and deep-dive storytelling.",
    dur: "3.5s",
    delay: "0.6s",
  },
  {
    num: "04",
    icon: iconShortForm,
    title: "Short Form Content",
    desc: "Fast, sharp and built for attention. We create short-form videos designed to stop the scroll and perform across Reels, TikTok and Shorts.",
    dur: "4.8s",
    delay: "0.9s",
  },
  {
    num: "05",
    icon: iconMotion,
    title: "Motion Graphics",
    desc: "Fast, sharp and built for attention. We create animated graphics designed to stop the scroll and perform across Reels, TikTok and Shorts.",
    dur: "4.1s",
    delay: "0.2s",
  },
  {
    num: "06",
    icon: iconStatic,
    title: "Static Creatives & Carousels",
    desc: "Designs that grab attention and communicate fast. From promotional posts to informative carousels, visuals that look sharp, feel on-brand and keep audiences engaged.",
    dur: "3.6s",
    delay: "0.5s",
  },
  {
    num: "07",
    icon: iconBrand,
    title: "Brand Identity Development",
    desc: "Your brand is more than just visuals. We build identities that feel consistent, memorable and instantly recognizable across every platform and touchpoint.",
    dur: "4.9s",
    delay: "0.8s",
  },
  {
    num: "08",
    icon: iconThumb,
    title: "Thumbnails Creation",
    desc: "Thumbnails that make people click before they even think twice. Bold visuals, strong emotions and clear focus designed to boost curiosity and views.",
    dur: "3.3s",
    delay: "1.1s",
  },
];

export function ServicesSection() {
  return (
    <section
      className="elementor-element elementor-element-abe7507 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-16 sm:py-24 overflow-hidden select-none"
      data-id="abe7507"
      data-element_type="container"
      data-e-type="container"
      id="services"
    >
      {/* Spacer (elementor-element-fa8c9a3) */}
      <div
        className="elementor-element elementor-element-fa8c9a3 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer"
        data-id="fa8c9a3"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>

      {/* Header: Our Services with fadeInLeft transition (elementor-element-3fed575) */}
      <div className="max-w-[1480px] w-full mx-auto px-6 sm:px-10 lg:px-14 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="elementor-element elementor-element-3fed575 animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          data-id="3fed575"
          data-element_type="widget"
          data-widget_type="heading.default"
        >
          <h2
            className="elementor-heading-title elementor-size-default m-0 text-white"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Our <span style={{ color: "#B3FFC9" }}>Services</span>
          </h2>
        </motion.div>
      </div>

      {/* Services Grid Container (elementor-element-817fe6e) */}
      <div className="wrapper max-w-[1480px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Horizontal Scroll / Desktop 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-sm:flex max-sm:overflow-x-auto max-sm:pb-4 max-sm:no-scrollbar max-sm:snap-x">
          {SERVICES_DATA.map((srv, idx) => (
            <div
              key={idx}
              className="card bg-black border border-[#222222] rounded-[16px] p-[1.6rem_1.1rem_1.8rem] flex flex-col gap-[14px] relative overflow-hidden transition-all duration-350 hover:border-[#86D9B1] group max-sm:flex-shrink-0 max-sm:w-[82vw] max-sm:min-w-[260px] max-sm:snap-start"
              style={{
                animation: `floatCard ${srv.dur} ease-in-out infinite`,
                animationDelay: srv.delay,
              }}
            >
              {/* Service Icon with drop shadow on hover */}
              <div className="icon w-[60px] h-[60px] flex items-center justify-center">
                <img
                  src={srv.icon}
                  alt={`${srv.title} Icon`}
                  className="w-full h-full object-contain transition-all duration-350 group-hover:drop-shadow-[0_0_8px_rgba(134,217,177,0.6)]"
                />
              </div>

              {/* Service Card Title */}
              <h3
                className="card-title text-white font-bold uppercase transition-colors duration-350 group-hover:text-[#86D9B1]"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "22px",
                  lineHeight: "26px",
                  letterSpacing: "0.02em",
                }}
              >
                {srv.title}
              </h3>

              {/* Service Card Description */}
              <p
                className="card-desc text-gray-400 font-light text-[12.5px] leading-relaxed transition-colors duration-350 group-hover:text-gray-300"
                style={{
                  fontFamily: "'benzine', 'Poppins', sans-serif",
                }}
              >
                {srv.desc}
              </p>

              {/* Bottom Subtle Divider Line */}
              <div className="card-line mt-auto h-[1px] bg-[#1a1a1a]" />
            </div>
          ))}
        </div>
      </div>

      {/* Spacer (elementor-element-1f878f2) */}
      <div
        className="elementor-element elementor-element-1f878f2 exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-spacer mt-8"
        data-id="1f878f2"
        data-element_type="widget"
        data-widget_type="spacer.default"
      >
        <div className="elementor-spacer h-[20px]">
          <div className="elementor-spacer-inner"></div>
        </div>
      </div>
    </section>
  );
}

