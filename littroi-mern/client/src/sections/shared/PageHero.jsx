import React from "react";
import { FadeIn } from "../../components/animations/FadeIn";
import { Badge } from "../../components/ui/Badge";

export function PageHero({
  tag,
  title,
  subtitle,
  children
}) {
  return (
    <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden bg-brand-bg border-b border-white/5">
      {/* Radial lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
        <FadeIn direction="down">
          {tag && (
            <div className="mb-4">
              <Badge variant="primary" size="md">
                {tag}
              </Badge>
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
        </FadeIn>

        {subtitle && (
          <FadeIn delay={0.2}>
            <p className="text-lg sm:text-xl text-brand-muted mt-6 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </FadeIn>
        )}

        {children && (
          <FadeIn delay={0.3} className="mt-8">
            {children}
          </FadeIn>
        )}
      </div>
    </section>
  );
}
