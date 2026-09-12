import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  Mail,
  X,
  Send,
  Sparkles,
  ExternalLink,
  FileText,
  AlertCircle
} from "lucide-react";
import { SEO } from "../utils/seo";
import { FadeIn } from "../components/animations/FadeIn";
import { Badge } from "../components/ui/Badge";
import { jobsAPI, jobApplicationsAPI } from "../services/api";
import { jobs as fallbackJobs } from "../data/jobs";

// Animated counter component for Career stats with reload and scroll animation
function CareerStatCounter({ value, suffix = "", duration = 1800, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frameId;
    let startTimestamp = null;
    let timeoutId = null;
    const target = parseInt(value, 10) || 0;

    const runCountAnimation = () => {
      setCount(0);
      startTimestamp = null;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) clearTimeout(timeoutId);

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Smooth ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);
        setCount(current);
        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      timeoutId = setTimeout(() => {
        frameId = window.requestAnimationFrame(step);
      }, delay * 1000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountAnimation();
          } else {
            setCount(0);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <span>{count}</span>
      {suffix && (
        <span className="ml-0.5" style={{ color: "#B3FFC9" }}>
          {suffix}
        </span>
      )}
    </span>
  );
}



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

const formatSalaryInRupees = (salary) => {
  if (!salary) return " Competitive";
  const str = String(salary).trim();
  if (str.toLowerCase() === "competitive") return " Competitive";
  if (str.includes("₹") || str.includes("INR") || str.includes("Rs")) return str;
  if (str.includes("$")) {
    return str.replace(/\$/g, "₹");
  }
  return `₹${str}`;
};

// Robust list parser for bulleted/multiline responsibilities & requirements
const parseListItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .flatMap((item) => (typeof item === "string" ? item.split("\n") : []))
      .map((item) => (typeof item === "string" ? item.replace(/^[\s•\-\*\d\.\)\:]+/, "").trim() : ""))
      .filter(Boolean);
  }
  if (typeof data === "string") {
    return data
      .split("\n")
      .map((line) => line.replace(/^[\s•\-\*\d\.\)\:]+/, "").trim())
      .filter(Boolean);
  }
  return [];
};

