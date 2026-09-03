import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Quote } from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { Badge } from "../components/ui/Badge";
import { BookCallButton } from "../components/shared/BookCallButton";
import { caseStudies } from "../data/caseStudies";

export function CaseStudyDetail() {
  const { slug } = useParams();
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return <Navigate to="/case-studies" replace />;
  }

  return (
    <>
      <SEO
        title={`${study.title}`}
        description={study.shortDescription}
        ogImage={study.coverImage}
        canonical={`/case-studies/${study.slug}`}
      />

      <article className="pt-32 pb-24 bg-brand-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Back Navigation */}
          <FadeIn direction="left">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted hover:text-white transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} />
              <span>Back to all case studies</span>
            </Link>
          </FadeIn>

          {/* Header */}
          <div className="space-y-6">
            <FadeIn>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="primary" size="md">{study.category}</Badge>
                <span className="text-xs font-mono text-brand-muted">CLIENT: {study.client}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mt-4">
                {study.title}
              </h1>
            </FadeIn>
          </div>

          {/* Cover Media */}
          <FadeIn delay={0.2}>
            <div className="rounded-3xl overflow-hidden aspect-video bg-brand-surface border border-white/10 shadow-2xl">
              <img
                src={study.coverImage}
                alt={study.title}
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          {/* Metrics Highlight Banner */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl bg-brand-surface border border-white/10">
              {study.metrics.map((m, idx) => (
                <div key={idx} className="text-center sm:text-left space-y-1">
                  <p className="text-3xl sm:text-4xl font-display font-extrabold text-brand-lime">{m.value}</p>
                  <p className="text-xs font-mono text-brand-muted uppercase tracking-wider">{m.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Challenge & Solution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <FadeIn delay={0.35} className="space-y-4">
              <span className="text-xs font-mono text-brand-accent uppercase tracking-widest font-semibold">
                The Challenge
              </span>
              <h3 className="text-2xl font-bold font-display text-white">The Friction</h3>
              <p className="text-brand-muted text-base leading-relaxed">
                {study.challenge}
              </p>
            </FadeIn>

            <FadeIn delay={0.4} className="space-y-4">
              <span className="text-xs font-mono text-brand-lime uppercase tracking-widest font-semibold">
                The Solution
              </span>
              <h3 className="text-2xl font-bold font-display text-white">The Execution</h3>
              <p className="text-brand-muted text-base leading-relaxed">
                {study.solution}
              </p>
            </FadeIn>
          </div>

          {/* Deliverables List */}
          <FadeIn delay={0.45}>
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-xl font-bold font-display text-white">Production Deliverables</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {study.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-brand-text">
                    <CheckCircle2 size={18} className="text-brand-accent shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Client Testimonial Quote */}
          {study.testimonial && (
            <FadeIn delay={0.5}>
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-primary/10 via-brand-surface to-brand-primary/5 border border-brand-primary/20 space-y-6 relative overflow-hidden">
                <Quote className="text-brand-primary/20 w-24 h-24 absolute -bottom-4 -right-4 pointer-events-none" />
                <p className="text-lg sm:text-xl font-display text-white italic leading-relaxed">
                  "{study.testimonial.quote}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-bold text-white font-display">{study.testimonial.author}</p>
                  <p className="text-xs font-mono text-brand-muted">{study.testimonial.role}</p>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Bottom Booking CTA */}
          <FadeIn delay={0.55}>
            <div className="p-10 rounded-3xl bg-brand-surface border border-white/10 text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Ready for similar outcomes with your brand?
              </h3>
              <p className="text-brand-muted text-sm sm:text-base max-w-md mx-auto">
                Schedule a scoping session with our creative directors to discuss your media objectives.
              </p>
              <div className="pt-2">
                <BookCallButton variant="glow" size="lg" label="Book a Call" />
              </div>
            </div>
          </FadeIn>
        </div>
      </article>
    </>
  );
}
