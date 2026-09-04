import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Rocket,
  Globe2,
  Mail
} from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { Badge } from "../components/ui/Badge";
import { jobsAPI } from "../services/api";
import { jobs as fallbackJobs } from "../data/jobs";

const MARQUEE_WORDS = [
  "Kill average",
  "Bareilly to the world",
  "Craft over comfort",
  "Get seen, get chosen",
  "No boring work",
  "Own the outcome",
  "Cuts that get watched",
  "Bold or nothing"
];

const CULTURE_PILLARS = [
  {
    num: "01",
    title: "Move with intent",
    text: "We ship fast, learn faster, and don't wait for permission to try something new. Every person owns their work end-to-end."
  },
  {
    num: "02",
    title: "Average never ships",
    text: "Every copy, cut and campaign gets picked apart until it's actually good — not just done. If it's not sharp enough to get seen, it goes back to the drawing board."
  },
  {
    num: "03",
    title: "No ceiling on ambition",
    text: "We started in Bareilly, now we build for brands across India. The city's small — what you can achieve here isn't."
  }
];

const CORE_VALUES = [
  {
    icon: <Target className="w-6 h-6 text-[#B3FFC9]" />,
    title: "Real work, day one",
    description: "No busywork. You'll be on real client projects from your first week — with ownership, not just tasks."
  },
  {
    icon: <Rocket className="w-6 h-6 text-[#B3FFC9]" />,
    title: "Fast growth",
    description: "We move quickly, learn together, and promote people based on results — not tenure."
  },
  {
    icon: <Globe2 className="w-6 h-6 text-[#B3FFC9]" />,
    title: "Remote-first",
    description: "Flexible hours, remote culture, and a team that respects your time and creative process."
  }
];

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
        title="Careers — Join Littroi Media"
        description="Join the team behind the cut. We are hiring editors, designers, sales, and operations professionals who take their craft seriously."
        canonical="/careers"
      />

      <div className="flex flex-col bg-black text-white min-h-screen select-none">

        {/* ==================== HERO SECTION ==================== */}
        <section className="pt-32 sm:pt-40 pb-16 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto space-y-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#B3FFC9]" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-white font-bold">
              CAREERS
            </span>
          </div>

          {/* Full Width Main Heading */}
          <div>
            <h1
              className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-white tracking-tight leading-[1.05] m-0"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join the team <br />
              <span style={{ color: "#B3FFC9" }}>behind the cut.</span>
            </h1>
          </div>

          {/* Subtitle (Left) & 3 Counters (Right) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12 pt-4">
            <div className="max-w-lg">
              <p
                className="m-0 leading-relaxed"
                style={{
                  fontFamily: "'benzine', 'Syne', sans-serif",
                  fontSize: "14px",
                  fontWeight: 200,
                  lineHeight: "24px",
                  color: "#FFFFFF94"
                }}
              >
                From editing to sales to ops, we’re hiring people who take their craft seriously — no matter the role. Based in Bareilly, working with brands who refuse to be average. If you own your work, there’s a seat for you here.
              </p>
            </div>

            {/* 3 Metric Counters */}
            <div className="flex items-center justify-start lg:justify-end gap-10 sm:gap-14">
              <div className="space-y-1 text-left">
                <div
                  className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  8+
                </div>
                <div className="text-[11px] uppercase font-mono text-white/40 tracking-wider">
                  Open roles
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div
                  className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  15+
                </div>
                <div className="text-[11px] uppercase font-mono text-white/40 tracking-wider">
                  Team members
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div
                  className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  100%
                </div>
                <div className="text-[11px] uppercase font-mono text-white/40 tracking-wider">
                  On-Site
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CONTINUOUS MARQUEE RIBBON ==================== */}
        <div className="border-t border-b border-white/[0.07] py-3.5 bg-[#B3FFC9]/[0.02] overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {[...Array(3)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center">
                {MARQUEE_WORDS.map((word, wIdx) => (
                  <React.Fragment key={`${loopIdx}-${wIdx}`}>
                    <span
                      className="px-7 text-[11px] font-bold tracking-[0.16em] uppercase text-white/30 font-mono"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3FFC9] opacity-30 flex-shrink-0" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== CULTURE SECTION (3 COLUMNS) ==================== */}
        <section className="border-b border-white/[0.08]">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              {CULTURE_PILLARS.map((pillar, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="p-8 sm:p-12 lg:p-14 hover:bg-[#B3FFC9]/[0.02] transition-colors duration-300 space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#B3FFC9] tracking-wider mb-5">
                        {pillar.num}
                      </div>
                      <h3
                        className="text-lg sm:text-xl font-bold text-white tracking-tight mb-3"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {pillar.title}
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-light">
                        {pillar.text}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== 3 CORE VALUES (ICON BOXES) ==================== */}
        {/* <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-16 max-w-[1400px] w-full mx-auto border-b border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((val, idx) => (
              <FadeIn key={idx} delay={0.1 * idx}>
                <div className="p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 hover:border-[#B3FFC9]/30 transition-all duration-300 space-y-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {val.icon}
                  </div>
                  <h3
                    className="text-lg font-bold text-white group-hover:text-[#B3FFC9] transition-colors"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {val.title}
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section> */}

        {/* ==================== OPEN JOB POSITIONS ACCORDION ==================== */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 max-w-[1100px] w-full mx-auto space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Current Openings ({jobList.length})
              </h2>
              <p className="text-xs text-white/40 font-mono mt-1">
                Roles updated weekly — apply directly with your reel or portfolio
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#132c1e] text-[#B3FFC9] border border-[#B3FFC9]/30 text-xs font-mono font-bold">
              We're Hiring
            </span>
          </div>

          <div className="space-y-5">
            {jobList.map((job, idx) => {
              const jobId = job.id || job._id || `job-${idx}`;
              const isExpanded = expandedJob === jobId;
              return (
                <FadeIn key={jobId} delay={0.08 * idx}>
                  <div className="rounded-3xl bg-[#0c0c0c] border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
                    {/* Job Header Summary */}
                    <div
                      onClick={() => toggleJob(jobId)}
                      className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 select-none hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full bg-[#161616] text-[#B3FFC9] border border-[#B3FFC9]/25 text-[10px] font-bold uppercase tracking-wider">
                            {job.department || "Post-Production"}
                          </span>
                          <span className="text-xs font-mono text-white/60 font-semibold">
                            {job.salary || "Competitive"}
                          </span>
                        </div>

                        <h3
                          className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/40">
                          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-[#B3FFC9]" /> {job.location || "Bareilly (Studio / Remote)"}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5"><Clock size={13} /> {job.type || job.employmentType || "Full-time"}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5"><Briefcase size={13} /> {job.experience || "2+ Years"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <a
                          href={`mailto:${job.applyEmail || "careers@littroi.com"}?subject=Application for ${encodeURIComponent(job.title)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-5 py-2.5 rounded-full bg-[#B3FFC9] hover:bg-[#9effba] text-black font-bold text-xs uppercase tracking-wider transition-all hidden sm:inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(179,255,201,0.2)]"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          Apply Now
                        </a>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-8 sm:px-8 pt-4 border-t border-white/5 space-y-6">
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                          {job.overview || job.description}
                        </p>

                        {/* Key Responsibilities */}
                        {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                          <div className="space-y-3">
                            <h4
                              className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider"
                              style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                              Key Responsibilities
                            </h4>
                            <div className="space-y-2.5">
                              {job.responsibilities.map((resp, rIdx) => (
                                <div key={rIdx} className="flex items-start gap-3 text-xs sm:text-sm text-white/60">
                                  <CheckCircle2 size={16} className="text-[#B3FFC9] shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Requirements */}
                        {((Array.isArray(job.requirements) && job.requirements.length > 0) || (typeof job.requirements === "string" && job.requirements.trim().length > 0)) && (
                          <div className="space-y-3">
                            <h4
                              className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider"
                              style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                              Requirements
                            </h4>
                            <div className="space-y-2.5">
                              {Array.isArray(job.requirements) ? (
                                job.requirements.map((req, reqIdx) => (
                                  <div key={reqIdx} className="flex items-start gap-3 text-xs sm:text-sm text-white/60">
                                    <div className="w-2 h-2 rounded-full bg-[#B3FFC9] shrink-0 mt-1.5" />
                                    <span>{req}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-white/60">{job.requirements}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Footer / Submit Application Row */}
                        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
                          <p className="text-xs font-mono text-white/50">
                            Send your reel/portfolio to: <strong className="text-white">{job.applyEmail || "careers@littroi.com"}</strong>
                          </p>
                          <a
                            href={`mailto:${job.applyEmail || "careers@littroi.com"}?subject=Application for ${encodeURIComponent(job.title)}`}
                            className="px-6 py-3 rounded-full bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black border border-[#B3FFC9]/30 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            <span>Submit Application</span>
                            <ArrowUpRight size={15} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