export function Careers() {
  const [jobList, setJobList] = useState(fallbackJobs);
  const [expandedJob, setExpandedJob] = useState(fallbackJobs[0]?.id || null);

  // Application Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    email: "",
    phone: "",
    portfolioUrl: "",
    resumeUrl: "",
    experience: "1-2 Years",
    coverLetter: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [submitAppSuccess, setSubmitAppSuccess] = useState(false);
  const [submitAppError, setSubmitAppError] = useState("");

  const handleOpenApplyModal = (job) => {
    setSelectedJobForApply(job);
    setSubmitAppSuccess(false);
    setSubmitAppError("");
    setFieldErrors({});
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setFieldErrors({});
    if (submitAppSuccess) {
      setApplicantForm({
        name: "",
        email: "",
        phone: "",
        portfolioUrl: "",
        resumeUrl: "",
        experience: "1-2 Years",
        coverLetter: ""
      });
      setSubmitAppSuccess(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = applicantForm.name.trim();
    const trimmedEmail = applicantForm.email.trim();
    const trimmedPhone = applicantForm.phone.trim();
    const trimmedPortfolio = applicantForm.portfolioUrl.trim();
    const trimmedResume = applicantForm.resumeUrl.trim();
    const trimmedCover = applicantForm.coverLetter.trim();
    const trimmedExperience = (applicantForm.experience || "").trim();

    // Name validation (Required)
    if (!trimmedName) {
      errors.name = "Full name is required";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.name = "Name should contain letters and standard characters only";
    }

    // Email validation (Required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmedEmail) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    // Phone validation (Required)
    if (!trimmedPhone) {
      errors.phone = "Phone number is required";
    } else {
      const digits = trimmedPhone.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) {
        errors.phone = "Phone number must be between 7 and 15 digits";
      }
    }

    // Experience validation (Required)
    if (!trimmedExperience) {
      errors.experience = "Please select your experience level";
    }

    // Resume URL validation (Required)
    const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;
    if (!trimmedResume) {
      errors.resumeUrl = "Resume / CV link is required";
    } else if (!/^https?:\/\//i.test(trimmedResume)) {
      errors.resumeUrl = "URL must start with http:// or https://";
    } else if (!urlRegex.test(trimmedResume)) {
      errors.resumeUrl = "Please enter a valid web URL (e.g. https://drive.google.com/...)";
    }

    // Portfolio URL validation (Required)
    if (!trimmedPortfolio) {
      errors.portfolioUrl = "Portfolio / Showreel link is required";
    } else if (!/^https?:\/\//i.test(trimmedPortfolio)) {
      errors.portfolioUrl = "URL must start with http:// or https://";
    } else if (!urlRegex.test(trimmedPortfolio)) {
      errors.portfolioUrl = "Please enter a valid web URL (e.g. https://vimeo.com/...)";
    }

    // Cover Letter validation (Optional)
    if (trimmedCover && trimmedCover.length < 5) {
      errors.coverLetter = "Cover note should be at least 5 characters if provided";
    }

    return errors;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitAppError("Please fix the highlighted errors before submitting.");
      return;
    }
    setFieldErrors({});
    setIsSubmittingApp(true);
    setSubmitAppError("");
    try {
      await jobApplicationsAPI.submit({
        jobId: selectedJobForApply?.id || selectedJobForApply?._id || null,
        jobTitle: selectedJobForApply?.title || "Career Application",
        ...applicantForm
      });
      setSubmitAppSuccess(true);
    } catch (err) {
      setSubmitAppError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmittingApp(false);
    }
  };

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
              — CAREERS
            </span>
          </motion.div>

          {/* Full Width Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-white tracking-tight leading-[1.05] m-0"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Join the team <br />
              <span style={{ color: "#B3FFC9" }}>behind the cut.</span>
            </h1>
          </motion.div>

          {/* Subtitle (Left) & 3 Counters (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12 pt-4"
          >
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


          </motion.div>
        </section>


        {/* ==================== OPEN JOB POSITIONS ACCORDION ==================== */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 max-w-[1100px] w-full mx-auto space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Current Openings
              </h2>
              <p className="text-xs text-white/40 font-mono mt-1">
                Roles updated weekly — apply directly with your reel or portfolio
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#132c1e] text-[#B3FFC9] border border-[#B3FFC9]/30 text-xs font-mono font-bold hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer select-none">
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
                          <span className="text-xs font-mono text-white/70 font-semibold inline-flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                            {formatSalaryInRupees(job.salary)}
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

                      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApplyModal(job);
                          }}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#B3FFC9] hover:bg-[#9effba] text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(179,255,201,0.2)] active:scale-95"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          Apply Now
                        </button>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-8 sm:px-8 pt-5 border-t border-white/5 space-y-6">
                        {(job.overview || job.description) && (
                          <p className="text-white/70 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {job.overview || job.description}
                          </p>
                        )}

                        {/* Key Responsibilities */}
                        {(() => {
                          const responsibilities = parseListItems(job.responsibilities);
                          if (responsibilities.length === 0) return null;
                          return (
                            <div className="space-y-3 pt-2">
                              <h4
                                className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                <span className="w-2 h-2 rounded-full bg-[#B3FFC9]" />
                                Key Responsibilities
                              </h4>
                              <div className="grid grid-cols-1 gap-2.5">
                                {responsibilities.map((resp, rIdx) => (
                                  <div key={rIdx} className="flex items-start gap-3 text-xs sm:text-sm text-white/70 leading-relaxed">
                                    <CheckCircle2 size={16} className="text-[#B3FFC9] shrink-0 mt-0.5" />
                                    <span>{resp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Requirements */}
                        {(() => {
                          const requirements = parseListItems(job.requirements);
                          if (requirements.length === 0) return null;
                          return (
                            <div className="space-y-3 pt-2">
                              <h4
                                className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                <span className="w-2 h-2 rounded-full bg-[#B3FFC9]" />
                                Requirements &amp; Skills
                              </h4>
                              <div className="grid grid-cols-1 gap-2.5">
                                {requirements.map((req, reqIdx) => (
                                  <div key={reqIdx} className="flex items-start gap-3 text-xs sm:text-sm text-white/70 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B3FFC9] shrink-0 mt-2" />
                                    <span>{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* ==================== APPLICATION FORM MODAL ==================== */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div
              className="relative w-full max-w-xl bg-[#0c0c0c] border border-white/10 rounded-[28px] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(179,255,201,0.05)] my-auto overflow-hidden text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle green ambient accent line */}
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseApplyModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {submitAppSuccess ? (
                /* Success State */
                <div className="py-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#183626] border border-[#B3FFC9]/40 text-[#B3FFC9] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(179,255,201,0.25)]">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3
                      className="text-2xl font-bold text-white tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Application Submitted!
                    </h3>
                    <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{applicantForm.name}</strong>. We have received your application for{" "}
                      <span className="text-[#B3FFC9] font-medium">{selectedJobForApply?.title}</span>. Our production team will review your portfolio and reach out.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleCloseApplyModal}
                      className="px-8 py-3 rounded-full bg-[#B3FFC9] text-black hover:bg-[#9effba] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(179,255,201,0.3)] cursor-pointer"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Form State */
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-0.5 rounded-full bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] text-[10px] font-bold uppercase tracking-wider">
                        {selectedJobForApply?.department || "Careers"}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        {selectedJobForApply?.type || "Full-time"}
                      </span>
                      {selectedJobForApply?.salary && (
                        <>
                          <span className="text-white/20 font-mono">·</span>
                          <span className="text-xs text-[#B3FFC9] font-mono font-medium">
                            {formatSalaryInRupees(selectedJobForApply.salary)}
                          </span>
                        </>
                      )}
                    </div>
                    <h3
                      className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Apply for {selectedJobForApply?.title || "Role"}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50 mt-1">
                      Share your details and showreel. We value hands-on craft and attention to detail.
                    </p>
                  </div>

                  {submitAppError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{submitAppError}</span>
                    </div>
                  )}

                  <form onSubmit={handleApplySubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Full Name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={applicantForm.name}
                          onChange={(e) => {
                            setApplicantForm({ ...applicantForm, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                            if (submitAppError) setSubmitAppError("");
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${fieldErrors.name
                            ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                            : "border border-white/10 focus:border-[#B3FFC9]"
                            }`}
                        />
                        {fieldErrors.name && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <AlertCircle size={11} className="shrink-0" />
                            <span>{fieldErrors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Email Address <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          value={applicantForm.email}
                          onChange={(e) => {
                            setApplicantForm({ ...applicantForm, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                            if (submitAppError) setSubmitAppError("");
                          }}
                          placeholder="rahul@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${fieldErrors.email
                            ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                            : "border border-white/10 focus:border-[#B3FFC9]"
                            }`}
                        />
                        {fieldErrors.email && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <AlertCircle size={11} className="shrink-0" />
                            <span>{fieldErrors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Phone Number <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="tel"
                          value={applicantForm.phone}
                          onChange={(e) => {
                            setApplicantForm({ ...applicantForm, phone: e.target.value });
                            if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                            if (submitAppError) setSubmitAppError("");
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${fieldErrors.phone
                            ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                            : "border border-white/10 focus:border-[#B3FFC9]"
                            }`}
                        />
                        {fieldErrors.phone && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <AlertCircle size={11} className="shrink-0" />
                            <span>{fieldErrors.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* Experience Level */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Experience Level <span className="text-red-500 font-bold">*</span>
                        </label>
                        <select
                          value={applicantForm.experience}
                          onChange={(e) => {
                            setApplicantForm({ ...applicantForm, experience: e.target.value });
                            if (fieldErrors.experience) setFieldErrors((prev) => ({ ...prev, experience: "" }));
                            if (submitAppError) setSubmitAppError("");
                          }}
                          className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm focus:outline-none transition-all cursor-pointer ${fieldErrors.experience
                            ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                            : "border border-white/10 focus:border-[#B3FFC9]"
                            }`}
                        >
                          <option value="Fresher / < 1 Year">Fresher / &lt; 1 Year</option>
                          <option value="1-2 Years">1 - 2 Years</option>
                          <option value="3-5 Years">3 - 5 Years</option>
                          <option value="5+ Years">5+ Years</option>
                        </select>
                        {fieldErrors.experience && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                            <AlertCircle size={11} className="shrink-0" />
                            <span>{fieldErrors.experience}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Resume / CV Link */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Resume / CV Link <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[10px] text-white/40 font-mono">Google Drive, Notion, LinkedIn</span>
                      </div>
                      <input
                        type="url"
                        value={applicantForm.resumeUrl}
                        onChange={(e) => {
                          setApplicantForm({ ...applicantForm, resumeUrl: e.target.value });
                          if (fieldErrors.resumeUrl) setFieldErrors((prev) => ({ ...prev, resumeUrl: "" }));
                          if (submitAppError) setSubmitAppError("");
                        }}
                        placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
                        className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${fieldErrors.resumeUrl
                          ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                          : "border border-white/10 focus:border-[#B3FFC9]"
                          }`}
                      />
                      {fieldErrors.resumeUrl && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                          <AlertCircle size={11} className="shrink-0" />
                          <span>{fieldErrors.resumeUrl}</span>
                        </p>
                      )}
                    </div>

                    {/* Portfolio / Showreel */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Portfolio / Showreel URL <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[10px] text-white/40 font-mono">YouTube, Vimeo, Behance, Drive</span>
                      </div>
                      <input
                        type="url"
                        required
                        value={applicantForm.portfolioUrl}
                        onChange={(e) => {
                          setApplicantForm({ ...applicantForm, portfolioUrl: e.target.value });
                          if (fieldErrors.portfolioUrl) setFieldErrors((prev) => ({ ...prev, portfolioUrl: "" }));
                          if (submitAppError) setSubmitAppError("");
                        }}
                        placeholder="https://vimeo.com/... or https://behance.net/..."
                        className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all ${fieldErrors.portfolioUrl
                          ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                          : "border border-white/10 focus:border-[#B3FFC9]"
                          }`}
                      />
                      {fieldErrors.portfolioUrl && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                          <AlertCircle size={11} className="shrink-0" />
                          <span>{fieldErrors.portfolioUrl}</span>
                        </p>
                      )}
                    </div>

                    {/* Note / Pitch */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                          <span>Why Littroi? / Cover Note</span>
                          <span className="text-white/40 text-[10px] font-normal font-mono">(Optional)</span>
                        </label>
                      </div>
                      <textarea
                        rows={3}
                        value={applicantForm.coverLetter}
                        onChange={(e) => {
                          setApplicantForm({ ...applicantForm, coverLetter: e.target.value });
                          if (fieldErrors.coverLetter) setFieldErrors((prev) => ({ ...prev, coverLetter: "" }));
                          if (submitAppError) setSubmitAppError("");
                        }}
                        placeholder="Tell us about the edits or projects you're most proud of, your favorite tools, or why you want to work with us..."
                        className={`w-full px-4 py-3 rounded-xl bg-[#141414] text-white text-sm placeholder:text-white/25 focus:outline-none transition-all resize-none ${fieldErrors.coverLetter
                          ? "border border-red-500/80 ring-1 ring-red-500/30 bg-red-500/[0.03]"
                          : "border border-white/10 focus:border-[#B3FFC9]"
                          }`}
                      />
                      {fieldErrors.coverLetter && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                          <AlertCircle size={11} className="shrink-0" />
                          <span>{fieldErrors.coverLetter}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseApplyModal}
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingApp}
                        className="px-7 py-3 rounded-xl bg-[#B3FFC9] hover:bg-[#9effba] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(179,255,201,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {isSubmittingApp ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <Send size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
