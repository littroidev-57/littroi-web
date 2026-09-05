import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, ArrowUpRight, Send, CheckCircle2, Phone } from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { Button } from "../components/ui/Button";
import { SITE_CONFIG } from "../utils/constants";

import { contactAPI } from "../services/api";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.submit(formData);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact us"
        description="Tell us about your project and we’ll get back to you within 24 hours. Or just book a call directly."
        canonical="/contact-us"
      />

      <div className="bg-black text-white min-h-screen select-none overflow-hidden">
        {/* Contact Page Header (elementor-element-01c0f77) */}
        <section className="pt-32 sm:pt-44 pb-12 sm:pb-16 max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <span
              className="text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-white hover:text-[#B3FFC9] transition-colors duration-300 cursor-pointer select-none inline-block"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              — CONTACT
            </span>
          </motion.div>

          <div className="elementor-element elementor-element-01c0f77">
            <div className="elementor-element elementor-element-fb84f66 flex flex-col md:flex-row md:items-end justify-between gap-8 sm:gap-14">
              {/* Left: Heading (elementor-element-8a8d6d7) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="elementor-element elementor-element-8a8d6d7 shrink-0"
              >
                <h1
                  className="elementor-heading-title elementor-size-default m-0 text-white"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(32px, 4vw, 52px)",
                    fontWeight: 800,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Let's Work<br />
                  <span style={{ color: "#B3FFC9" }}>Together</span>
                </h1>
              </motion.div>

              {/* Right: Subtitle paragraph (elementor-element-170e791) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="elementor-element elementor-element-170e791 w-full max-w-[480px] md:pb-2"
              >
                <div className="page-header">
                  <p
                    className="sec-sub fade in m-0"
                    style={{
                      fontFamily: "'benzine', 'Benzin', sans-serif",
                      fontSize: "13px",
                      fontWeight: 200,
                      lineHeight: "22px",
                      color: "#FFFFFF94",
                    }}
                  >
                    Tell us about your project and we’ll get back to you within 24<br className="hidden sm:inline" /> hours. Or just book a call directly.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Calendly & Contact Container */}
        <section className="pb-24 sm:pb-32 bg-black relative">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 space-y-16">
            
            {/* Direct Calendly Embed Experience */}
            <FadeIn>
              <div className="glass-card rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl overflow-hidden relative">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-brand-lime animate-pulse" />
                    <h2 className="text-xl font-bold font-display text-white">Live Calendar Booking</h2>
                  </div>
                  <a
                    href={SITE_CONFIG.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-brand-accent hover:text-white flex items-center gap-1.5"
                  >
                    <span>Open in new tab</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                {/* Embedded Responsive Calendly iFrame */}
                <div className="w-full min-h-[700px] sm:min-h-[750px] rounded-2xl overflow-hidden bg-brand-surface border border-white/5">
                  <iframe
                    src={`${SITE_CONFIG.calendlyUrl}?embed_domain=${window.location.hostname}&embed_type=Inline&background_color=000000&text_color=ffffff&primary_color=b3ffc9`}
                    width="100%"
                    height="750"
                    frameBorder="0"
                    title="Schedule a Call with Littroi"
                    className="w-full h-full min-h-[750px]"
                  />
                </div>
              </div>
            </FadeIn>

            {/* General Inquiry & Contact Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
              {/* Left Column: Direct Info */}
              <div className="lg:col-span-5 space-y-8">
                <FadeIn direction="left">
                  <span className="text-xs font-mono tracking-widest text-brand-accent uppercase font-semibold">
                    Studio Information
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2">
                    Get in touch directly
                  </h3>
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                    If you have a custom project, partnership request, or wish to connect with our production leaders, reach out below.
                  </p>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-accent">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-brand-muted uppercase">E-Mail</p>
                        <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm font-semibold text-white hover:text-brand-accent transition-colors">
                          {SITE_CONFIG.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-brand-muted uppercase">Phone</p>
                        <a href={`tel:${SITE_CONFIG.phone}`} className="text-sm font-semibold text-white hover:text-brand-lime transition-colors">
                          {SITE_CONFIG.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-brand-muted uppercase">Headquarters</p>
                        <p className="text-sm font-semibold text-white">{SITE_CONFIG.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-mono text-brand-muted uppercase">Response Time</p>
                        <p className="text-sm font-semibold text-white">Within 12 Hours (Mon–Sat)</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Fast Contact Form */}
              <div className="lg:col-span-7">
                <FadeIn direction="right" delay={0.2}>
                  <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold font-display text-white">
                      Send a Message
                    </h3>

                    {submitted ? (
                      <div className="p-8 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 text-center space-y-3">
                        <CheckCircle2 size={36} className="text-brand-lime mx-auto" />
                        <h4 className="text-lg font-bold font-display text-white">Message Received</h4>
                        <p className="text-sm text-brand-muted">
                          Thank you for reaching out. Our team will review your inquiry and follow up shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-brand-muted uppercase">Your Name *</label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Your name"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-subtle focus:outline-none focus:border-brand-primary transition-colors text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-brand-muted uppercase">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="name@company.com"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-subtle focus:outline-none focus:border-brand-primary transition-colors text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono text-brand-muted uppercase">Company / Project URL</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="yourbrand.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-subtle focus:outline-none focus:border-brand-primary transition-colors text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-mono text-brand-muted uppercase">How can we help? *</label>
                          <textarea
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us about your podcast, video needs, or creative timeline..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-brand-subtle focus:outline-none focus:border-brand-primary transition-colors text-sm resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={loading}
                          className="w-full justify-center"
                          icon={<Send size={16} />}
                        >
                          {loading ? "Sending..." : "Submit Inquiry"}
                        </Button>
                      </form>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
