import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import avatarMarc from "../../assets/Group 1100.png";
import avatarSpencer from "../../assets/Group 1082.png";
import avatarHarrison from "../../assets/Group 1079.png";

const TESTIMONIALS_DATA = [
  {
    id: 1,
    videoId: "FApmJphhF9Y",
    title: "Marc Babin - Founder of The Podcast Blueprint (Testimonial)",
    quote:
      "Marc is big on values alignment and communication and when you find a team that gets it, you hold onto them. Knowing every episode is in good hands, without having to think twice about it, is exactly the kind of support network he was looking for.",
    avatar: avatarMarc,
    name: "Marc Babin",
    role: "Founder of The Podcast Blueprint",
    videoFirst: true,
  },
  {
    id: 2,
    videoId: "EIJg4p4MHpI",
    title: "Spencer Gilmore - Founder of Hair Rescue",
    quote:
      "Spencer is prolific with content but editing was slowing him down. Working with us freed him up to focus on what he does best and the content hasn't stopped since.",
    avatar: avatarSpencer,
    name: "Spencer Gilmore",
    role: "Founder of Hair Rescue",
    videoFirst: false,
  },
  {
    id: 3,
    videoId: "lpFoyBWzrUE",
    title: "Harison Saunders - Podcast host of The Growth Voyage (Testimonial)",
    quote:
      "Harrison hosts conversations with top entrepreneurs and investors, the content was already there. The production just needed to match it. Three months in, people were reaching out commenting on the quality unprompted.\n\nTime saved, standards met, and a clear step up from everything before. The difference was audible.",
    avatar: avatarHarrison,
    name: "Harison Saunders",
    role: "Host of the Growth Voyage podcast",
    videoFirst: true,
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="elementor-element elementor-element-d095e46 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black relative py-20 sm:py-28 overflow-hidden select-none"
      data-id="d095e46"
      data-element_type="container"
      data-e-type="container"
      id="testimonials"
    >
      <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-14">
        {/* Header: Hear it directly from Our Clients (elementor-element-c2f7a26) */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-c2f7a26 animated-slow exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          >
            <h2
              className="elementor-heading-title elementor-size-default m-0 text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(30px, 4.2vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}
            >
              Hear it directly from{" "}
              <span style={{ color: "#B3FFC9" }}>Our Clients</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="elementor-element elementor-element-df7f599 animated-slow elementor-widget__width-initial exad-sticky-section-no exad-glass-effect-no elementor-widget elementor-widget-heading"
          >
            <p
              className="elementor-heading-title elementor-size-default text-gray-300 max-w-3xl mx-auto"
              style={{
                fontFamily: "'benzine', 'Syne', sans-serif",
                fontSize: "clamp(13px, 1.2vw, 16px)",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Real feedback from brands and creators we've worked with. From content to design, our work is built to help people stand out, grow faster and create impact online.
            </p>
          </motion.div>

          {/* View More Button (elementor-element-06c88d7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2"
          >
            <Link
              to="/case-studies"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/20 text-white hover:border-[#B3FFC9] hover:text-[#B3FFC9] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(179,255,201,0.25)] hover:scale-105"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              View More
            </Link>
          </motion.div>
        </div>

        {/* 3 Alternating Testimonial Rows */}
        <div className="space-y-16 sm:space-y-24">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={item.id}
              className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 ${
                item.videoFirst ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Video Column */}
              <motion.div
                initial={{ opacity: 0, x: item.videoFirst ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${item.videoId}?controls=1&rel=0&playsinline=0`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </motion.div>

              {/* Testimonial Column */}
              <motion.div
                initial={{ opacity: 0, x: item.videoFirst ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-1/2 p-6 sm:p-10 rounded-2xl bg-[#0a0a0a] border border-white/10 flex flex-col justify-between space-y-8"
              >
                <p
                  className="text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  style={{
                    fontFamily: "'benzine', sans-serif",
                    fontSize: "clamp(13px, 1.1vw, 15px)",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  {item.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-contain border border-white/15 bg-white/5 p-1 shadow-md"
                  />
                  <div>
                    <h4
                      className="text-base sm:text-lg font-bold text-white tracking-wide"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-xs text-gray-400 font-mono tracking-wide mt-0.5"
                      style={{ fontFamily: "'benzine', 'Syne', sans-serif" }}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

