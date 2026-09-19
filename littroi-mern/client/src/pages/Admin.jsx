import React, { useState, useEffect, useTransition } from "react";
import {
  Lock,
  LayoutDashboard,
  FileText,
  Briefcase,
  LogOut,
  Plus,
  CheckCircle2,
  Search,
  ChevronRight,
  Menu,
  Video,
  Quote,
  UserCheck,
  ExternalLink,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../utils/seo";
import {
  authAPI,
  caseStudiesAPI,
  blogAPI,
  jobsAPI,
  projectsAPI,
  testimonialsAPI,
  jobApplicationsAPI,
  cookieUtils
} from "../services/api";
import litroiLogo from "../assets/littroi-logo.png";

// Eagerly loaded primary dashboard tab
import { DashboardTab } from "../components/admin/tabs/DashboardTab";

// Lazy-loaded secondary tabs & modals (Code-Splitting for fast initial load)
const CaseStudiesTab = React.lazy(() => import("../components/admin/tabs/CaseStudiesTab").then(m => ({ default: m.CaseStudiesTab })));
const HomeVideosTab = React.lazy(() => import("../components/admin/tabs/HomeVideosTab").then(m => ({ default: m.HomeVideosTab })));
const TestimonialsTab = React.lazy(() => import("../components/admin/tabs/TestimonialsTab").then(m => ({ default: m.TestimonialsTab })));
const BlogTab = React.lazy(() => import("../components/admin/tabs/BlogTab").then(m => ({ default: m.BlogTab })));
const JobsTab = React.lazy(() => import("../components/admin/tabs/JobsTab").then(m => ({ default: m.JobsTab })));
const JobApplicationsTab = React.lazy(() => import("../components/admin/tabs/JobApplicationsTab").then(m => ({ default: m.JobApplicationsTab })));

const CaseStudyModal = React.lazy(() => import("../components/admin/modals/CaseStudyModal").then(m => ({ default: m.CaseStudyModal })));
const ProjectModal = React.lazy(() => import("../components/admin/modals/ProjectModal").then(m => ({ default: m.ProjectModal })));
const TestimonialModal = React.lazy(() => import("../components/admin/modals/TestimonialModal").then(m => ({ default: m.TestimonialModal })));
const BlogModal = React.lazy(() => import("../components/admin/modals/BlogModal").then(m => ({ default: m.BlogModal })));
const JobModal = React.lazy(() => import("../components/admin/modals/JobModal").then(m => ({ default: m.JobModal })));
const JobApplicationModal = React.lazy(() => import("../components/admin/modals/JobApplicationModal").then(m => ({ default: m.JobApplicationModal })));
const VideoPreviewModal = React.lazy(() => import("../components/admin/modals/VideoPreviewModal").then(m => ({ default: m.VideoPreviewModal })));
const DeleteConfirmModal = React.lazy(() => import("../components/admin/modals/DeleteConfirmModal").then(m => ({ default: m.DeleteConfirmModal })));
const LogoutConfirmModal = React.lazy(() => import("../components/admin/modals/LogoutConfirmModal").then(m => ({ default: m.LogoutConfirmModal })));

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = cookieUtils.get("littroi_token") || localStorage.getItem("littroi_token");
    return Boolean(token);
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("littroi_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'caseStudies' | 'homeVideos' | 'testimonials' | 'blog' | 'jobs' | 'jobApplications'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

  // Auth States
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Dynamic Data Lists
  const [caseStudiesList, setCaseStudiesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [jobApplicationsList, setJobApplicationsList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'caseStudy' | 'project' | 'testimonial' | 'blog' | 'job' | 'viewApplication' | 'videoPreview'
  const [editingItem, setEditingItem] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: string, id: string, title: string }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Check Existing Session — validates real JWT token against server
  useEffect(() => {
    const checkSession = async () => {
      const token = cookieUtils.get("littroi_token") || localStorage.getItem("littroi_token");
      if (!token) {
        setIsAuthenticated(false);
        setAdminUser(null);
        cookieUtils.remove("littroi_token");
        localStorage.removeItem("littroi_token");
        localStorage.removeItem("littroi_user");
        return;
      }

      try {
        const user = await authAPI.getMe();
        if (user) {
          setAdminUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } catch (err) {
        console.warn("Session check notice:", err);
      }
    };
    checkSession();
  }, []);

  // Granular Fetch Functions
  const loadCaseStudies = async () => {
    try {
      const cs = await caseStudiesAPI.getAll();
      setCaseStudiesList(cs || []);
    } catch (e) {
      console.warn("Error loading case studies:", e);
    }
  };

  const loadProjects = async () => {
    try {
      const projs = await projectsAPI.getAll({ all: "true", sort: "latest" });
      setProjectsList(projs || []);
    } catch (e) {
      console.warn("Error loading projects:", e);
    }
  };

  const loadTestimonials = async () => {
    try {
      const tests = await testimonialsAPI.getAll(true);
      setTestimonialsList(tests || []);
    } catch (e) {
      console.warn("Error loading testimonials:", e);
    }
  };

  const loadBlogs = async () => {
    try {
      const blogs = await blogAPI.getAll();
      setBlogsList(blogs || []);
    } catch (e) {
      console.warn("Error loading blogs:", e);
    }
  };

  const loadJobs = async () => {
    try {
      const jobs = await jobsAPI.getAll();
      setJobsList(jobs || []);
    } catch (e) {
      console.warn("Error loading jobs:", e);
    }
  };

  const loadJobApplications = async () => {
    try {
      const jobApps = await jobApplicationsAPI.getAll();
      setJobApplicationsList(jobApps || []);
    } catch (e) {
      console.warn("Error loading job applications:", e);
    }
  };

  // Initial Non-blocking Parallel Load
  const loadAllData = async () => {
    setIsLoadingData(true);
    await Promise.allSettled([
      loadCaseStudies(),
      loadProjects(),
      loadTestimonials(),
      loadBlogs(),
      loadJobs(),
      loadJobApplications()
    ]);
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      const data = await authAPI.login(credentials.email, credentials.password);
      setAdminUser(data.user);
      setIsAuthenticated(true);
      showToast("Welcome to Littroi Admin Console");
    } catch (err) {
      setLoginError(err.message || "Failed to authenticate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
    setShowLogoutConfirm(false);
    showToast("Logged out successfully");
  };

  // Unified Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    try {
      if (type === "homeVideo") {
        await projectsAPI.delete(id);
        showToast("Video showcase deleted");
        await loadProjects();
      } else if (type === "caseStudy") {
        await caseStudiesAPI.delete(id);
        showToast("Case study deleted");
        await loadCaseStudies();
      } else if (type === "testimonial") {
        await testimonialsAPI.delete(id);
        showToast("Testimonial deleted");
        await loadTestimonials();
      } else if (type === "blog") {
        await blogAPI.delete(id);
        showToast("Blog article deleted");
        await loadBlogs();
      } else if (type === "job") {
        await jobsAPI.delete(id);
        showToast("Career opening removed");
        await loadJobs();
      } else if (type === "jobApplication") {
        await jobApplicationsAPI.delete(id);
        showToast("Job application deleted");
        await loadJobApplications();
        if (selectedApplication && (selectedApplication._id === id || selectedApplication.id === id)) {
          setSelectedApplication(null);
          setModalType(null);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting item");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSetApplicationStatus = async (id, status) => {
    try {
      await jobApplicationsAPI.updateStatus(id, status);
      showToast(`Application status updated to ${status}`);
      if (selectedApplication && (selectedApplication._id === id || selectedApplication.id === id)) {
        setSelectedApplication((prev) => ({ ...prev, status }));
      }
      await loadJobApplications();
    } catch {
      showToast("Failed to update status");
    }
  };

  // Nav Items
  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "caseStudies", label: "Case Studies", icon: FileText, count: caseStudiesList.length },
    { id: "homeVideos", label: "Home Videos", icon: Video, count: projectsList.length },
    // { id: "testimonials", label: "Testimonials", icon: Quote, count: testimonialsList.length },
    { id: "blog", label: "Blog Insights", icon: FileText, count: blogsList.length },
    { id: "jobs", label: "Careers", icon: Briefcase, count: jobsList.length },
    {
      id: "jobApplications",
      label: "Job Applications",
      icon: UserCheck,
      count: jobApplicationsList.length,
      highlight: jobApplicationsList.some((a) => a.status === "New" || !a.status)
    }
  ];

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <>
        <SEO title="Admin Login — Littroi" noindex={true} />
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 bg-[#050505] text-white">
          <div className="max-w-md w-full bg-[#0c0c0c] p-8 sm:p-10 rounded-[28px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_rgba(179,255,201,0.03)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#B3FFC9] shadow-[0_0_30px_rgba(179,255,201,0.15)]">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Littroi Admin Portal
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Authenticate to access the production management console
                </p>
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-shake">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/60">Admin Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="admin@littroi.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/60">Master Secret Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#9effba] hover:shadow-[0_0_30px_rgba(179,255,201,0.3)] transition-all cursor-pointer disabled:opacity-50"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {isSubmitting ? "Authenticating..." : "Enter Admin Console"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ==================== ADMIN CONSOLE ====================
  return (
    <>
      <SEO title="Admin Console — Littroi" noindex={true} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0c0c0c] border border-[#B3FFC9]/50 text-white text-xs font-semibold shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.2)] flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 size={16} className="text-[#B3FFC9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="min-h-screen bg-[#070707] text-white flex flex-col md:flex-row select-none">
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0c0c0c] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Top Logo & Studio Tag */}
          <div className="p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={litroiLogo} alt="Littroi" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                    LITTROI
                  </h2>
                  <span className="text-[10px] text-[#B3FFC9] font-mono tracking-wider uppercase font-semibold">
                    Admin Studio
                  </span>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>
              Management Suite
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    startTransition(() => {
                      setActiveTab(tab.id);
                    });
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#B3FFC9] text-black shadow-[0_0_20px_rgba(179,255,201,0.3)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-black/20 text-black"
                          : tab.highlight
                          ? "bg-[#B3FFC9]/20 text-[#B3FFC9]"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>
              Quick Links
            </div>
            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink size={14} className="text-[#B3FFC9]" />
                <span>Visit Live Website</span>
              </div>
              <ChevronRight size={14} className="opacity-40" />
            </Link>
          </div>

          {/* User Bottom Panel */}
          <div className="p-4 border-t border-white/10 bg-[#090909]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#B3FFC9]/20 text-[#B3FFC9] flex items-center justify-center font-bold text-xs shrink-0">
                  {adminUser?.name?.charAt(0) || "A"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {adminUser?.name || "Studio Admin"}
                  </p>
                  <p className="text-[10px] text-white/40 font-mono truncate">{adminUser?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT MAIN CONTAINER ==================== */}
        <div className="flex-1 md:ml-72 flex flex-col min-h-screen bg-[#070707]">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 h-20 bg-[#0c0c0c]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg bg-white/5 text-white/70 hover:text-white cursor-pointer"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white capitalize tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {activeTab === "caseStudies"
                    ? "Case Studies Analysis"
                    : activeTab === "homeVideos"
                    ? "Home Video Showcases"
                    : activeTab === "testimonials"
                    ? "Client Testimonials"
                    : activeTab === "jobApplications"
                    ? "Candidate Job Applications"
                    : activeTab === "blog"
                    ? "Blog & Insights"
                    : activeTab === "jobs"
                    ? "Studio Careers"
                    : "Dashboard Overview"}
                </h1>
                <p className="text-xs text-white/40 hidden sm:block">
                  Littroi Media MERN Production Database {isLoadingData ? "• Syncing..." : ""}
                </p>
              </div>
            </div>

            {/* Action Buttons & Search */}
            <div className="flex items-center gap-3">
              {activeTab !== "dashboard" && (
                <div className="relative hidden sm:block">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-48 lg:w-64 pl-9 pr-4 py-2 rounded-full bg-[#161616] border border-white/10 text-white text-xs focus:outline-none focus:border-[#B3FFC9] transition-all"
                  />
                </div>
              )}

              {/* Primary Add Actions */}
              {activeTab === "caseStudies" && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setModalType("caseStudy");
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Case Study</span>
                </button>
              )}

              {activeTab === "homeVideos" && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setModalType("project");
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Video</span>
                </button>
              )}

              {activeTab === "testimonials" && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setModalType("testimonial");
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Testimonial</span>
                </button>
              )}

              {activeTab === "blog" && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setModalType("blog");
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Article</span>
                </button>
              )}

              {activeTab === "jobs" && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setModalType("job");
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Job</span>
                </button>
              )}
            </div>
          </header>

          {/* Main Body Content */}
          <main className="p-6 sm:p-10 space-y-8 flex-1">
            <React.Suspense
              fallback={
                <div className="py-24 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#B3FFC9]/20 border-t-[#B3FFC9] animate-spin" />
                  <p className="text-xs font-mono text-white/40">Loading module...</p>
                </div>
              }
            >
              {activeTab === "dashboard" && (
                <DashboardTab
                  caseStudiesCount={caseStudiesList.length}
                  testimonialsCount={testimonialsList.length}
                  blogsCount={blogsList.length}
                  jobsCount={jobsList.length}
                  projectsCount={projectsList.length}
                  jobApplicationsList={jobApplicationsList}
                  onNavigateTab={(tabId) => {
                    startTransition(() => {
                      setActiveTab(tabId);
                      setSearchQuery("");
                    });
                  }}
                  onOpenBlogModal={() => {
                    setEditingItem(null);
                    setModalType("blog");
                  }}
                  onOpenCsModal={() => {
                    setEditingItem(null);
                    setModalType("caseStudy");
                  }}
                  onOpenJobModal={() => {
                    setEditingItem(null);
                    setModalType("job");
                  }}
                  onOpenProjectModal={() => {
                    setEditingItem(null);
                    setModalType("project");
                  }}
                  onSelectApplication={(app) => {
                    setSelectedApplication(app);
                    setModalType("viewApplication");
                  }}
                />
              )}

              {activeTab === "caseStudies" && (
                <CaseStudiesTab
                  caseStudiesList={caseStudiesList}
                  searchQuery={searchQuery}
                  onOpenModal={(cs) => {
                    setEditingItem(cs);
                    setModalType("caseStudy");
                  }}
                  onDelete={(item) => setDeleteConfirm(item)}
                />
              )}

              {activeTab === "homeVideos" && (
                <HomeVideosTab
                  projectsList={projectsList}
                  searchQuery={searchQuery}
                  onOpenModal={(p) => {
                    setEditingItem(p);
                    setModalType("project");
                  }}
                  onPreviewVideo={(url) => {
                    setPreviewVideoUrl(url);
                    setModalType("videoPreview");
                  }}
                  onDelete={(item) => setDeleteConfirm(item)}
                  onRefreshData={loadProjects}
                  showToast={showToast}
                />
              )}

              {activeTab === "testimonials" && (
                <TestimonialsTab
                  testimonialsList={testimonialsList}
                  searchQuery={searchQuery}
                  onOpenModal={(t) => {
                    setEditingItem(t || null);
                    setModalType("testimonial");
                  }}
                  onPreviewVideo={(url) => {
                    setPreviewVideoUrl(url);
                    setModalType("videoPreview");
                  }}
                  onDelete={(item) => setDeleteConfirm(item)}
                />
              )}

              {activeTab === "blog" && (
                <BlogTab
                  blogsList={blogsList}
                  searchQuery={searchQuery}
                  onOpenModal={(post) => {
                    setEditingItem(post || null);
                    setModalType("blog");
                  }}
                  onDelete={(item) => setDeleteConfirm(item)}
                />
              )}

              {activeTab === "jobs" && (
                <JobsTab
                  jobsList={jobsList}
                  searchQuery={searchQuery}
                  onOpenModal={(job) => {
                    setEditingItem(job || null);
                    setModalType("job");
                  }}
                  onDelete={(item) => setDeleteConfirm(item)}
                />
              )}

              {activeTab === "jobApplications" && (
                <JobApplicationsTab
                  jobApplicationsList={jobApplicationsList}
                  searchQuery={searchQuery}
                  onViewApplication={(app) => {
                    setSelectedApplication(app);
                    setModalType("viewApplication");
                  }}
                  onUpdateStatus={handleSetApplicationStatus}
                  onDelete={(item) => setDeleteConfirm(item)}
                />
              )}
            </React.Suspense>
          </main>
        </div>

        {/* ==================== MODALS ==================== */}
        <React.Suspense fallback={null}>
          <CaseStudyModal
            isOpen={modalType === "caseStudy"}
            editingItem={editingItem}
            onClose={() => setModalType(null)}
            onSaveSuccess={loadCaseStudies}
            showToast={showToast}
          />

          <ProjectModal
            isOpen={modalType === "project"}
            editingItem={editingItem}
            onClose={() => setModalType(null)}
            onSaveSuccess={loadProjects}
            showToast={showToast}
          />

          <TestimonialModal
            isOpen={modalType === "testimonial"}
            editingItem={editingItem}
            testimonialsCount={testimonialsList.length}
            onClose={() => setModalType(null)}
            onSaveSuccess={loadTestimonials}
            showToast={showToast}
          />

          <BlogModal
            isOpen={modalType === "blog"}
            editingItem={editingItem}
            onClose={() => setModalType(null)}
            onSaveSuccess={loadBlogs}
            showToast={showToast}
          />

          <JobModal
            isOpen={modalType === "job"}
            editingItem={editingItem}
            onClose={() => setModalType(null)}
            onSaveSuccess={loadJobs}
            showToast={showToast}
          />

          <JobApplicationModal
            isOpen={modalType === "viewApplication"}
            application={selectedApplication}
            onClose={() => setModalType(null)}
            onUpdateStatus={handleSetApplicationStatus}
            onDelete={(item) => setDeleteConfirm(item)}
          />

          <VideoPreviewModal
            isOpen={modalType === "videoPreview"}
            videoUrl={previewVideoUrl}
            onClose={() => setModalType(null)}
          />

          <DeleteConfirmModal
            deleteConfirm={deleteConfirm}
            onCancel={() => setDeleteConfirm(null)}
            onConfirm={handleConfirmDelete}
          />

          <LogoutConfirmModal
            isOpen={showLogoutConfirm}
            onCancel={() => setShowLogoutConfirm(false)}
            onConfirm={handleConfirmLogout}
          />
        </React.Suspense>
      </div>
    </>
  );
}
