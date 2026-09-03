import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { FadeIn } from "../../components/animations/FadeIn";
import { BookCallButton } from "../../components/shared/BookCallButton";

export function CtaSection() {
  return (
    <section className="py-28 sm:py-36 relative overflow-hidden bg-brand-bg">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-primary/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card p-10 sm:p-16 md:p-20 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-lime" />

          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
              <Sparkles size={14} className="text-brand-lime" />
              <span className="text-xs font-mono tracking-wider text-brand-muted uppercase">
                Ready to scale your visual brand?
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
              Let's build something worth talking about.
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
              Book a 30-minute strategic consultation with our creative directors to dissect your current media engine and outline a high-converting production roadmap.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <BookCallButton
                size="lg"
                variant="glow"
                label="Book a Strategy Call"
                className="w-full sm:w-auto text-base px-10 py-4 shadow-2xl"
              />
            </div>

            {/* Micro reassurance checklist */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-brand-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-lime" />
                <span>30-min strategy roadmap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-lime" />
                <span>No high-pressure sales pitch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-lime" />
                <span>Actionable creative audit</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
