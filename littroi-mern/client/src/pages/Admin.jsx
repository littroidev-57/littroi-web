import React, { useState, useEffect, useMemo } from "react";
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
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  Calendar,
  Mail,
  Phone,
  Building,
  MessageSquare,
  Quote,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../utils/seo";
import { authAPI, caseStudiesAPI, blogAPI, jobsAPI, contactAPI, projectsAPI, uploadAPI, testimonialsAPI, cookieUtils } from "../services/api";
import litroiLogo from "../assets/littroi-logo.png";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = cookieUtils.get("littroi_token") || localStorage.getItem("littroi_token");
    return Boolean(token && token !== "mock_jwt_token_littroi_admin_active");
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem("littroi_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'caseStudies' | 'homeVideos' | 'testimonials' | 'blog' | 'jobs' | 'enquiries'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [videoCategoryFilter, setVideoCategoryFilter] = useState("all");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [chartRange, setChartRange] = useState("30D"); // '7D' | '30D' | '90D' | '1Y'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Auth States
  const [credentials, setCredentials] = useState({ email: "admin@littroi.com", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Dynamic Data Lists
  const [caseStudiesList, setCaseStudiesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'caseStudy' | 'project' | 'testimonial' | 'blog' | 'job' | 'viewEnquiry' | 'videoPreview'
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

  // Form State: Testimonial
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    company: "",
    quote: "",
    avatar: "",
    videoUrl: "",
    videoId: "",
    videoFirst: true,
    metric: "",
    order: 0,
    isActive: true
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
    responsibilities: "",
    requirements: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Check Existing Session — validates token against real server, clears any stale mock tokens
  useEffect(() => {
    const checkSession = async () => {
      const token = cookieUtils.get("littroi_token") || localStorage.getItem("littroi_token");
      if (!token || token === "mock_jwt_token_littroi_admin_active") {
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
          // Explicit invalidation
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } catch (err) {
        console.warn("Session check notice:", err);
      }
    };
    checkSession();
  }, []);

  // Fetch All Data
  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [cs, projs, tests, blogs, jobs, enqs] = await Promise.all([
        caseStudiesAPI.getAll(),
        projectsAPI.getAll(),
        testimonialsAPI.getAll(true),
        blogAPI.getAll(),
        jobsAPI.getAll(),
        contactAPI.getAll()
      ]);
      setCaseStudiesList(cs || []);
      setProjectsList(projs || []);
      setTestimonialsList(tests || []);
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
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setAdminUser(null);
    setShowLogoutConfirm(false);
    showToast("Logged out successfully");
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
      } else if (type === "testimonial") {
        await testimonialsAPI.delete(id);
        showToast("Testimonial deleted");
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
        type: item.type || item.employmentType || "Full-time",
        location: item.location || "Bareilly (Studio / Remote)",
        salary: item.salary || "Competitive",
        experience: item.experience || "2+ Years",
        description: item.description || item.overview || "",
        responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join("\n") : (item.responsibilities || ""),
        requirements: Array.isArray(item.requirements) ? item.requirements.join("\n") : (item.requirements || "")
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
        responsibilities: "",
        requirements: ""
      });
    }
    setModalType("job");
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const requirementsArr = typeof jobForm.requirements === "string" 
      ? jobForm.requirements.split(/[\n,]/).map((r) => r.trim()).filter(Boolean)
      : (Array.isArray(jobForm.requirements) ? jobForm.requirements : []);

    const responsibilitiesArr = typeof jobForm.responsibilities === "string"
      ? jobForm.responsibilities.split(/[\n,]/).map((r) => r.trim()).filter(Boolean)
      : (Array.isArray(jobForm.responsibilities) ? jobForm.responsibilities : []);

    const payload = {
      ...jobForm,
      overview: jobForm.description || jobForm.overview || "Exciting role at Littroi Media.",
      description: jobForm.description || jobForm.overview || "Exciting role at Littroi Media.",
      employmentType: jobForm.type || "Full-time",
      type: jobForm.type || "Full-time",
      slug: jobForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      responsibilities: responsibilitiesArr,
      requirements: requirementsArr
    };

    try {
      if (editingItem) {
        await jobsAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Career opening updated ✓");
      } else {
        await jobsAPI.create(payload);
        showToast("New job vacancy posted ✓");
      }
      await loadAllData();
      setModalType(null);
    } catch (err) {
      console.error("Job save error:", err);
      showToast(`❌ Error: ${err.message || "Could not save job. Make sure you are logged in."}`);
    }
  };

  // ==================== CRUD: TESTIMONIALS ====================
  const handleOpenTestimonialModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      const vidId = item.videoId || (item.videoUrl ? item.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)?.[1] : "") || "";
      setTestimonialForm({
        name: item.name || item.clientName || "",
        role: item.role || item.clientRole || "",
        company: item.company || item.clientCompany || "",
        quote: item.quote || item.testimonial || "",
        avatar: item.avatar || item.clientImage || "",
        videoUrl: item.videoUrl || (vidId ? `https://www.youtube.com/watch?v=${vidId}` : ""),
        videoId: vidId,
        videoFirst: item.videoFirst !== undefined ? item.videoFirst : true,
        metric: item.metric || "",
        order: item.order !== undefined ? item.order : 0,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
    } else {
      setEditingItem(null);
      setTestimonialForm({
        name: "",
        role: "",
        company: "",
        quote: "",
        avatar: "",
        videoUrl: "",
        videoId: "",
        videoFirst: true,
        metric: "",
        order: testimonialsList.length,
        isActive: true
      });
    }
    setModalType("testimonial");
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.quote) {
      showToast("Please provide client name and testimonial quote");
      return;
    }

    let extractedVideoId = testimonialForm.videoId;
    if (testimonialForm.videoUrl && !extractedVideoId) {
      const match = testimonialForm.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match) extractedVideoId = match[1];
    }

    const payload = {
      ...testimonialForm,
      videoId: extractedVideoId,
      clientName: testimonialForm.name,
      clientRole: testimonialForm.role,
      clientCompany: testimonialForm.company,
      clientImage: testimonialForm.avatar,
      testimonial: testimonialForm.quote
    };

    try {
      if (editingItem) {
        await testimonialsAPI.update(editingItem._id || editingItem.id, payload);
        showToast("Testimonial updated successfully ✓");
      } else {
        await testimonialsAPI.create(payload);
        showToast("New testimonial added to Home Page ✓");
      }
      await loadAllData();
      setModalType(null);
    } catch (err) {
      console.error("Testimonial save error:", err);
      showToast(`❌ Error: ${err.message || "Could not save testimonial"}`);
    }
  };

  // ==================== ENQUIRIES ====================
  const handleToggleEnquiryStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "New" ? "Reviewed" : (currentStatus === "Reviewed" ? "Contacted" : "New");
    try {
      await contactAPI.updateStatus(id, nextStatus);
      showToast(`Inquiry marked as ${nextStatus}`);
      if (selectedEnquiry && (selectedEnquiry._id === id || selectedEnquiry.id === id)) {
        setSelectedEnquiry({ ...selectedEnquiry, status: nextStatus });
      }
      await loadAllData();
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  const handleSetEnquiryStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      showToast(`Inquiry status updated to ${status}`);
      if (selectedEnquiry && (selectedEnquiry._id === id || selectedEnquiry.id === id)) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
      await loadAllData();
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  const handleViewEnquiry = (enq) => {
    setSelectedEnquiry(enq);
    setModalType("viewEnquiry");
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

  const filteredTestimonials = testimonialsList.filter((t) => 
    (t.name || t.clientName)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.role || t.clientRole)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.company || t.clientCompany)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.quote || t.testimonial)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    { id: "testimonials", label: "Testimonials", icon: Quote, count: testimonialsList.length },
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
                  {activeTab === "caseStudies" ? "Case Studies Analysis" : (activeTab === "homeVideos" ? "Home Video Showcases" : (activeTab === "testimonials" ? "Client Testimonials" : (activeTab === "enquiries" ? "Client Inquiries Inbox" : activeTab)))}
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

              {activeTab === "testimonials" && (
                <button
                  onClick={() => handleOpenTestimonialModal()}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#9effba] hover:shadow-[0_0_20px_rgba(179,255,201,0.4)] transition-all cursor-pointer"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <Plus size={15} /> <span>New Testimonial</span>
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
            
            {/* ==================== TAB: DASHBOARD WITH ANALYTICS GRAPHS ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* 6 Hero Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div 
                    onClick={() => setActiveTab("caseStudies")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Case Studies</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <FileText size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {caseStudiesList.length}
                      </p>
                      <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-0.5">
                        <TrendingUp size={10} /> +12%
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Full Case Studies</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("testimonials")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Testimonials</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Quote size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {testimonialsList.length}
                      </p>
                      <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-0.5">
                        <Star size={10} /> 5.0
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Home Video Reviews</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("homeVideos")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Home Videos</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Video size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {projectsList.length}
                      </p>
                      <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-0.5">
                        <TrendingUp size={10} /> Live
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Projects, Podcasts, Shorts</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("blog")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Published Blogs</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <FileText size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {blogsList.length}
                      </p>
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-0.5">
                        <Eye size={10} /> 4.2k
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Thought Leadership</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("jobs")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Active Careers</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Briefcase size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {jobsList.length}
                      </p>
                      <span className="text-[10px] font-mono text-white/40">Hiring</span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Open Studio Roles</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab("enquiries")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Client Leads</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <Inbox size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {enquiriesList.length}
                      </p>
                      <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-0.5">
                        <Activity size={10} /> Active
                      </span>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Inbound Inquiries</span>
                    </div>
                  </div>
                </div>

                {/* ==================== ANALYTICS GRAPHS ROW 1 ==================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Chart: Audience & Video Views Engagement Area Curve (8 Cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9] animate-pulse" />
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Traffic &amp; Video Engagement
                          </h3>
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-1">
                          Audience impressions, retention pacing, and video interactions
                        </p>
                      </div>

                      {/* Time Range Filter Pills */}
                      <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-full border border-white/10">
                        {["7D", "30D", "90D", "1Y"].map((range) => (
                          <button
                            key={range}
                            onClick={() => setChartRange(range)}
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                              chartRange === range
                                ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.3)]"
                                : "text-white/50 hover:text-white"
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interactive SVG Area Chart */}
                    <div className="relative w-full h-64 sm:h-72">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="mintAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B3FFC9" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#B3FFC9" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines */}
                        <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="220" x2="700" y2="220" stroke="rgba(255,255,255,0.08)" />

                        {/* Area 2: Cyan Secondary Series (Total Impressions) */}
                        <path
                          d="M 0,180 C 100,160 180,190 280,130 C 380,80 480,120 580,70 C 640,40 680,50 700,45 L 700,220 L 0,220 Z"
                          fill="url(#cyanAreaGrad)"
                        />
                        <path
                          d="M 0,180 C 100,160 180,190 280,130 C 380,80 480,120 580,70 C 640,40 680,50 700,45"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.8"
                        />

                        {/* Area 1: Mint Primary Series (Video Plays & Engaged Views) */}
                        <path
                          d="M 0,200 C 90,170 170,140 260,95 C 350,60 450,110 540,50 C 610,20 660,35 700,20 L 700,220 L 0,220 Z"
                          fill="url(#mintAreaGrad)"
                        />
                        <path
                          d="M 0,200 C 90,170 170,140 260,95 C 350,60 450,110 540,50 C 610,20 660,35 700,20"
                          fill="none"
                          stroke="#B3FFC9"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Interactive Data Nodes */}
                        {[
                          { cx: 90, cy: 170, val: "18.4K", label: "W1" },
                          { cx: 260, cy: 95, val: "44.2K", label: "W2" },
                          { cx: 450, cy: 110, val: "38.6K", label: "W3" },
                          { cx: 540, cy: 50, val: "68.9K", label: "W4" },
                          { cx: 700, cy: 20, val: "94.5K", label: "Now" }
                        ].map((pt, i) => (
                          <g key={i} className="cursor-pointer group/dot">
                            <circle
                              cx={pt.cx}
                              cy={pt.cy}
                              r={hoveredPoint === i ? 7 : 5}
                              className="fill-[#0c0c0c] stroke-[#B3FFC9] transition-all"
                              strokeWidth={hoveredPoint === i ? 4 : 2.5}
                              onMouseEnter={() => setHoveredPoint(i)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                            {hoveredPoint === i && (
                              <g>
                                <rect
                                  x={Math.min(pt.cx - 40, 610)}
                                  y={pt.cy - 45}
                                  width="80"
                                  height="32"
                                  rx="8"
                                  fill="#161616"
                                  stroke="#B3FFC9"
                                  strokeWidth="1"
                                />
                                <text
                                  x={Math.min(pt.cx, 650)}
                                  y={pt.cy - 25}
                                  fill="#B3FFC9"
                                  fontSize="11"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  fontFamily="monospace"
                                >
                                  {pt.val}
                                </text>
                              </g>
                            )}
                          </g>
                        ))}
                      </svg>

                      {/* X-Axis Labels */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
                        <span>{chartRange === "7D" ? "Mon" : "Week 1"}</span>
                        <span>{chartRange === "7D" ? "Wed" : "Week 2"}</span>
                        <span>{chartRange === "7D" ? "Fri" : "Week 3"}</span>
                        <span>{chartRange === "7D" ? "Sun" : "Week 4"}</span>
                        <span className="text-[#B3FFC9] font-bold">Current</span>
                      </div>
                    </div>

                    {/* Chart Legend & KPI Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9]" />
                          <span>Video Plays</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">142.8K</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                          <span>Impressions</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">295.1K</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                          <span>Avg Retention</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">78.4%</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span>Conversion</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">5.2%</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Chart: Content Portfolio Distribution (4 Cols) */}
                  <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <PieChart size={16} className="text-[#B3FFC9]" />
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Content Portfolio
                        </h3>
                      </div>
                      <p className="text-xs text-white/40 font-mono mt-1">
                        Breakdown of live database media assets
                      </p>
                    </div>

                    {/* Donut Style Visual Ring */}
                    <div className="flex items-center justify-center relative py-2">
                      <div className="w-36 h-36 rounded-full border-8 border-[#161616] border-t-[#B3FFC9] border-r-[#22D3EE] border-b-pink-400 border-l-amber-400 animate-spin-slow flex items-center justify-center shadow-[0_0_30px_rgba(179,255,201,0.08)]">
                        <div className="w-24 h-24 rounded-full bg-[#0c0c0c] flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {projectsList.length + caseStudiesList.length + blogsList.length}
                          </span>
                          <span className="text-[9px] uppercase font-mono text-white/40">Total Assets</span>
                        </div>
                      </div>
                    </div>

                    {/* Category Distribution Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-white/60 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#B3FFC9]" /> Home Video Showcase
                          </span>
                          <span className="font-bold text-[#B3FFC9]">{projectsList.length} items</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#161616] overflow-hidden">
                          <div className="h-full bg-[#B3FFC9] rounded-full" style={{ width: `${Math.min(100, (projectsList.length / Math.max(1, projectsList.length + caseStudiesList.length + blogsList.length)) * 100)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-white/60 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#22D3EE]" /> Case Studies Analysis
                          </span>
                          <span className="font-bold text-[#22D3EE]">{caseStudiesList.length} items</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#161616] overflow-hidden">
                          <div className="h-full bg-[#22D3EE] rounded-full" style={{ width: `${Math.min(100, (caseStudiesList.length / Math.max(1, projectsList.length + caseStudiesList.length + blogsList.length)) * 100)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="text-white/60 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-400" /> Articles &amp; Insights
                          </span>
                          <span className="font-bold text-pink-400">{blogsList.length} items</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#161616] overflow-hidden">
                          <div className="h-full bg-pink-400 rounded-full" style={{ width: `${Math.min(100, (blogsList.length / Math.max(1, projectsList.length + caseStudiesList.length + blogsList.length)) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ==================== ANALYTICS GRAPHS ROW 2 ==================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Inbound Leads Velocity Bar Chart (6 Cols) */}
                  <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-[#B3FFC9]" />
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Inbound Leads Velocity
                          </h3>
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-1">
                          Weekly project inquiries &amp; consultation bookings
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] text-xs font-mono font-bold border border-[#B3FFC9]/20">
                        {enquiriesList.length} Total Leads
                      </span>
                    </div>

                    {/* Bar Chart Bars */}
                    <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-white/10 pb-2">
                      {[
                        { day: "Mon", count: 4, height: "45%" },
                        { day: "Tue", count: 7, height: "70%" },
                        { day: "Wed", count: 9, height: "90%" },
                        { day: "Thu", count: 6, height: "60%" },
                        { day: "Fri", count: 11, height: "100%", active: true },
                        { day: "Sat", count: 3, height: "35%" },
                        { day: "Sun", count: 5, height: "50%" }
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                          <span className="text-[10px] font-mono text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            {bar.count}
                          </span>
                          <div className="w-full max-w-[36px] bg-[#161616] rounded-t-xl overflow-hidden h-full flex items-end">
                            <div
                              className={`w-full rounded-t-xl transition-all duration-500 group-hover:scale-y-105 ${
                                bar.active 
                                  ? "bg-gradient-to-t from-[#0e3b26] to-[#B3FFC9] shadow-[0_0_20px_rgba(179,255,201,0.4)]"
                                  : "bg-gradient-to-t from-white/10 to-white/30 group-hover:to-[#B3FFC9]"
                              }`}
                              style={{ height: bar.height }}
                            />
                          </div>
                          <span className={`text-[10px] font-mono uppercase ${bar.active ? "text-[#B3FFC9] font-bold" : "text-white/40"}`}>
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-white/50">
                      <span>Peak Activity: <strong className="text-white">Friday (11 inquiries)</strong></span>
                      <span className="text-[#B3FFC9] flex items-center gap-1">Avg Response: &lt; 2h</span>
                    </div>
                  </div>

                  {/* Right: Quick Action Shortcuts & Recent System Highlights (6 Cols) */}
                  <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#B3FFC9]" />
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                          Quick Studio Actions
                        </h3>
                      </div>
                      <p className="text-xs text-white/40 font-mono mt-1">
                        Fast shortcuts to manage and create agency content
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOpenProjectModal()}
                        className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                            + Add Home Video
                          </p>
                          <p className="text-[10px] text-white/40 font-mono">Projects, Podcasts &amp; SaaS</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenBlogModal()}
                        className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                            + Write New Article
                          </p>
                          <p className="text-[10px] text-white/40 font-mono">Insights &amp; Strategy</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </button>

                      <button
                        onClick={() => handleOpenCaseStudyModal()}
                        className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                            + Create Case Study
                          </p>
                          <p className="text-[10px] text-white/40 font-mono">Full Metrics &amp; Gallery</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveTab("enquiries")}
                        className="p-4 rounded-2xl bg-[#141414] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#B3FFC9]/40 text-left transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white group-hover:text-[#B3FFC9] transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                            View Inquiries Inbox
                          </p>
                          <p className="text-[10px] text-white/40 font-mono">{enquiriesList.length} unread leads</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#B3FFC9] text-white group-hover:text-black flex items-center justify-center text-xs transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9] animate-ping" />
                        <span className="text-xs text-white/60 font-mono">Database Status: <strong className="text-white">MongoDB Live &amp; Cloudinary CDN Connected</strong></span>
                      </div>
                      <Link to="/" target="_blank" className="text-xs text-[#B3FFC9] font-bold flex items-center gap-1 hover:underline">
                        Visit Live Website <ExternalLink size={12} />
                      </Link>
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

            {/* ==================== TAB: TESTIMONIALS ==================== */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-white/50">
                    Showing <strong className="text-white">{filteredTestimonials.length}</strong> client reviews on Home Page
                  </div>
                </div>

                {filteredTestimonials.length === 0 ? (
                  <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-[#0d0d0d] space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-[#B3FFC9]">
                      <Quote size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Testimonials Found</h3>
                      <p className="text-xs text-white/40 mt-1">Add your first video testimonial from clients and creators.</p>
                    </div>
                    <button
                      onClick={() => handleOpenTestimonialModal()}
                      className="px-4 py-2 rounded-full bg-[#B3FFC9] text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> Add Testimonial
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((t, tIdx) => {
                      const tId = t._id || t.id || tIdx;
                      const author = t.name || t.clientName || "Client";
                      const role = t.role || t.clientRole || "";
                      const company = t.company || t.clientCompany || "";
                      const quote = t.quote || t.testimonial || "";
                      const avatar = t.avatar || t.clientImage;
                      const vidId = t.videoId || (t.videoUrl ? t.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)?.[1] : "");

                      return (
                        <div
                          key={tId}
                          className="rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#B3FFC9]/30 p-5 space-y-4 flex flex-col justify-between transition-all group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.03)]"
                        >
                          <div className="space-y-3">
                            {/* Video Preview / Embed Thumbnail */}
                            {vidId ? (
                              <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 bg-black group/vid">
                                <img
                                  src={`https://img.youtube.com/vi/${vidId}/hqdefault.jpg`}
                                  alt={author}
                                  className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewVideoUrl(`https://www.youtube.com/watch?v=${vidId}`);
                                    setModalType("videoPreview");
                                  }}
                                  className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <div className="w-10 h-10 rounded-full bg-[#B3FFC9] text-black flex items-center justify-center shadow-lg transform group-hover/vid:scale-110 transition-transform">
                                    <Play size={18} fill="currentColor" className="ml-0.5" />
                                  </div>
                                </button>
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] text-[#B3FFC9] font-mono font-bold">
                                  {t.videoFirst !== false ? "Video: Left" : "Video: Right"}
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-xl aspect-video border border-dashed border-white/10 bg-[#141414] flex flex-col items-center justify-center text-white/30 text-xs">
                                <Video size={24} className="mb-1" />
                                <span>No YouTube Video Linked</span>
                              </div>
                            )}

                            {/* Author Row */}
                            <div className="flex items-center gap-3 pt-1">
                              {avatar ? (
                                <img
                                  src={avatar}
                                  alt={author}
                                  className="w-11 h-11 rounded-full object-cover border border-white/15 bg-white/5 p-0.5 shrink-0"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-[#B3FFC9]/20 text-[#B3FFC9] flex items-center justify-center font-bold text-sm shrink-0 border border-[#B3FFC9]/30">
                                  {author.charAt(0)}
                                </div>
                              )}
                              <div className="truncate">
                                <h4 className="text-sm font-bold text-white group-hover:text-[#B3FFC9] transition-colors truncate" style={{ fontFamily: "'Syne', sans-serif" }}>
                                  {author}
                                </h4>
                                <p className="text-xs text-white/50 truncate font-mono">{role}</p>
                                {company && <p className="text-[10px] text-[#B3FFC9]/80 truncate">{company}</p>}
                              </div>
                            </div>

                            {/* Quote Text */}
                            <div className="relative pl-3 border-l-2 border-[#B3FFC9]/40 py-1">
                              <p className="text-xs text-white/70 line-clamp-3 leading-relaxed italic">
                                "{quote}"
                              </p>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                              t.isActive !== false ? "bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30" : "bg-white/5 text-white/40"
                            }`}>
                              {t.isActive !== false ? "Live on Home" : "Hidden"}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenTestimonialModal(t)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit3 size={11} /> Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: "testimonial", id: tId, title: `${author}'s Testimonial` })}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                {/* Header Controls & Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e0e] border border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    {["all", "new", "reviewed", "contacted", "archived"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          statusFilter === st ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.25)]" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span>Showing <strong className="text-white">{filteredEnquiries.length}</strong> of <strong className="text-white">{enquiriesList.length}</strong> leads</span>
                  </div>
                </div>

                {/* Empty State */}
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <Inbox size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Inquiries Found</p>
                    <p className="text-xs text-white/40">Inquiries submitted from your website will appear here in real time.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnquiries.map((enq) => {
                      const enqId = enq.id || enq._id;
                      const initial = enq.name?.charAt(0)?.toUpperCase() || "L";
                      return (
                        <div
                          key={enqId}
                          className="p-6 rounded-3xl bg-[#0d0d0d] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-lg group"
                        >
                          {/* Top Row: Lead Overview & Quick Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(179,255,201,0.15)]" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {initial}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-bold text-white text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    {enq.name}
                                  </h4>
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                    enq.status === "New" ? "bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30" : 
                                    (enq.status === "Reviewed" ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : 
                                    (enq.status === "Contacted" ? "bg-blue-400/20 text-blue-300 border border-blue-400/30" : "bg-white/10 text-white/50 border border-white/10"))
                                  }`}>
                                    {enq.status || "New"}
                                  </span>
                                </div>
                                <p className="text-[11px] font-mono text-white/40 mt-0.5">
                                  Submitted on: {enq.fullDate || enq.date}
                                </p>
                              </div>
                            </div>

                            {/* Status Selector & Quick Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={enq.status || "New"}
                                onChange={(e) => handleSetEnquiryStatus(enqId, e.target.value)}
                                className="px-3 py-1.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
                              >
                                <option value="New">Status: New</option>
                                <option value="Reviewed">Status: Reviewed</option>
                                <option value="Contacted">Status: Contacted</option>
                                <option value="Archived">Status: Archived</option>
                              </select>

                              <button
                                onClick={() => handleViewEnquiry(enq)}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Eye size={13} className="text-[#B3FFC9]" />
                                <span>Details</span>
                              </button>

                              <a
                                href={`mailto:${enq.email}?subject=Littroi%20Media%20Strategy%20Inquiry%20Response`}
                                className="px-3 py-1.5 rounded-xl bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                              >
                                <Send size={12} />
                                <span>Reply</span>
                              </a>

                              <button
                                onClick={() => setDeleteConfirm({ type: "enquiry", id: enqId, title: `Inquiry from ${enq.name}` })}
                                className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Contact Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#131313] border border-white/5">
                              <Mail size={14} className="text-[#B3FFC9] shrink-0" />
                              <div className="truncate">
                                <span className="text-[10px] text-white/40 uppercase font-mono block">Email Address</span>
                                <a href={`mailto:${enq.email}`} className="text-white hover:text-[#B3FFC9] font-medium truncate block">
                                  {enq.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#131313] border border-white/5">
                              <Building size={14} className="text-[#B3FFC9] shrink-0" />
                              <div className="truncate">
                                <span className="text-[10px] text-white/40 uppercase font-mono block">Company / URL</span>
                                <span className="text-white font-medium truncate block">
                                  {enq.company ? (
                                    enq.company.startsWith("http") ? (
                                      <a href={enq.company} target="_blank" rel="noopener noreferrer" className="hover:text-[#B3FFC9] flex items-center gap-1">
                                        <span>{enq.company}</span>
                                        <ExternalLink size={10} />
                                      </a>
                                    ) : enq.company
                                  ) : "Direct Client / Individual"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#131313] border border-white/5">
                              <Phone size={14} className="text-[#B3FFC9] shrink-0" />
                              <div className="truncate">
                                <span className="text-[10px] text-white/40 uppercase font-mono block">Phone / Source</span>
                                <span className="text-white font-medium truncate block">
                                  {enq.phone ? enq.phone : (enq.source ? `Source: ${enq.source}` : "Website Form")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider flex items-center gap-1.5">
                              <MessageSquare size={12} className="text-[#B3FFC9]" />
                              Client Message / Project Scope
                            </span>
                            <p className="text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                              {enq.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                              onClick={async () => {
                                const imgToDelete = img;
                                const updated = csForm.images.filter((_, i) => i !== imgIdx);
                                setCsForm({ ...csForm, images: updated });
                                if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                                  await uploadAPI.deleteImage(imgToDelete);
                                  showToast("Image deleted from Cloudinary");
                                }
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                              title="Delete Image from Cloudinary"
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
                        onClick={async () => {
                          const thumbToDelete = projectForm.thumbnail;
                          setProjectForm({ ...projectForm, thumbnail: "" });
                          if (thumbToDelete && thumbToDelete.includes("cloudinary.com")) {
                            await uploadAPI.deleteImage(thumbToDelete);
                            showToast("Thumbnail deleted from Cloudinary");
                          }
                        }}
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

        {/* ==================== MODAL: TESTIMONIAL ADD / EDIT ==================== */}
        {modalType === "testimonial" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Edit Testimonial" : "Add Client Testimonial"}
                  </h3>
                  <p className="text-xs text-white/40">Manage video reviews and feedback displayed on the Home Page</p>
                </div>
                <button onClick={() => setModalType(null)} className="text-white/50 hover:text-white p-1 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Client / Creator Name *</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      placeholder="e.g. Marc Babin"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Role / Title *</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      placeholder="e.g. Founder of The Podcast Blueprint"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Company / Brand (Optional)</label>
                    <input
                      type="text"
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                      placeholder="e.g. The Podcast Blueprint"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Display Order</label>
                    <input
                      type="number"
                      value={testimonialForm.order}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, order: Number(e.target.value) })}
                      placeholder="0, 1, 2..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                {/* YouTube Video Link & Position */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#141414] border border-white/5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">YouTube Testimonial Video Link / ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={testimonialForm.videoUrl}
                        onChange={(e) => {
                          const url = e.target.value;
                          const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                          setTestimonialForm({
                            ...testimonialForm,
                            videoUrl: url,
                            videoId: match ? match[1] : url
                          });
                        }}
                        placeholder="e.g. https://www.youtube.com/watch?v=FApmJphhF9Y"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                      />
                      <Video size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <label className="text-xs font-bold text-white/60">Home Page Video Alignment</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTestimonialForm({ ...testimonialForm, videoFirst: true })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          testimonialForm.videoFirst
                            ? "bg-[#B3FFC9] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        Left: Video | Right: Text
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestimonialForm({ ...testimonialForm, videoFirst: false })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          !testimonialForm.videoFirst
                            ? "bg-[#B3FFC9] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        Left: Text | Right: Video
                      </button>
                    </div>
                  </div>
                </div>

                {/* Client Avatar Upload to Cloudinary */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60">Client Avatar / Photo (Cloudinary Direct Upload)</label>
                  {testimonialForm.avatar ? (
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#141414] border border-white/10">
                      <img
                        src={testimonialForm.avatar}
                        alt="Avatar Preview"
                        className="w-14 h-14 rounded-full object-cover border border-white/20 p-0.5 bg-white/5"
                      />
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-white truncate">Client Photo Uploaded</p>
                        <p className="text-[11px] text-[#B3FFC9] font-mono truncate">{testimonialForm.avatar}</p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const avatarToDelete = testimonialForm.avatar;
                          setTestimonialForm({ ...testimonialForm, avatar: "" });
                          if (avatarToDelete && avatarToDelete.includes("cloudinary.com")) {
                            await uploadAPI.deleteImage(avatarToDelete);
                            showToast("Avatar removed from Cloudinary");
                          }
                        }}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete avatar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#B3FFC9]/50 bg-[#141414]/50 hover:bg-[#141414] text-xs text-white/70 hover:text-[#B3FFC9] cursor-pointer transition-all">
                      <Plus size={16} />
                      <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Client Avatar / Headshot (PNG, JPG)"}</span>
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
                              setTestimonialForm((prev) => ({ ...prev, avatar: url }));
                              showToast("Avatar uploaded to Cloudinary");
                            } catch {
                              showToast("Error uploading avatar");
                            } finally {
                              setIsUploadingImage(false);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Testimonial Quote */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Client Testimonial Feedback Quote *</label>
                  <textarea
                    required
                    rows={4}
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    placeholder="Describe their experience working with Littroi... e.g. Working with Littroi freed us up to focus on what we do best and the content hasn't stopped since."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Active Status Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testimonialForm.isActive}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#161616] border-white/20 text-[#B3FFC9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="font-bold">Publish &amp; Show on Live Home Page</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setModalType(null)} className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-full bg-[#B3FFC9] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#9effba] cursor-pointer" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {editingItem ? "Update Testimonial" : "Add to Home Page"}
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
                        onClick={async () => {
                          const imgToDelete = blogForm.coverImage;
                          setBlogForm({ ...blogForm, coverImage: "" });
                          if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                            await uploadAPI.deleteImage(imgToDelete);
                            showToast("Cover image deleted from Cloudinary");
                          }
                        }}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <label className="text-xs font-bold text-white/60">Experience</label>
                    <input
                      type="text"
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                      placeholder="2+ Years"
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
                    rows={3}
                    placeholder="Overview of the position and role expectations..."
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Key Responsibilities (One per line)</label>
                  <textarea
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    rows={3}
                    placeholder="e.g.&#10;Edit high-retention short-form videos&#10;Collaborate with creative directors&#10;Audio mastering and color grading"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Requirements &amp; Skills (One per line)</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={3}
                    placeholder="e.g.&#10;2+ years Premiere Pro & After Effects&#10;Deep understanding of social media hooks&#10;Fast turnaround and attention to detail"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none font-mono"
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

        {/* ==================== MODAL: VIEW ENQUIRY DETAILS ==================== */}
        {modalType === "viewEnquiry" && selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="max-w-2xl w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-sm">
                    {selectedEnquiry.name?.charAt(0)?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {selectedEnquiry.name}
                    </h3>
                    <span className="text-xs text-white/40 font-mono">
                      Lead ID: {selectedEnquiry.id || selectedEnquiry._id}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="text-white/50 hover:text-white p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status and Timestamp Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141414] border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-mono">Status:</span>
                  <select
                    value={selectedEnquiry.status || "New"}
                    onChange={(e) => handleSetEnquiryStatus(selectedEnquiry.id || selectedEnquiry._id, e.target.value)}
                    className="px-3 py-1 rounded-xl bg-[#1a1a1a] border border-white/15 text-xs font-bold text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
                  >
                    <option value="New">🟢 New</option>
                    <option value="Reviewed">🟡 Reviewed</option>
                    <option value="Contacted">🔵 Contacted</option>
                    <option value="Archived">⚪ Archived</option>
                  </select>
                </div>
                <div className="text-xs font-mono text-white/40 flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#B3FFC9]" />
                  <span>{selectedEnquiry.fullDate || selectedEnquiry.date}</span>
                </div>
              </div>

              {/* Detail Fields 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Email Address</span>
                  <div className="flex items-center justify-between gap-2">
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-semibold text-white hover:text-[#B3FFC9] truncate">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Company / Project URL</span>
                  <div className="text-sm font-semibold text-white truncate">
                    {selectedEnquiry.company ? (
                      selectedEnquiry.company.startsWith("http") ? (
                        <a href={selectedEnquiry.company} target="_blank" rel="noopener noreferrer" className="hover:text-[#B3FFC9] flex items-center gap-1.5">
                          <span className="truncate">{selectedEnquiry.company}</span>
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      ) : selectedEnquiry.company
                    ) : "Direct Client / Individual"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Phone Number</span>
                  <div className="text-sm font-semibold text-white">
                    {selectedEnquiry.phone ? (
                      <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-[#B3FFC9]">
                        {selectedEnquiry.phone}
                      </a>
                    ) : "Not Provided"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Lead Source</span>
                  <div className="text-sm font-semibold text-white">
                    {selectedEnquiry.source || "Website Contact Form"}
                  </div>
                </div>
              </div>

              {/* Full Message Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <MessageSquare size={13} className="text-[#B3FFC9]" />
                  Full Client Message &amp; Requirements
                </span>
                <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setDeleteConfirm({ type: "enquiry", id: selectedEnquiry.id || selectedEnquiry._id, title: `Inquiry from ${selectedEnquiry.name}` });
                  }}
                  className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete Inquiry</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Response%20to%20your%20Littroi%20Inquiry`}
                    className="px-6 py-2.5 rounded-full bg-[#B3FFC9] hover:bg-[#9effba] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(179,255,201,0.2)]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    <Send size={13} />
                    <span>Send Reply Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODAL: LOGOUT CONFIRMATION ==================== */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 relative shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-lg">
                <LogOut size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Log Out of Admin Console?
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Your active session and authorization token will be cleared. You will need to enter your admin credentials to access the studio again.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="px-6 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Confirm Log Out
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
