import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  Video,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  XCircle,
  ExternalLink
} from "lucide-react";
import { SEO } from "../utils/seo";
import { CountUpNumber } from "../components/animations/CountUpNumber";
import { SITE_CONFIG } from "../utils/constants";

export function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What should I prepare before our strategy call?",
      answer:
        "Nothing formal! Just bring links to your existing raw footage, YouTube channel, podcast, or social handles. If you haven't launched yet, just come with your core target audience and the vision for your brand. We'll audit everything live on screen."
    },
    {
      question: "How quickly can production kick off after our call?",
      answer:
        "Once we align on the right scope and package, onboarding takes less than 48 hours. We configure your private communication channel, ingest your branding guidelines, and begin editing your first batch immediately."
    },
    {
      question: "What is your typical turnaround time per episode or clip?",
      answer:
        "Short-form clips (Reels/Shorts/TikToks) are typically delivered within 24–48 hours. Full-length multi-camera podcast master episodes with audio mastering, sound design, color grade, and custom lower-thirds are delivered in 3–4 business days."
    },
    {
      question: "How do revisions work if we need changes?",
      answer:
        "We use modern timestamped review software (Frame.io) where you can leave direct notes on exact seconds. We provide quick turnaround on revisions to ensure every release meets broadcast-level perfection before going public."
    },
    {
      question: "Do you work with creators and brands outside India?",
      answer:
        "Yes! A significant portion of our clients are based in the US, UK, Canada, and UAE. Our team operates with streamlined async workflows and flexible hours to seamlessly accommodate global time zones."
    },
    {
      question: "What if I have a quick question and prefer not to book a call?",
      answer:
        "No problem at all! You can reach out directly via email at Info@Littroi.com or ping our studio via WhatsApp. Our leadership personally reviews and responds to every message within 24 hours."
    }
  ];

  const agendaSteps = [
    {
      number: "01",
      title: "Content & Channel Audit",
      description:
        "We dissect your existing videos, retention graphs, pacing, and visual branding to pinpoint where you're losing viewers.",
      icon: Sparkles
    },
    {
      number: "02",
      title: "High-Retention Strategy",
      description:
        "We design a tailored content blueprint — from magnetic hooks and sound design to multi-platform viral distribution.",
      icon: Video
    },
    {
      number: "03",
      title: "Transparent Scope & Pricing",
      description:
        "No hidden fees or surprises. You receive a structured proposal detailing exact weekly deliverables, timelines, and pricing.",
      icon: ShieldCheck
    }
  ];

  const fitCriteria = {
    ideal: [
      "Founders, creators, and brands producing podcasts, YouTube, or SaaS content",
      "Teams seeking hands-off, elite post-production without hiring an in-house department",
      "Creators who care about retention, sound design, and premium motion graphics",
      "Businesses aiming to turn organic video content into scalable pipeline & authority"
    ],
    notIdeal: [
      "Those looking for low-effort, $5 generic template cuts without narrative storytelling",
      "Projects without raw audio/video footage or plans to record",
      "One-off rush jobs with no interest in compounding long-term media presence"
    ]
  };

  return (
    <>
      <SEO
        title="Contact Us | Book a Strategy Call | Littroi"
        description="Tell us about your project and we'll get back to you within 24 hours. Or book a 1-on-1 discovery call directly on our calendar."
        canonical="/contact-us"
      />

      <div className="bg-black text-white min-h-screen select-none overflow-hidden">
        {/* =========================================================================
            1. HERO SECTION
           ========================================================================= */}
        <section className="pt-32 sm:pt-40 pb-10 sm:pb-14 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span
              className="text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase text-white/70 select-none inline-flex items-center gap-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              — CONTACT
            </span>
          </motion.div>

          {/* Heading and Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-14 pb-8 border-b border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 max-w-[700px]"
            >
              <h1
                className="m-0 text-white font-extrabold"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(32px, 4.2vw, 54px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                Let's Work<br />
                <span style={{ color: "#B3FFC9" }}>Together</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[460px] lg:pb-3"
            >
              <p
                className="m-0 text-white/70 text-sm sm:text-base leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Tell us about your project and we’ll get back to you within 24
                hours. Or just book a call directly.
              </p>


            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            2. CALENDLY CALL SCHEDULER SECTION (FIRST)
           ========================================================================= */}
        <section id="calendar-section" className="pb-16 sm:pb-24 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-3xl overflow-hidden bg-[#070707] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative"
          >
            {/* Top Bar (Clean, without the 15-min / 30-min buttons) */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9] animate-pulse" />
                <span
                  className="text-sm font-semibold tracking-wider text-white uppercase"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Direct Booking Calendar
                </span>
              </div>

              <a
                href={SITE_CONFIG.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B3FFC9] hover:underline"
              >
                <span>Open in full tab</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Calendly Inline Frame */}
            <div className="w-full min-h-[720px] sm:min-h-[780px] bg-[#070707]">
              <iframe
                src={`${SITE_CONFIG.calendlyUrl}?embed_domain=${typeof window !== "undefined" ? window.location.hostname : "littroi.com"}&embed_type=Inline&background_color=000000&text_color=ffffff&primary_color=b3ffc9`}
                width="100%"
                height="780"
                frameBorder="0"
                title="Schedule a Strategy Call with Littroi"
                className="w-full h-full min-h-[720px] sm:min-h-[780px] block"
              />
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            3. WHAT TO EXPECT (3-STEP DISCOVERY AGENDA)
           ========================================================================= */}
        <section className="py-14 sm:py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-white/10">
          <div className="text-left mb-10">
            <span
              className="text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-2"
            >
              WHAT TO EXPECT
            </span>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Our 3-Step Discovery Agenda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agendaSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#B3FFC9]/40 hover:bg-white/[0.04] transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform duration-300">
                        <IconComponent size={22} />
                      </div>
                      <span
                        className="text-3xl font-black text-white/20 group-hover:text-[#B3FFC9]/30 transition-colors"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-bold text-white mb-3"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed m-0">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            4. WHO YOU'LL BE SPEAKING WITH (FOUNDER & LEADERSHIP)
           ========================================================================= */}
        <section className="py-14 sm:py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-white/10">
          <div className="rounded-3xl p-8 sm:p-12 bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="relative group max-w-[280px] sm:max-w-[320px] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#111]">
                  <img
                    src="https://res.cloudinary.com/eikgki2a/image/upload/v1788583992/Vishal-Singh-Mahar-Founder-scaled.png"
                    alt="Vishal Singh Mahar"
                    className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/eikgki2a/image/upload/v1788584201/Vishal-Singh-Mahar-Founder-685x1024_1.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B3FFC9] font-bold block mb-1">
                      Direct Strategy Session
                    </span>
                    <h4 className="text-lg font-bold text-white m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                      Vishal Singh Mahar
                    </h4>
                    <p className="text-xs text-white/70 m-0">Founder &amp; CEO</p>
                  </div>
                </div>
              </div>

              {/* Leadership Bio & Promise */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-2">
                    DIRECT ACCESS TO LEADERSHIP
                  </span>
                  <h3
                    className="text-2xl sm:text-4xl font-extrabold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    You Speak with Builders, Not Sales Reps.
                  </h3>
                </div>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed m-0">
                  "At Littroi, we don't pass you around through layers of SDRs or account executives who have never edited a frame in their life. When you schedule a call, you speak directly with the creative leaders who strategize and supervise our editing suites."
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#B3FFC9]/30 transition-all duration-300">
                    <p className="text-xl sm:text-2xl font-black text-[#B3FFC9] m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                      <CountUpNumber value="100M+" duration={2.2} delay={0.1} />
                    </p>
                    <p className="text-xs text-white/60 m-0 mt-1">Views Generated</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#B3FFC9]/30 transition-all duration-300">
                    <p className="text-xl sm:text-2xl font-black text-[#B3FFC9] m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                      <CountUpNumber value="1,200+" duration={2.2} delay={0.25} />
                    </p>
                    <p className="text-xs text-white/60 m-0 mt-1">Videos Mastered</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1 hover:border-[#B3FFC9]/30 transition-all duration-300">
                    <p className="text-xl sm:text-2xl font-black text-[#B3FFC9] m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                      <CountUpNumber value="40+" duration={2.2} delay={0.4} />
                    </p>
                    <p className="text-xs text-white/60 m-0 mt-1">Channels Scaled</p>
                  </div>
                </div>

                {/* Social Icon Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {/* LinkedIn */}
                  <a
                    href={SITE_CONFIG.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#095196] hover:scale-110 hover:shadow-[0_0_18px_rgba(10,102,194,0.6)] transition-all duration-300 shadow-md cursor-pointer shrink-0"
                    title="Connect on LinkedIn"
                    aria-label="Connect on LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 448 512">
                      <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={SITE_CONFIG.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:scale-110 hover:shadow-[0_0_18px_rgba(225,48,108,0.6)] transition-all duration-300 shadow-md cursor-pointer shrink-0"
                    style={{
                      background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                    }}
                    title="Instagram Profile"
                    aria-label="Instagram Profile"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 448 512">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. IS LITTROI RIGHT FOR YOU? (QUALIFYING COMPARISON)
           ========================================================================= */}
        <section className="py-14 sm:py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-white/10">
          <div className="text-left mb-10">
            <span className="text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-2">
              QUALIFYING PARTNERSHIP
            </span>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Is Littroi the Right Fit for You?
            </h2>
            <p className="text-white/60 text-sm sm:text-base max-w-xl mt-2">
              We operate as an agile creative content arm for a selected number of brands and creators at any given time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Ideal Fit */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-[#B3FFC9]/30 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#B3FFC9]/10 border border-[#B3FFC9]/30 flex items-center justify-center text-[#B3FFC9]">
                  <UserCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-white m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                  We are your ideal partner if:
                </h3>
              </div>

              <ul className="space-y-4">
                {fitCriteria.ideal.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#B3FFC9] shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Not an Ideal Fit */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <XCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-white m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                  We may NOT be a fit if:
                </h3>
              </div>

              <ul className="space-y-4">
                {fitCriteria.notIdeal.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-400/80 shrink-0 mt-0.5" />
                    <span className="text-sm text-white/60 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. PRE-BOOKING FAQ ACCORDION
           ========================================================================= */}
        <section className="py-14 sm:py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-white/10">
          <div className="text-left mb-10">
            <span className="text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Questions Before Scheduling?
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <span
                      className="text-base sm:text-lg font-bold text-white pr-4"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-[#B3FFC9]"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-white/70 leading-relaxed border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            7. DIRECT STUDIO COORDINATES
           ========================================================================= */}
        <section className="py-14 sm:py-20 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 border-t border-white/10">
          <div className="mb-10 text-left">
            <span className="text-xs font-mono tracking-widest text-[#B3FFC9] uppercase font-semibold block mb-2">
              PREFER TEXT OR DIRECT REACHOUT?
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Direct Studio Coordinates
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-2">
              If you don't need a call right now, reach our desk directly below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card with Copy Feature */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 flex items-center justify-center text-[#B3FFC9]">
                  <Mail size={20} />
                </div>
                <h4 className="text-lg font-bold text-white m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Direct Email
                </h4>
                <p className="text-xs text-white/50 m-0">
                  Guaranteed response within 12 business hours.
                </p>
                <p className="text-sm font-semibold text-white pt-1 m-0">
                  {SITE_CONFIG.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#B3FFC9] text-black text-xs font-bold hover:bg-[#9effba] transition-all text-center"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Compose Email
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check size={16} className="text-[#B3FFC9]" /> : <Copy size={16} />}
                </button>
              </div>
            </div>


            {/* Studio Headquarters Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#B3FFC9]/10 border border-[#B3FFC9]/20 flex items-center justify-center text-[#B3FFC9]">
                  <MapPin size={20} />
                </div>
                <h4 className="text-lg font-bold text-white m-0" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Production HQ
                </h4>
                <p className="text-xs text-white/50 m-0">
                  Our core post-production suites &amp; creative studio.
                </p>
                <p className="text-sm font-semibold text-white/90 pt-1 leading-snug m-0">
                  {SITE_CONFIG.address}
                </p>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
