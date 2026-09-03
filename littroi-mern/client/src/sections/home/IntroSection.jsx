import React from "react";
import { Compass, ShieldCheck, Zap } from "lucide-react";
import { FadeIn } from "../../components/animations/FadeIn";

export function IntroSection() {
  const pillars = [
    {
      icon: <Compass className="text-brand-accent" size={28} />,
      title: "Strategy first",
      desc: "We don't open Illustrator or After Effects before we understand your business mechanics. Every visual decision, hook, and cut is backed by an undeniable conversion reason."
    },
    {
      icon: <Zap className="text-brand-lime" size={28} />,
      title: "Craft over speed",
      desc: "Fast and forgettable isn't a win. We'd rather take the time to engineer something that permanently holds brand equity, dominates feeds, and converts for years to come."
    },
    {
      icon: <ShieldCheck className="text-brand-primary" size={28} />,
      title: "Honest partnership",
      desc: "We tell you when an idea isn't working. You're paying for perspective, strategic rigor, and elite execution—not passive yes-men."
    }
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-brand-surface/40 border-t border-b border-white/5 overflow-hidden">
      {/* Background glow element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-5 space-y-4">
            <FadeIn direction="left">
              <span className="text-xs font-mono tracking-widest text-brand-accent uppercase font-semibold">
                The Littroi Standard
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight mt-2">
                We turn complex products into cultural moments.
              </h2>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 space-y-6 text-brand-muted text-base sm:text-lg leading-relaxed">
            <FadeIn direction="right" delay={0.2}>
              <p>
                In a digital landscape where everyone has access to the same video editing tools and AI generators, mediocrity is automated. Standing out requires an uncompromising standard of craft, retention psychology, and bold aesthetic direction.
              </p>
              <p className="pt-2">
                Littroi operates at the intersection of cinematic post-production, product narrative engineering, and viral short-form growth. We don't just edit footage; we architect your brand's visual authority.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <FadeIn key={pillar.title} delay={0.15 * idx} className="h-full">
              <div className="glass-card rounded-3xl p-8 h-full flex flex-col justify-between border border-white/5 hover:border-brand-primary/30 group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary/10 transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-brand-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-brand-subtle">
                  <span>PILLAR 0{idx + 1}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
