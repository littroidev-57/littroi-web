import React, { useState, useEffect } from "react";
import { 
  Lock, 
  LayoutDashboard, 
  Film, 
  FileText, 
  Briefcase, 
  LogOut, 
  Inbox, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X,
  Send,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Play,
  TrendingUp,
  User,
  Check,
  ChevronRight,
  Menu,
  Video,
  Tv,
  Image as ImageIcon,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../utils/seo";
import { authAPI, caseStudiesAPI, blogAPI, jobsAPI, contactAPI, projectsAPI, uploadAPI } from "../services/api";
import litroiLogo from "../assets/littroi-logo.png";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'caseStudies' | 'homeVideos' | 'blog' | 'jobs' | 'enquiries'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [videoCategoryFilter, setVideoCategoryFilter] = useState("all");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Auth States
  const [credentials, setCredentials] = useState({ email: "admin@littroi.com", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Data Lists
  const [caseStudiesList, setCaseStudiesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'caseStudy' | 'project' | 'blog' | 'job' | 'viewEnquiry' | 'videoPreview'
  const [editingItem, setEditingItem] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  // Delete Confirmation Popup State
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: string, id: string, title: string }

  // Form State: Case Study (Strictly Case Study content)
  const [csForm, setCsForm] = useState({
    title: "",
    client: "",
    handle: "",
    initials: "",
    thumbColor: "#4C8DFF",
    category: "Instagram Growth",
    images: [],
    tags: "Editing, Distribution",
    stat1Num: "",
    stat1Label: "Views / 30d",
    stat2Num: "",
    stat2Label: "Interactions",
    stat3Num: "",
    stat3Label: "Accounts reached",
    challenge: "",
    approach: "",
    description: ""
  });

  // Form State: Home Video (Our Projects, Podcast Clips, Short Form, SaaS Video)
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "our-projects",
    categoryLabel: "Our Projects",
    videoUrl: "",
    youtubeId: "",
    thumbnail: "",
    aspectRatio: "16/9",
    order: 1
  });

  // Form State: Blog
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Content Strategy",
    readTime: "4 min read",
    coverImage: "",
    author: "Vishal Singh Mahar"
  });

  // Form State: Job
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Post-Production",
    type: "Full-time",
    location: "Bareilly (Studio / Remote)",
    salary: "Competitive",
    experience: "2+ Years",
    description: "",
    requirements: "Adobe Premiere, After Effects, DaVinci Resolve"
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Check Existing Session
  useEffect(() => {
    const checkSession = async () => {
      const user = await authAPI.getMe();
      if (user) {
        setAdminUser(user);
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, []);

  // Fetch All Data
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [cs, projs, blogs, jobs, enqs] = await Promise.all([
        caseStudiesAPI.getAll(),
        projectsAPI.getAll(),
        blogAPI.getAll(),
        jobsAPI.getAll(),
        contactAPI.getAll()
      ]);
      setCaseStudiesList(cs || []);
      setProjectsList(projs || []);
      setBlogsList(blogs || []);
      setJobsList(jobs || []);
      setEnquiriesList(enqs || []);
    } catch (err) {
      console.warn("Data loading error:", err);
    } finally {
      setIsLoadingData(false);
    }
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
    authAPI.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // ==================== UNIFIED DELETE HANDLER ====================
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    try {
      if (type === "homeVideo") {
        await projectsAPI.delete(id);
        showToast("Video showcase deleted");
      } else if (type === "caseStudy") {
        await caseStudiesAPI.delete(id);
        showToast("Case study deleted");
      } else if (type === "blog") {
        await blogAPI.delete(id);
        showToast("Blog article deleted");
      } else if (type === "job") {
        await jobsAPI.delete(id);
        showToast("Career opening removed");
      } else if (type === "enquiry") {
        await contactAPI.delete(id);
        showToast("Inquiry lead deleted");
      }
      await loadAllData();
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting item");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ==================== CRUD: CASE STUDIES ====================
  const handleOpenCsModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      const existingImages = Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : (item.coverImage || item.thumbnail ? [item.coverImage || item.thumbnail] : []);

      const stats = item.stats || (item.metrics ? item.metrics.map(m => ({ num: m.value, label: m.label })) : []);

      setCsForm({
        title: item.title || item.name || "",
        client: item.client || item.handle || "",
        handle: item.handle || item.client || "",
        initials: item.initials || "",
        thumbColor: item.thumbColor || "#4C8DFF",
        category: item.category || "Instagram Growth",
        images: existingImages,
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || "Editing, Distribution"),
        stat1Num: stats[0]?.num || item.metric || "",
        stat1Label: stats[0]?.label || item.metricLabel || "Views / 30d",
        stat2Num: stats[1]?.num || "",
        stat2Label: stats[1]?.label || "Interactions",
        stat3Num: stats[2]?.num || "",
        stat3Label: stats[2]?.label || "Accounts reached",
        challenge: item.challenge || "",
        approach: item.approach || "",
        description: item.description || item.shortDescription || ""
      });
    } else {
      setEditingItem(null);
      setCsForm({
        title: "",
        client: "",
        handle: "",
        initials: "",
        thumbColor: "#4C8DFF",
        category: "Instagram Growth",
        images: [],
        tags: "Editing, Distribution",
        stat1Num: "",
        stat1Label: "Views / 30d",
        stat2Num: "",
        stat2Label: "Interactions",
        stat3Num: "",
        stat3Label: "Accounts reached",
        challenge: "",
        approach: "",
        description: ""
      });
    }
    setModalType("caseStudy");
  };

  const handleSaveCs = async (e) => {
    e.preventDefault();
    const statsArray = [];
    if (csForm.stat1Num) statsArray.push({ num: csForm.stat1Num, label: csForm.stat1Label });
    if (csForm.stat2Num) statsArray.push({ num: csForm.stat2Num, label: csForm.stat2Label });
    if (csForm.stat3Num) statsArray.push({ num: csForm.stat3Num, label: csForm.stat3Label });

    const calculatedInitials = csForm.initials || csForm.title.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

    const payload = {
      ...csForm,
      name: csForm.title,
      initials: calculatedInitials,
      handle: csForm.handle || csForm.client,
      slug: csForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tags: csForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      stats: statsArray,
      metrics: statsArray.map(s => ({ value: s.num, label: s.label })),
      metric: csForm.stat1Num || "10M+",
      metricLabel: csForm.stat1Label || "Views",
      coverImage: csForm.images[0] || "",
      thumbnail: csForm.images[0] || "",
      shortDescription: csForm.description || `${csForm.challenge ? `Challenge: ${csForm.challenge} ` : ''}${csForm.approach ? `Approach: ${csForm.approach}` : ''}`
    };

    if (editingItem) {
      await caseStudiesAPI.update(editingItem._id || editingItem.id, payload);
      showToast("Case study updated successfully");
    } else {
      await caseStudiesAPI.create(payload);
      showToast("New case study added to showcase");
    }
    await loadAllData();
    setModalType(null);
  };

  // ==================== CRUD: HOME VIDEOS (OUR PROJECTS / PODCAST / SHORTS) ====================
  const handleOpenProjectModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setProjectForm({
        title: item.title || "",
        category: item.category || "our-projects",
        categoryLabel: item.categoryLabel || "Our Projects",
        videoUrl: item.videoUrl || "",
        youtubeId: item.youtubeId || "",
        thumbnail: item.thumbnail || "",
        aspectRatio: item.aspectRatio || (item.category === "our-projects" || item.category === "saas-video" ? "16/9" : "9/16"),
        order: item.order || 1
      });
    } else {
      setEditingItem(null);
      setProjectForm({
        title: "",
        category: "our-projects",
        categoryLabel: "Our Projects",
        videoUrl: "",
        youtubeId: "",
        thumbnail: "",
        aspectRatio: "16/9",
        order: projectsList.length + 1
      });
    }
    setModalType("project");
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();

    // Auto extract YouTube ID from URL or ID string
    const inputVal = (projectForm.youtubeId || projectForm.videoUrl || "").trim();
    let yId = inputVal;
    const match = inputVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*)/);
    if (match && match[1]) {
      yId = match[1];
    }

    const catLabel =
      projectForm.category === "our-projects"
        ? "Our Projects"
        : projectForm.category === "saas-video"
        ? "SaaS Video"
        : projectForm.category === "podcast-clips"
        ? "Podcast Clips"
        : "Short Form Content";

    const defaultThumb =
      projectForm.category === "our-projects" || projectForm.category === "saas-video"
        ? `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`
        : `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;

    const payload = {
      ...projectForm,
      youtubeId: yId,
      videoUrl: projectForm.videoUrl || (projectForm.category === "our-projects" || projectForm.category === "saas-video" ? `https://www.youtube.com/watch?v=${yId}` : `https://www.youtube.com/shorts/${yId}`),
      categoryLabel: catLabel,
      thumbnail: projectForm.thumbnail || defaultThumb,
      aspectRatio: projectForm.category === "our-projects" || projectForm.category === "saas-video" ? "16/9" : "9/16",
      createdAt: new Date().toISOString()
    };

    if (editingItem) {
      await projectsAPI.update(editingItem._id || editingItem.id, payload);
      showToast("Home video showcase updated");
    } else {
      await projectsAPI.create(payload);
      showToast("New video showcase added to Home");
    }
    await loadAllData();
    setModalType(null);
  };

  // ==================== CRUD: BLOG ====================
  const handleOpenBlogModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setBlogForm({
        title: item.title || "",
        slug: item.slug || "",
        excerpt: item.excerpt || "",
        content: item.content || "",
        category: item.category || "Content Strategy",
        readTime: item.readTime || "4 min read",
        coverImage: item.coverImage || item.featuredImage || "",
        author: typeof item.author === "object" ? item.author.name : (item.author || "Vishal Singh Mahar")
      });
    } else {
      setEditingItem(null);
      setBlogForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Content Strategy",
        readTime: "5 min read",
        coverImage: "",
        author: "Vishal Singh Mahar"
      });
    }
    setModalType("blog");
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      featuredImage: blogForm.coverImage,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    if (editingItem) {
      await blogAPI.update(editingItem._id || editingItem.id, payload);
      showToast("Blog article updated");
    } else {
      await blogAPI.create(payload);
      showToast("New article published");
    }
    await loadAllData();
    setModalType(null);
  };

  // ==================== CRUD: JOBS ====================
  const handleOpenJobModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setJobForm({
        title: item.title || "",
        department: item.department || "Post-Production",
        type: item.type || "Full-time",
        location: item.location || "Bareilly (Studio / Remote)",
        salary: item.salary || "Competitive",
        experience: item.experience || "2+ Years",
        description: item.description || "",
        requirements: Array.isArray(item.requirements) ? item.requirements.join(", ") : (item.requirements || "")
      });
    } else {
      setEditingItem(null);
      setJobForm({
        title: "",
        department: "Post-Production",
        type: "Full-time",
        location: "Bareilly (Studio / Remote)",
        salary: "Competitive",
        experience: "2+ Years",
        description: "",
        requirements: ""
      });
    }
    setModalType("job");
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const payload = {
      ...jobForm,
      slug: jobForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      requirements: jobForm.requirements.split(",").map((r) => r.trim()).filter(Boolean)
    };

    if (editingItem) {
      await jobsAPI.update(editingItem._id || editingItem.id, payload);
      showToast("Career opening updated");
    } else {
      await jobsAPI.create(payload);
      showToast("New job vacancy posted");
    }
    await loadAllData();
    setModalType(null);
  };

  // ==================== ENQUIRIES ====================
  const handleToggleEnquiryStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "New" ? "Reviewed" : (currentStatus === "Reviewed" ? "Contacted" : "New");
    await contactAPI.updateStatus(id, nextStatus);
    showToast(`Inquiry marked as ${nextStatus}`);
    await loadAllData();
  };

  // Filtered Lists
  const filteredCaseStudies = caseStudiesList.filter((cs) => 
    (cs.title || cs.name)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cs.client || cs.handle)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch = 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.videoUrl?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    if (videoCategoryFilter === "all") return matchesSearch;
    return matchesSearch && (p.category === videoCategoryFilter);
  });

  const filteredBlogs = blogsList.filter((b) => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobsList.filter((j) => 
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnquiries = enquiriesList.filter((e) => {
    const matchesSearch = 
      e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && (e.status?.toLowerCase() === statusFilter.toLowerCase());
  });

  // Nav Items
  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "caseStudies", label: "Case Studies", icon: FileText, count: caseStudiesList.length },
    { id: "homeVideos", label: "Home Videos", icon: Video, count: projectsList.length },
    { id: "blog", label: "Blog Insights", icon: FileText, count: blogsList.length },
    { id: "jobs", label: "Careers", icon: Briefcase, count: jobsList.length },
    { id: "enquiries", label: "Client Inquiries", icon: Inbox, count: enquiriesList.length, highlight: enquiriesList.some(e => e.status === "New") },
  ];

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <>
        <SEO title="Admin Login — Littroi" />
        <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 bg-[#050505] text-white">
          <div className="max-w-md w-full bg-[#0c0c0c] p-8 sm:p-10 rounded-[28px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_60px_rgba(179,255,201,0.03)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 p-2.5 mx-auto flex items-center justify-center shadow-lg">
                <img src={litroiLogo} alt="Littroi" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Littroi Admin Portal
              </h1>
              <p className="text-xs text-white/50">Dynamic Management &amp; Content Control System</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/60" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#B3FFC9] transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/60" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  placeholder="Enter password (admin123)"
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#B3FFC9] transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#B3FFC9] text-black font-bold text-sm uppercase tracking-wider hover:bg-[#9effba] hover:shadow-[0_0_25px_rgba(179,255,201,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {isSubmitting ? "Authenticating..." : "Enter Admin Console"}
              </button>
            </form>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/50 text-center">
              Credentials: <strong className="text-[#B3FFC9]">admin@littroi.com</strong> / <strong className="text-[#B3FFC9]">admin123</strong>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==================== REDESIGNED ADMIN CONSOLE ====================
  return (
    <>
      <SEO title="Admin Console — Littroi" />
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#B3FFC9] text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-fadeIn" style={{ fontFamily: "'Syne', sans-serif" }}>
          <CheckCircle2 size={16} />
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
                    setActiveTab(tab.id);
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
                          : (tab.highlight ? "bg-[#B3FFC9]/20 text-[#B3FFC9]" : "bg-white/10 text-white/60")
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
                className="md:hidden p-2 rounded-lg bg-white/5 text-white/70 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white capitalize tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {activeTab === "caseStudies" ? "Case Studies Analysis" : (activeTab === "homeVideos" ? "Home Video Showcases" : (activeTab === "enquiries" ? "Client Inquiries Inbox" : activeTab))}
                </h1>
                <p className="text-xs text-white/40 hidden sm:block">
                  Littroi Media MERN Production Database
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
                  onClick={() => handleOpenCsModal()}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Case Study</span>
                </button>
              )}

              {activeTab === "homeVideos" && (
                <button
                  onClick={() => handleOpenProjectModal()}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Video</span>
                </button>
              )}

              {activeTab === "blog" && (
                <button
                  onClick={() => handleOpenBlogModal()}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Article</span>
                </button>
              )}

              {activeTab === "jobs" && (
                <button
                  onClick={() => handleOpenJobModal()}
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
            
            {/* ==================== TAB: DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* 5 Hero Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  <div 
                    onClick={() => setActiveTab("caseStudies")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Case Studies</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <FileText size={14} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {caseStudiesList.length}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Full Case Studies</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("homeVideos")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Home Videos</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Video size={14} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {projectsList.length}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Projects, Podcasts, Shorts</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("blog")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Published Blogs</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <FileText size={14} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {blogsList.length}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Thought Leadership</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("jobs")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Active Careers</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Briefcase size={14} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {jobsList.length}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Open Studio Roles</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("enquiries")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Client Leads</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Inbox size={14} />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {enquiriesList.length}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Form Inquiries</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: CASE STUDIES (ONLY CASE STUDIES CONTENT) ==================== */}
            {activeTab === "caseStudies" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-white/50">
                    Showing <strong className="text-white">{filteredCaseStudies.length}</strong> case studies (Deep Dive Analysis)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCaseStudies.map((cs) => {
                    const initials = cs.initials || (cs.title || cs.name || "LT").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
                    const imagesCount = Array.isArray(cs.images) ? cs.images.length : (cs.coverImage ? 1 : 0);
                    const stats = cs.stats || [];

                    return (
                      <div
                        key={cs.id || cs._id}
                        className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
                      >
                        <div className="space-y-3">
                          {/* Card Preview Banner with Initials */}
                          <div className="h-32 rounded-xl overflow-hidden bg-[#141414] relative border border-white/5 flex items-center justify-center">
                            <div 
                              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-xl border border-white/20"
                              style={{ backgroundColor: cs.thumbColor || "#4C8DFF" }}
                            >
                              {initials}
                            </div>
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#B3FFC9] text-[10px] font-semibold">
                              {cs.category || "Case Study"}
                            </span>
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-mono">
                              {imagesCount} {imagesCount === 1 ? "Screenshot" : "Screenshots"}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-base font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                              {cs.title || cs.name}
                            </h4>
                            <p className="text-xs text-white/50 font-mono truncate">
                              {cs.handle || cs.client}
                            </p>
                          </div>

                          {/* Stats Preview */}
                          {stats.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5">
                              {stats.slice(0, 2).map((st, sIdx) => (
                                <div key={sIdx}>
                                  <div className="text-xs font-bold text-[#B3FFC9] font-mono">{st.num}</div>
                                  <div className="text-[10px] text-white/40 truncate">{st.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-white/60 line-clamp-2">
                            {cs.challenge ? `Challenge: ${cs.challenge}` : (cs.description || cs.shortDescription)}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleOpenCsModal(cs)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "caseStudy", id: cs.id || cs._id, title: cs.title || cs.name || "Case Study" })}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== TAB: HOME VIDEO SHOWCASES ==================== */}
            {activeTab === "homeVideos" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-2">
                    {[
                      { key: "all", label: `All (${projectsList.length})` },
                      { key: "our-projects", label: `Our Projects (16:9)` },
                      { key: "saas-video", label: `SaaS Video (16:9)` },
                      { key: "podcast-clips", label: `Podcast Clips (9:16)` },
                      { key: "short-form", label: `Short Form (9:16)` },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setVideoCategoryFilter(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          videoCategoryFilter === tab.key
                            ? "bg-[#B3FFC9] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredProjects.map((p) => {
                    const isReel = p.category === "podcast-clips" || p.category === "short-form";
                    const yId = p.youtubeId || (p.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)|youtu\.be\/|\/v\/)([^#&?]*).*/)?.[1]) || p.videoUrl;

                    return (
                      <div
                        key={p.id || p._id}
                        className="p-3.5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-3 group transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className={`rounded-xl overflow-hidden bg-[#161616] relative ${isReel ? "aspect-[9/14]" : "aspect-video"}`}>
                            <img
                              src={p.thumbnail || `https://img.youtube.com/vi/${yId}/hqdefault.jpg`}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[9px] font-semibold">
                              {p.categoryLabel || p.category}
                            </span>
                            <button
                              onClick={() => {
                                setPreviewVideoUrl(p.videoUrl || `https://www.youtube.com/watch?v=${yId}`);
                                setModalType("videoPreview");
                              }}
                              className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/70 text-[#B3FFC9] flex items-center justify-center hover:scale-110 hover:bg-[#B3FFC9] hover:text-black transition-all shadow-xl"
                            >
                              <Play size={16} className="ml-0.5" />
                            </button>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                              {p.title || "Video Showcase"}
                            </h4>
                            <p className="text-[11px] text-white/40 font-mono truncate">
                              ID: {yId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleOpenProjectModal(p)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 size={11} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "homeVideo", id: p.id || p._id, title: p.title || "Home Video" })}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== TAB: BLOG ==================== */}
            {activeTab === "blog" && (
              <div className="space-y-6">
                <div className="text-xs text-white/50">
                  Showing <strong className="text-white">{filteredBlogs.length}</strong> published articles
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((post) => (
                    <div
                      key={post.id || post._id}
                      className="p-4 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
                    >
                      <div className="space-y-3">
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#161616] relative">
                          <img
                            src={post.featuredImage || post.coverImage || "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png"}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#B3FFC9] text-[10px] font-semibold">
                            {post.category || "Article"}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-[#B3FFC9] transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {post.title}
                        </h4>

                        <p className="text-xs text-white/50 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 text-white/40 font-mono">
                          <span>{typeof post.author === "object" ? post.author?.name : (post.author || "Editorial")}</span>
                          <span>{post.readTime || "4 min"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleOpenBlogModal(post)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: "blog", id: post.id || post._id, title: post.title || "Blog Article" })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: JOBS ==================== */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="text-xs text-white/50">
                  Showing <strong className="text-white">{filteredJobs.length}</strong> active career postings
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id || job._id}
                      className="p-6 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] text-[10px] font-bold">
                            {job.department}
                          </span>
                          <span className="text-[11px] text-white/40 font-mono">{job.type}</span>
                        </div>

                        <h4 className="text-lg font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                          {job.title}
                        </h4>

                        <div className="space-y-1.5 text-xs text-white/60">
                          <p>📍 {job.location}</p>
                          <p>💼 {job.experience || "2+ Years"}</p>
                          <p>💰 {job.salary || "Competitive"}</p>
                        </div>

                        <p className="text-xs text-white/50 line-clamp-2 pt-2 border-t border-white/5">
                          {job.description || "Exciting role at Littroi Media studio."}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleOpenJobModal(job)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: "job", id: job.id || job._id, title: job.title || "Job Position" })}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: ENQUIRIES ==================== */}
            {activeTab === "enquiries" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {["all", "new", "reviewed", "contacted"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          statusFilter === st ? "bg-[#B3FFC9] text-black" : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-white/40">{filteredEnquiries.length} total leads</span>
                </div>

                <div className="space-y-3">
                  {filteredEnquiries.map((enq) => (
                    <div
                      key={enq.id || enq._id}
                      className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>{enq.name}</span>
                          <span className="text-xs text-[#B3FFC9]">({enq.company || "Direct"})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            enq.status === "New" ? "bg-[#B3FFC9]/20 text-[#B3FFC9]" : (enq.status === "Reviewed" ? "bg-amber-400/20 text-amber-300" : "bg-blue-400/20 text-blue-300")
                          }`}>
                            {enq.status || "New"}
                          </span>
                        </div>
                        <p className="text-xs text-white/60">{enq.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-white/40 font-mono mr-2">{enq.date}</span>
                        <button
                          onClick={() => handleToggleEnquiryStatus(enq.id || enq._id, enq.status)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/80 transition-colors cursor-pointer"
                        >
                          Cycle Status
                        </button>
                        <a
                          href={`mailto:${enq.email}?subject=Littroi%20Inquiry%20Response`}
                          className="p-1.5 rounded-lg bg-[#B3FFC9]/10 text-[#B3FFC9] hover:bg-[#B3FFC9]/20 transition-colors"
                          title="Reply Email"
                        >
                          <Send size={13} />
                        </a>
                        <button
                          onClick={() => setDeleteConfirm({ type: "enquiry", id: enq.id || enq._id, title: `Inquiry from ${enq.name}` })}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>

        {/* ==================== POPUP: DELETE CONFIRMATION ==================== */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full bg-[#0d0d0d] border border-red-500/25 rounded-[28px] p-6 sm:p-8 space-y-6 relative shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(239,68,68,0.15)] overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                    Confirm Deletion
                  </h3>
                  <p className="text-xs text-white/50">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Are you sure you want to delete <strong className="text-white font-bold">"{deleteConfirm.title}"</strong>? It will be immediately removed from the live website and database.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Trash2 size={14} />
                  <span>Yes, Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODAL: CASE STUDY ADD / EDIT ==================== */}
        {modalType === "caseStudy" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Edit Case Study" : "Add New Case Study"}
                  </h3>
                  <p className="text-xs text-white/40">Provide project details and multiple results screenshots</p>
                </div>
                <button onClick={() => setModalType(null)} className="text-white/50 hover:text-white p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCs} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Project Title *</label>
                  <input
                    type="text"
                    value={csForm.title}
                    onChange={(e) => setCsForm({ ...csForm, title: e.target.value })}
                    placeholder="e.g. Dream Talks"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Client / Handle *</label>
                    <input
                      type="text"
                      value={csForm.client}
                      onChange={(e) => setCsForm({ ...csForm, client: e.target.value })}
                      placeholder="e.g. 13 Dream Consultants · @13dreamsconsultants"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Category</label>
                    <select
                      value={csForm.category}
                      onChange={(e) => setCsForm({ ...csForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    >
                      <option value="Instagram Growth">Instagram Growth</option>
                      <option value="YouTube Growth">YouTube Growth</option>
                      <option value="Retention Strategy">Retention Strategy</option>
                      <option value="Thumbnail & SEO">Thumbnail &amp; SEO</option>
                      <option value="Social Media Management">Social Media Management</option>
                      <option value="Channel Growth">Channel Growth</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Initials / Color Glow</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={3}
                        value={csForm.initials}
                        onChange={(e) => setCsForm({ ...csForm, initials: e.target.value.toUpperCase() })}
                        placeholder="DT"
                        className="w-20 px-3 py-2 rounded-xl bg-[#161616] border border-white/10 text-white text-xs font-bold text-center uppercase"
                      />
                      <input
                        type="color"
                        value={csForm.thumbColor}
                        onChange={(e) => setCsForm({ ...csForm, thumbColor: e.target.value })}
                        className="h-9 w-12 rounded-xl bg-transparent border border-white/10 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={csForm.tags}
                      onChange={(e) => setCsForm({ ...csForm, tags: e.target.value })}
                      placeholder="Editing, Distribution"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Multiple Images Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white/60">
                      Results Screenshots (Upload to Cloudinary)
                    </label>
                    {isUploadingImage ? (
                      <span className="text-[11px] text-[#B3FFC9] font-mono animate-pulse">
                        Uploading to Cloudinary...
                      </span>
                    ) : (
                      csForm.images && csForm.images.length > 0 && (
                        <span className="text-[11px] text-[#B3FFC9] font-mono">
                          {csForm.images.length} {csForm.images.length === 1 ? "screenshot" : "screenshots"} uploaded
                        </span>
                      )
                    )}
                  </div>

                  {csForm.images && csForm.images.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {csForm.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative rounded-xl overflow-hidden aspect-video border border-white/15 bg-[#161616] group">
                            <img src={img} alt={`Asset ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-[#B3FFC9] font-mono font-bold">
                              #{imgIdx + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = csForm.images.filter((_, i) => i !== imgIdx);
                                setCsForm({ ...csForm, images: updated });
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                              title="Delete Image"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#B3FFC9] cursor-pointer transition-colors">
                        <Plus size={14} />
                        <span>{isUploadingImage ? "Uploading..." : "Add More Screenshots"}</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isUploadingImage}
                          className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setIsUploadingImage(true);
                              try {
                                const uploadedUrls = await uploadAPI.uploadMultiple(files);
                                setCsForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
                                showToast(`${files.length} screenshots uploaded to Cloudinary`);
                              } catch {
                                showToast("Error uploading images to Cloudinary");
                              } finally {
                                setIsUploadingImage(false);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 rounded-2xl p-6 bg-[#141414]/50 hover:bg-[#141414] transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#B3FFC9]/10 text-white/60 group-hover:text-[#B3FFC9] flex items-center justify-center mb-3 transition-colors">
                        <Plus size={22} />
                      </div>
                      <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Click to Upload Screenshots to Cloudinary"}
                      </p>
                      <p className="text-[11px] text-white/40 mt-1 font-mono">
                        PNG, JPG, WEBP assets uploaded straight to Cloudinary media cloud
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={isUploadingImage}
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            setIsUploadingImage(true);
                            try {
                              const uploadedUrls = await uploadAPI.uploadMultiple(files);
                              setCsForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
                              showToast(`${files.length} screenshots uploaded to Cloudinary`);
                            } catch {
                              showToast("Error uploading images to Cloudinary");
                            } finally {
                              setIsUploadingImage(false);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 3 Stats Row */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-bold text-white/60">Impact Metrics</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 1</span>
                      <input
                        type="text"
                        value={csForm.stat1Num}
                        onChange={(e) => setCsForm({ ...csForm, stat1Num: e.target.value })}
                        placeholder="706.1K"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={csForm.stat1Label}
                        onChange={(e) => setCsForm({ ...csForm, stat1Label: e.target.value })}
                        placeholder="IG Views / 30d"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 2</span>
                      <input
                        type="text"
                        value={csForm.stat2Num}
                        onChange={(e) => setCsForm({ ...csForm, stat2Num: e.target.value })}
                        placeholder="36.4K"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={csForm.stat2Label}
                        onChange={(e) => setCsForm({ ...csForm, stat2Label: e.target.value })}
                        placeholder="IG Interactions"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 bg-[#141414] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-[#B3FFC9] font-mono font-bold">Metric 3</span>
                      <input
                        type="text"
                        value={csForm.stat3Num}
                        onChange={(e) => setCsForm({ ...csForm, stat3Num: e.target.value })}
                        placeholder="534K"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={csForm.stat3Label}
                        onChange={(e) => setCsForm({ ...csForm, stat3Label: e.target.value })}
                        placeholder="IG Accounts reached"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 text-white/60 text-[11px] focus:border-[#B3FFC9] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Challenge & Approach */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">The Challenge</label>
                    <textarea
                      value={csForm.challenge}
                      onChange={(e) => setCsForm({ ...csForm, challenge: e.target.value })}
                      rows={3}
                      placeholder="What was the client's problem? e.g. Inconsistent posting rhythm..."
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Our Approach</label>
                    <textarea
                      value={csForm.approach}
                      onChange={(e) => setCsForm({ ...csForm, approach: e.target.value })}
                      rows={3}
                      placeholder="What did Littroi execute? e.g. Daily repurposing system..."
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Update Case Study" : "Publish Case Study"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== MODAL: HOME VIDEO ADD / EDIT ==================== */}
        {modalType === "project" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Edit Home Video" : "Add Video to Home"}
                  </h3>
                  <p className="text-xs text-white/40">Manage videos for Our Projects, SaaS Video, Podcast Clips &amp; Short Form</p>
                </div>
                <button onClick={() => setModalType(null)} className="text-white/50 hover:text-white p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Video Title / Name</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. SaaS Launch Film"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Home Section / Category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    >
                      <option value="our-projects">Our Projects (16:9 Landscape Slider)</option>
                      <option value="saas-video">SaaS Video (16:9 Showcase)</option>
                      <option value="podcast-clips">Podcast Clips (9:16 Vertical Reels)</option>
                      <option value="short-form">Short Form Content (9:16 Vertical Reels)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Display Order</label>
                    <input
                      type="number"
                      value={projectForm.order}
                      onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">YouTube Video URL or Shorts Link *</label>
                  <input
                    type="text"
                    value={projectForm.videoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-white/40 font-mono">
                    Video ID and thumbnail will be automatically detected.
                  </p>
                </div>

                {/* Optional Custom Thumbnail */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-white/60">Custom Thumbnail Image (Optional)</label>
                  {projectForm.thumbnail ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 bg-[#161616] group">
                      <img src={projectForm.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, thumbnail: "" })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-xs text-white/60 hover:text-white cursor-pointer">
                      <ImageIcon size={16} className="text-[#B3FFC9]" />
                      <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Custom Thumbnail (or leave empty for YouTube cover)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingImage(true);
                            try {
                              const url = await uploadAPI.uploadSingle(file);
                              setProjectForm((prev) => ({ ...prev, thumbnail: url }));
                              showToast("Thumbnail uploaded to Cloudinary");
                            } catch {
                              showToast("Error uploading thumbnail");
                            } finally {
                              setIsUploadingImage(false);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Update Video" : "Add to Home"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== MODAL: BLOG ADD / EDIT ==================== */}
        {modalType === "blog" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {editingItem ? "Edit Article" : "Write New Article"}
                </h3>
                <button onClick={() => setModalType(null)} className="text-white/50 hover:text-white p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Article Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="e.g. Why Short-Form Content is Dominating B2B SaaS in 2026"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Category</label>
                    <input
                      type="text"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      placeholder="Content Strategy"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Author Name</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      placeholder="Vishal Singh Mahar"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Read Time</label>
                    <input
                      type="text"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      placeholder="4 min read"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direct File Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60">Article Cover Image</label>
                  {blogForm.coverImage ? (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-white/10 bg-[#161616] group">
                      <img src={blogForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBlogForm({ ...blogForm, coverImage: "" })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 rounded-2xl p-6 bg-[#141414]/50 cursor-pointer transition-all">
                      <Plus size={20} className="text-white/40 mb-2" />
                      <p className="text-xs font-bold text-white">
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Choose Cover Image"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingImage}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingImage(true);
                            try {
                              const url = await uploadAPI.uploadSingle(file);
                              setBlogForm((prev) => ({ ...prev, coverImage: url }));
                              showToast("Cover image uploaded to Cloudinary");
                            } catch {
                              showToast("Error uploading cover image");
                            } finally {
                              setIsUploadingImage(false);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Short Excerpt *</label>
                  <textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Brief 1-2 sentence preview..."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Article Content (HTML supported) *</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    rows={6}
                    placeholder="<h3>Section Title</h3><p>Article body paragraphs...</p>"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs font-mono focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== MODAL: JOB ADD / EDIT ==================== */}
        {modalType === "job" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {editingItem ? "Edit Opening" : "Create Career Opening"}
                </h3>
                <button onClick={() => setModalType(null)} className="text-white/50 hover:text-white p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Position Title *</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Senior Motion Graphics Artist"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Department</label>
                    <input
                      type="text"
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                      placeholder="Post-Production"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Employment Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract / Project">Contract / Project</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Location</label>
                    <input
                      type="text"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="Bareilly / Remote"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Salary Range</label>
                    <input
                      type="text"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      placeholder="Competitive / Negotiable"
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Job Description *</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={4}
                    placeholder="Role responsibilities and expectations..."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Update Role" : "Post Opening"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== VIDEO PREVIEW MODAL ==================== */}
        {modalType === "videoPreview" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="max-w-4xl w-full bg-[#0d0d0d] border border-white/15 rounded-[24px] p-6 space-y-4 relative shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#B3FFC9] font-semibold">Video Preview Player</span>
                <button onClick={() => setModalType(null)} className="p-1 text-white/60 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                <iframe
                  src={previewVideoUrl.replace("watch?v=", "embed/").replace("shorts/", "embed/")}
                  title="Video Preview"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
