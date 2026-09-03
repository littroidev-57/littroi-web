import React, { useState, useEffect } from "react";
import { ArrowUpRight, Briefcase, MapPin, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { SEO } from "../utils/seo";
import { PageHero } from "../sections/shared/PageHero";
import { FadeIn } from "../components/animations/FadeIn";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { jobsAPI } from "../services/api";
import { jobs as fallbackJobs } from "../data/jobs";

export function Careers() {
  const [jobList, setJobList] = useState(fallbackJobs);
  const [expandedJob, setExpandedJob] = useState(fallbackJobs[0]?.id || null);

  useEffect(() => {
    const loadJobs = async () => {
      const data = await jobsAPI.getAll();
      if (data && data.length) {
        setJobList(data);
        if (!expandedJob && data[0]) {
          setExpandedJob(data[0].id || data[0]._id);
        }
      }
    };
    loadJobs();
  }, []);

  const toggleJob = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <>
      <SEO
        title="Careers"
        description="Join the elite creative and media engineering unit at Littroi. We are hiring editors, 3D motion designers, and strategists."
        canonical="/careers"
      />

      <div className="flex flex-col">
        <PageHero
          tag="We're Hiring"
          title="Join Our Elite Creative Unit"
          subtitle="Work with top-tier tech startups, high-profile creators, and visionary founders on media that defines culture."
        />

        {/* Culture / Value Proposition */}
        <section className="py-16 bg-brand-surface/30 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={0.1}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-2xl">🌍</span>
                  <h3 className="text-lg font-bold font-display text-white">100% Global Remote</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Work from anywhere in the world. We evaluate output, taste, and speed—not hours sitting in a chair.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-lg font-bold font-display text-white">High-Impact Projects</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    No boring corporate slide decks. You will work on cinematic 3D renders, viral short-form, and flagship YouTube masters.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                  <span className="text-2xl">📈</span>
                  <h3 className="text-lg font-bold font-display text-white">Competitive Compensation</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Top-of-market rates with performance bonuses based on audience retention and project milestones.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Open Job Listings */}
        <section className="py-20 sm:py-28 bg-brand-bg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold font-display text-white">
                Current Openings ({jobList.length})
              </h2>
              <span className="text-xs font-mono text-brand-muted">
                Updated Weekly
              </span>
            </div>

            <div className="space-y-6">
              {jobList.map((job, idx) => {
                const jobId = job.id || job._id || `job-${idx}`;
                const isExpanded = expandedJob === jobId;
                return (
                  <FadeIn key={jobId} delay={0.1 * idx}>
                    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden transition-all duration-300">
                      {/* Job Header Summary */}
                      <div
                        onClick={() => toggleJob(jobId)}
                        className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-white/[0.02]"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="primary" size="sm">{job.department || "Production"}</Badge>
                            <span className="text-xs font-mono text-brand-lime font-semibold">{job.salary || "Competitive"}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brand-muted">
                            <span className="flex items-center gap-1"><MapPin size={13} /> {job.location || "Bareilly / Remote"}</span>
                            <span className="flex items-center gap-1"><Clock size={13} /> {job.type || job.employmentType || "Full-time"}</span>
                            <span className="flex items-center gap-1"><Briefcase size={13} /> {job.experience || "2+ Years"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Button
                            href={`mailto:${job.applyEmail || "careers@littroi.com"}?subject=Application for ${encodeURIComponent(job.title)}`}
                            variant="lime"
                            size="sm"
                            className="hidden sm:inline-flex"
                          >
                            Apply Now
                          </Button>
                          <div className="p-2 rounded-full bg-white/5 text-brand-muted">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="px-6 pb-8 sm:px-8 pt-4 border-t border-white/5 space-y-6">
                          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
                            {job.overview || job.description}
                          </p>

                          {job.responsibilities && Array.isArray(job.responsibilities) && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                                Key Responsibilities
                              </h4>
                              <div className="space-y-2">
                                {job.responsibilities.map((resp, rIdx) => (
                                  <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-muted">
                                    <CheckCircle2 size={15} className="text-brand-accent shrink-0 mt-0.5" />
                                    <span>{resp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {job.requirements && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                                Requirements
                              </h4>
                              <div className="space-y-2">
                                {Array.isArray(job.requirements) ? (
                                  job.requirements.map((req, reqIdx) => (
                                    <div key={reqIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-muted">
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-lime shrink-0 mt-2" />
                                      <span>{req}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-brand-muted">{job.requirements}</p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
                            <p className="text-xs font-mono text-brand-muted">
                              Send your reel/portfolio to: <strong className="text-white">{job.applyEmail || "careers@littroi.com"}</strong>
                            </p>
                            <Button
                              href={`mailto:${job.applyEmail || "careers@littroi.com"}?subject=Application for ${encodeURIComponent(job.title)}`}
                              variant="glow"
                              size="md"
                              icon={<ArrowUpRight size={16} />}
                            >
                              Submit Application
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

