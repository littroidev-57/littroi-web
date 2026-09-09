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
  ChevronLeft,
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
  Star,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../utils/seo";
import { authAPI, caseStudiesAPI, blogAPI, jobsAPI, contactAPI, projectsAPI, uploadAPI, testimonialsAPI, jobApplicationsAPI, cookieUtils } from "../services/api";
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
  const [testimonialTypeFilter, setTestimonialTypeFilter] = useState("all"); // 'all' | 'video' | 'text'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [chartRange, setChartRange] = useState("30D"); // '7D' | '30D' | '90D' | '1Y'
  const [chartMetric, setChartMetric] = useState("all"); // 'all' | 'leads' | 'reach'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredDonutCat, setHoveredDonutCat] = useState(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Pagination State (per tab)
  const [currentPage, setCurrentPage] = useState({
    caseStudies: 1,
    homeVideos: 1,
    testimonials: 1,
    blog: 1,
    jobs: 1,
    jobApplications: 1,
    enquiries: 1
  });

  const [itemsPerPage, setItemsPerPage] = useState({
    caseStudies: 6,
    homeVideos: 8,
    testimonials: 6,
    blog: 6,
    jobs: 6,
    jobApplications: 8,
    enquiries: 8
  });

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
  const [jobApplicationsList, setJobApplicationsList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal States
  const [modalType, setModalType] = useState(null); // 'caseStudy' | 'project' | 'testimonial' | 'blog' | 'job' | 'viewEnquiry' | 'viewApplication' | 'videoPreview'
  const [editingItem, setEditingItem] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  // Delete Confirmation Popup State
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: string, id: string, title: string }

  // Form State: Case Study (Strictly Case Study content)
  const [csForm, setCsForm] = useState({
    title: "",
    client: "",
    handle: "",
    thumbnail: "",
    category: "Instagram Growth",
    images: [],
    tags: "Editing, Distribution",
    stat1Num: "",
    stat1Label: "Views / 30d",
    stat2Num: "",
    stat2Label: "Interactions",
    stat3Num: "",
    stat3Label: "Accounts reached",
    beforeAfter: [
      {
        beforeImage: "",
        afterImage: "",
        beforeLabel: "Before",
        afterLabel: "After",
        title: ""
      }
    ],
    beforeImage: "",
    afterImage: "",
    beforeLabel: "Before",
    afterLabel: "After",
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
    type: "video", // 'video' | 'text'
    videoUrl: "",
    videoId: "",
    videoFirst: true,
    metric: "",
    rating: 5,
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
      const [cs, projs, tests, blogs, jobs, enqs, jobApps] = await Promise.all([
        caseStudiesAPI.getAll(),
        projectsAPI.getAll(),
        testimonialsAPI.getAll(true),
        blogAPI.getAll(),
        jobsAPI.getAll(),
        contactAPI.getAll(),
        jobApplicationsAPI.getAll()
      ]);
      setCaseStudiesList(cs || []);
      setProjectsList(projs || []);
      setTestimonialsList(tests || []);
      setBlogsList(blogs || []);
      setJobsList(jobs || []);
      setEnquiriesList(enqs || []);
      setJobApplicationsList(jobApps || []);
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

  // ==================== DYNAMIC ANALYTICS & METRICS ENGINE ====================
  // Helper: Parse stat strings like '12M+', '350K', '80K+' into raw numeric values
  const parseStatToNumber = (str) => {
    if (!str) return 0;
    const s = String(str).trim().toUpperCase();
    const num = parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
    if (s.includes("M")) return num * 1000000;
    if (s.includes("K")) return num * 1000;
    return num;
  };

  // Helper: Format large numeric counts into human-readable compact strings (e.g. 14.2M, 350K)
  const formatMetricNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return String(Math.round(num));
  };

  // Helper: Smooth Cubic Bézier Spline generator for SVG Area / Line curves
  const generateSmoothSpline = (pts) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    let path = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = (p0.x + (p1.x - p0.x) / 2).toFixed(1);
      const cp1y = p0.y.toFixed(1);
      const cp2x = (p0.x + (p1.x - p0.x) / 2).toFixed(1);
      const cp2y = p1.y.toFixed(1);
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
    return path;
  };

  // 1. Live Content Portfolio Breakdown & True SVG Donut Angles
  const portfolioAnalytics = useMemo(() => {
    const total = projectsList.length + caseStudiesList.length + blogsList.length + testimonialsList.length + jobsList.length;
    const safeTotal = Math.max(1, total);

    const categories = [
      { key: "homeVideos", label: "Video Showcase", count: projectsList.length, color: "#B3FFC9", bg: "bg-[#B3FFC9]", text: "text-[#B3FFC9]", tab: "homeVideos" },
      { key: "caseStudies", label: "Case Studies", count: caseStudiesList.length, color: "#22D3EE", bg: "bg-[#22D3EE]", text: "text-[#22D3EE]", tab: "caseStudies" },
      { key: "blogs", label: "Insights & Articles", count: blogsList.length, color: "#F472B6", bg: "bg-pink-400", text: "text-pink-400", tab: "blog" },
      { key: "testimonials", label: "Client Reviews", count: testimonialsList.length, color: "#FBBF24", bg: "bg-amber-400", text: "text-amber-400", tab: "testimonials" },
      { key: "jobs", label: "Career Openings", count: jobsList.length, color: "#A78BFA", bg: "bg-purple-400", text: "text-purple-400", tab: "jobs" }
    ];

    const R = 46;
    const circumference = 2 * Math.PI * R; // ~289.02
    let currentOffset = 0;

    const segments = categories.map((cat) => {
      const pct = total > 0 ? (cat.count / safeTotal) * 100 : 0;
      const strokeLength = (pct / 100) * circumference;
      const dashoffset = -currentOffset;
      currentOffset += strokeLength;
      return {
        ...cat,
        pct: Math.round(pct),
        exactPct: pct,
        strokeLength,
        dasharray: `${strokeLength} ${circumference}`,
        dashoffset
      };
    });

    const activeHoverItem = hoveredDonutCat
      ? segments.find((s) => s.key === hoveredDonutCat)
      : null;

    return {
      total,
      categories: segments,
      activeHoverItem,
      circumference,
      radius: R
    };
  }, [projectsList.length, caseStudiesList.length, blogsList.length, testimonialsList.length, jobsList.length, hoveredDonutCat]);

  // 2. Case Studies Documented Reach & Impact Stats
  const caseStudyReachMetrics = useMemo(() => {
    let totalViews = 0;
    let totalInteractions = 0;
    let validStatEntries = 0;

    caseStudiesList.forEach((cs) => {
      if (Array.isArray(cs.stats)) {
        cs.stats.forEach((st) => {
          const val = parseStatToNumber(st?.num);
          const label = String(st?.label || "").toLowerCase();
          if (val > 0) {
            validStatEntries++;
            if (label.includes("view") || label.includes("reach") || label.includes("impression")) {
              totalViews += val;
            } else {
              totalInteractions += val;
            }
          }
        });
      }
      if (Array.isArray(cs.metrics)) {
        cs.metrics.forEach((m) => {
          const val = parseStatToNumber(m?.value);
          if (val > 0) totalViews += val;
        });
      }
    });

    // Default studio baseline if fresh database
    const aggregateViews = totalViews > 0 ? totalViews : 4850000;
    const aggregateInteractions = totalInteractions > 0 ? totalInteractions : 1240000;

    return {
      totalViews: aggregateViews,
      formattedViews: formatMetricNumber(aggregateViews),
      totalInteractions: aggregateInteractions,
      formattedInteractions: formatMetricNumber(aggregateInteractions),
      validCount: validStatEntries
    };
  }, [caseStudiesList]);

  // 3. Client Inquiries Funnel & Pipeline Analytics
  const inquiryPipelineStats = useMemo(() => {
    const total = enquiriesList.length;
    const newCount = enquiriesList.filter((e) => e.status === "New" || !e.status).length;
    const reviewedCount = enquiriesList.filter((e) => e.status === "Reviewed").length;
    const contactedCount = enquiriesList.filter((e) => e.status === "Contacted").length;
    const archivedCount = enquiriesList.filter((e) => e.status === "Archived").length;
    const conversionRate = total > 0 ? Math.round(((reviewedCount + contactedCount) / total) * 100) : 0;

    return {
      total,
      newCount,
      reviewedCount,
      contactedCount,
      archivedCount,
      conversionRate
    };
  }, [enquiriesList]);

  // 4. Dynamic Time-Series Data Generator (Interactive SVG Curves)
  const timeSeriesAnalytics = useMemo(() => {
    const totalLeads = enquiriesList.length;
    const totalPortfolio = projectsList.length + caseStudiesList.length + blogsList.length;
    const reachBase = caseStudyReachMetrics.totalViews;

    // Define interval points and labels based on chartRange
    let pointsCount = 6;
    let labels = [];
    let leadMultipliers = [];
    let reachMultipliers = [];

    if (chartRange === "7D") {
      pointsCount = 7;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const now = new Date();
      labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        return {
          short: days[d.getDay()],
          full: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          dateObj: d
        };
      });
      leadMultipliers = [0.2, 0.4, 0.6, 0.5, 0.85, 0.7, 1.0];
      reachMultipliers = [0.35, 0.45, 0.6, 0.55, 0.8, 0.9, 1.0];
    } else if (chartRange === "30D") {
      pointsCount = 5;
      labels = [
        { short: "Week 1", full: "Days 1 - 7" },
        { short: "Week 2", full: "Days 8 - 14" },
        { short: "Week 3", full: "Days 15 - 21" },
        { short: "Week 4", full: "Days 22 - 28" },
        { short: "Current", full: "Last 48 Hours" }
      ];
      leadMultipliers = [0.3, 0.55, 0.45, 0.8, 1.0];
      reachMultipliers = [0.4, 0.6, 0.75, 0.88, 1.0];
    } else if (chartRange === "90D") {
      pointsCount = 6;
      const now = new Date();
      labels = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - Math.round((5 - i) * 16));
        return {
          short: d.toLocaleDateString("en-US", { month: "short" }) + (i % 2 === 0 ? " (E)" : " (L)"),
          full: d.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
          dateObj: d
        };
      });
      leadMultipliers = [0.25, 0.4, 0.6, 0.5, 0.85, 1.0];
      reachMultipliers = [0.3, 0.5, 0.65, 0.75, 0.9, 1.0];
    } else {
      // 1Y
      pointsCount = 6;
      const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
      labels = months.map((m) => ({ short: m, full: `Month of ${m}` }));
      leadMultipliers = [0.2, 0.35, 0.5, 0.7, 0.85, 1.0];
      reachMultipliers = [0.25, 0.42, 0.6, 0.78, 0.92, 1.0];
    }

    // Dynamic scale values
    const primarySeries = labels.map((lbl, idx) => {
      const mult = leadMultipliers[idx] || 0.5;
      const computedLeads = totalLeads > 0
        ? Math.max(1, Math.round(totalLeads * mult))
        : Math.round(12 * mult);
      return {
        label: lbl.short,
        fullDate: lbl.full,
        leads: computedLeads,
        primaryVal: computedLeads
      };
    });

    const secondarySeries = labels.map((lbl, idx) => {
      const mult = reachMultipliers[idx] || 0.5;
      const computedReach = Math.round(reachBase * mult * 0.08);
      return {
        label: lbl.short,
        reachVal: computedReach,
        reachFormatted: formatMetricNumber(computedReach)
      };
    });

    // SVG coordinates mapping (Width: 700, Height: 240, Top Margin: 35, Bottom Margin: 25)
    const svgWidth = 700;
    const svgHeight = 240;
    const topPad = 35;
    const bottomPad = 25;
    const plotHeight = svgHeight - topPad - bottomPad;

    const maxPrimary = Math.max(...primarySeries.map((d) => d.primaryVal), 5);
    const minPrimary = 0;
    const maxSecondary = Math.max(...secondarySeries.map((d) => d.reachVal), 100);
    const minSecondary = 0;

    const primaryPoints = primarySeries.map((pt, i) => {
      const x = (i / (pointsCount - 1)) * svgWidth;
      const y = (svgHeight - bottomPad) - ((pt.primaryVal - minPrimary) / (maxPrimary - minPrimary || 1)) * plotHeight;
      return { x, y, val: pt.primaryVal, label: pt.label, date: pt.fullDate };
    });

    const secondaryPoints = secondarySeries.map((pt, i) => {
      const x = (i / (pointsCount - 1)) * svgWidth;
      const y = (svgHeight - bottomPad) - ((pt.reachVal - minSecondary) / (maxSecondary - minSecondary || 1)) * plotHeight;
      return { x, y, val: pt.reachVal, formatted: pt.reachFormatted, label: pt.label };
    });

    const primaryPath = generateSmoothSpline(primaryPoints);
    const primaryArea = `${primaryPath} L ${svgWidth} ${svgHeight - bottomPad} L 0 ${svgHeight - bottomPad} Z`;

    const secondaryPath = generateSmoothSpline(secondaryPoints);
    const secondaryArea = `${secondaryPath} L ${svgWidth} ${svgHeight - bottomPad} L 0 ${svgHeight - bottomPad} Z`;

    const nodes = primaryPoints.map((p, i) => ({
      cx: p.x,
      cy: p.y,
      cy2: secondaryPoints[i]?.y || p.y,
      val: `${p.val} Leads`,
      reachVal: secondaryPoints[i]?.formatted || "12K",
      label: p.label,
      date: p.date
    }));

    return {
      labels,
      primaryPoints,
      secondaryPoints,
      primaryPath,
      primaryArea,
      secondaryPath,
      secondaryArea,
      nodes,
      totalLeadsCalculated: totalLeads > 0 ? totalLeads : 42,
      totalReachCalculated: caseStudyReachMetrics.formattedViews,
      avgConversion: `${inquiryPipelineStats.conversionRate || 68}%`,
      avgRetention: "82.4%"
    };
  }, [chartRange, enquiriesList.length, projectsList.length, caseStudiesList.length, blogsList.length, caseStudyReachMetrics, inquiryPipelineStats]);

  // 5. Live Inbound Leads Weekly Velocity & Peak Detection
  const leadsVelocityData = useMemo(() => {
    const days = [
      { key: 1, name: "Mon" },
      { key: 2, name: "Tue" },
      { key: 3, name: "Wed" },
      { key: 4, name: "Thu" },
      { key: 5, name: "Fri" },
      { key: 6, name: "Sat" },
      { key: 0, name: "Sun" }
    ];

    // Count real leads grouped by weekday
    const dayCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
    enquiriesList.forEach((enq) => {
      if (enq.createdAt) {
        const d = new Date(enq.createdAt);
        if (!isNaN(d.getTime())) {
          dayCounts[d.getDay()] = (dayCounts[d.getDay()] || 0) + 1;
        }
      }
    });

    const totalFromEnquiries = Object.values(dayCounts).reduce((a, b) => a + b, 0);

    // If database has newly seeded data or empty createdAt, distribute total inquiries realistically
    const simulatedWeights = { 1: 0.12, 2: 0.18, 3: 0.22, 4: 0.15, 5: 0.25, 6: 0.04, 0: 0.04 };
    const effectiveTotal = Math.max(enquiriesList.length, 18);

    const bars = days.map((day) => {
      const realCount = dayCounts[day.key];
      const count = totalFromEnquiries > 0 && realCount > 0
        ? realCount
        : Math.round(effectiveTotal * simulatedWeights[day.key]);
      return {
        day: day.name,
        dayIndex: day.key,
        count
      };
    });

    const maxCount = Math.max(...bars.map((b) => b.count), 1);
    let peakBar = bars[0];
    bars.forEach((b) => {
      if (b.count > peakBar.count) peakBar = b;
    });

    const formattedBars = bars.map((b) => ({
      ...b,
      heightPct: `${Math.max(15, Math.round((b.count / maxCount) * 100))}%`,
      isPeak: b.day === peakBar.day
    }));

    return {
      bars: formattedBars,
      peakDay: peakBar.day,
      peakCount: peakBar.count,
      totalCount: enquiriesList.length,
      newLeads: inquiryPipelineStats.newCount
    };
  }, [enquiriesList, inquiryPipelineStats]);


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
      } else if (type === "jobApplication") {
        await jobApplicationsAPI.delete(id);
        showToast("Job application deleted");
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
  const addCsBeforeAfterPair = () => {
    setCsForm(prev => ({
      ...prev,
      beforeAfter: [
        ...(prev.beforeAfter || []),
        { beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }
      ]
    }));
  };

  const removeCsBeforeAfterPair = async (index) => {
    const pair = csForm.beforeAfter?.[index];
    if (pair) {
      if (pair.beforeImage && pair.beforeImage.includes("cloudinary.com")) {
        try { await uploadAPI.deleteImage(pair.beforeImage); } catch (e) { console.error(e); }
      }
      if (pair.afterImage && pair.afterImage.includes("cloudinary.com")) {
        try { await uploadAPI.deleteImage(pair.afterImage); } catch (e) { console.error(e); }
      }
    }
    setCsForm(prev => {
      const updated = (prev.beforeAfter || []).filter((_, i) => i !== index);
      return {
        ...prev,
        beforeAfter: updated.length > 0 ? updated : [{ beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }]
      };
    });
  };

  const updateCsBeforeAfterPair = (index, field, value) => {
    setCsForm(prev => {
      const updated = [...(prev.beforeAfter || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, beforeAfter: updated };
    });
  };

  const handleOpenCsModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      // Keep project screenshot gallery strictly separate from cover thumbnail
      const existingImages = Array.isArray(item.images)
        ? (item.images.length === 1 && (item.images[0] === item.thumbnail || item.images[0] === item.coverImage)
            ? []
            : item.images)
        : [];

      const stats = item.stats || (item.metrics ? item.metrics.map(m => ({ num: m.value, label: m.label })) : []);

      let baPairs = [];
      if (Array.isArray(item.beforeAfter) && item.beforeAfter.length > 0) {
        baPairs = item.beforeAfter.map((p) => ({
          beforeImage: p.beforeImage || "",
          afterImage: p.afterImage || "",
          beforeLabel: p.beforeLabel || "Before",
          afterLabel: p.afterLabel || "After",
          title: p.title || ""
        }));
      } else if (item.beforeImage || item.afterImage) {
        baPairs = [
          {
            beforeImage: item.beforeImage || "",
            afterImage: item.afterImage || "",
            beforeLabel: item.beforeLabel || "Before",
            afterLabel: item.afterLabel || "After",
            title: ""
          }
        ];
      } else {
        baPairs = [
          {
            beforeImage: "",
            afterImage: "",
            beforeLabel: "Before",
            afterLabel: "After",
            title: ""
          }
        ];
      }

      setCsForm({
        title: item.title || item.name || "",
        client: item.client || item.handle || "",
        handle: item.handle || item.client || "",
        thumbnail: item.thumbnail || item.coverImage || "",
        category: item.category || "Instagram Growth",
        images: existingImages,
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : (item.tags || "Editing, Distribution"),
        stat1Num: stats[0]?.num || item.metric || "",
        stat1Label: stats[0]?.label || item.metricLabel || "Views / 30d",
        stat2Num: stats[1]?.num || "",
        stat2Label: stats[1]?.label || "Interactions",
        stat3Num: stats[2]?.num || "",
        stat3Label: stats[2]?.label || "Accounts reached",
        beforeAfter: baPairs,
        beforeImage: baPairs[0]?.beforeImage || item.beforeImage || "",
        afterImage: baPairs[0]?.afterImage || item.afterImage || "",
        beforeLabel: baPairs[0]?.beforeLabel || item.beforeLabel || "Before",
        afterLabel: baPairs[0]?.afterLabel || item.afterLabel || "After",
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
        thumbnail: "",
        category: "Instagram Growth",
        images: [],
        tags: "Editing, Distribution",
        stat1Num: "",
        stat1Label: "Views / 30d",
        stat2Num: "",
        stat2Label: "Interactions",
        stat3Num: "",
        stat3Label: "Accounts reached",
        beforeAfter: [
          {
            beforeImage: "",
            afterImage: "",
            beforeLabel: "Before",
            afterLabel: "After",
            title: ""
          }
        ],
        beforeImage: "",
        afterImage: "",
        beforeLabel: "Before",
        afterLabel: "After",
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

    const calculatedInitials = csForm.title.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

    const cleanBeforeAfter = (csForm.beforeAfter || []).filter(
      (p) => p.beforeImage || p.afterImage || (p.title && p.title.trim())
    );
    const firstPair = cleanBeforeAfter[0] || (csForm.beforeAfter && csForm.beforeAfter[0]) || {};

    const payload = {
      ...csForm,
      name: csForm.title,
      initials: calculatedInitials,
      handle: csForm.handle || csForm.client,
      slug: csForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      tags: typeof csForm.tags === "string" ? csForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : (csForm.tags || []),
      stats: statsArray,
      metrics: statsArray.map(s => ({ value: s.num, label: s.label })),
      metric: csForm.stat1Num || "10M+",
      metricLabel: csForm.stat1Label || "Views",
      thumbnail: csForm.thumbnail || csForm.images[0] || "",
      coverImage: csForm.thumbnail || csForm.images[0] || "",
      beforeAfter: cleanBeforeAfter,
      beforeImage: firstPair.beforeImage || csForm.beforeImage || "",
      afterImage: firstPair.afterImage || csForm.afterImage || "",
      beforeLabel: firstPair.beforeLabel || csForm.beforeLabel || "Before",
      afterLabel: firstPair.afterLabel || csForm.afterLabel || "After",
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
      const determinedType = item.type || (vidId || item.videoUrl ? "video" : "text");
      setTestimonialForm({
        name: item.name || item.clientName || "",
        role: item.role || item.clientRole || "",
        company: item.company || item.clientCompany || "",
        quote: item.quote || item.testimonial || "",
        avatar: item.avatar || item.clientImage || "",
        type: determinedType,
        videoUrl: item.videoUrl || (vidId ? `https://www.youtube.com/watch?v=${vidId}` : ""),
        videoId: vidId,
        videoFirst: item.videoFirst !== undefined ? item.videoFirst : true,
        metric: item.metric || "",
        rating: item.rating !== undefined ? item.rating : 5,
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
        type: "video",
        videoUrl: "",
        videoId: "",
        videoFirst: true,
        metric: "",
        rating: 5,
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

    let extractedVideoId = testimonialForm.type === "video" ? testimonialForm.videoId : "";
    if (testimonialForm.type === "video" && testimonialForm.videoUrl && !extractedVideoId) {
      const match = testimonialForm.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match) extractedVideoId = match[1];
    }

    const payload = {
      ...testimonialForm,
      type: testimonialForm.type,
      videoUrl: testimonialForm.type === "video" ? testimonialForm.videoUrl : "",
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
        showToast("New testimonial added successfully ✓");
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

  const handleSetApplicationStatus = async (id, status) => {
    try {
      await jobApplicationsAPI.updateStatus(id, status);
      showToast(`Application status updated to ${status}`);
      if (selectedApplication && (selectedApplication._id === id || selectedApplication.id === id)) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      await loadAllData();
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  };

  const handleViewApplication = (app) => {
    setSelectedApplication(app);
    setModalType("viewApplication");
    if (app.status === "New") {
      handleSetApplicationStatus(app.id || app._id, "Reviewed");
    }
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

  const filteredTestimonials = testimonialsList.filter((t) => {
    const matchesSearch =
      (t.name || t.clientName)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.role || t.clientRole)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.company || t.clientCompany)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.quote || t.testimonial)?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    const isVideo = Boolean(t.videoId || t.videoUrl || t.type === "video");
    if (testimonialTypeFilter === "video") return isVideo;
    if (testimonialTypeFilter === "text") return !isVideo || t.type === "text";
    return true;
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

  const filteredApplications = jobApplicationsList.filter((app) => {
    const matchesSearch =
      (app.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.portfolioUrl || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && (app.status?.toLowerCase() === statusFilter.toLowerCase());
  });

  // Reset pagination on filter, search or tab change
  useEffect(() => {
    setCurrentPage({
      caseStudies: 1,
      homeVideos: 1,
      testimonials: 1,
      blog: 1,
      jobs: 1,
      jobApplications: 1,
      enquiries: 1
    });
  }, [searchQuery, statusFilter, videoCategoryFilter, testimonialTypeFilter, activeTab]);

  // Paginated Slices & Total Pages for all tabs
  const csTotalPages = Math.max(1, Math.ceil(filteredCaseStudies.length / itemsPerPage.caseStudies));
  const csCurrentPage = Math.min(currentPage.caseStudies, csTotalPages);
  const paginatedCaseStudies = filteredCaseStudies.slice(
    (csCurrentPage - 1) * itemsPerPage.caseStudies,
    csCurrentPage * itemsPerPage.caseStudies
  );

  const projsTotalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage.homeVideos));
  const projsCurrentPage = Math.min(currentPage.homeVideos, projsTotalPages);
  const paginatedProjects = filteredProjects.slice(
    (projsCurrentPage - 1) * itemsPerPage.homeVideos,
    projsCurrentPage * itemsPerPage.homeVideos
  );

  const testsTotalPages = Math.max(1, Math.ceil(filteredTestimonials.length / itemsPerPage.testimonials));
  const testsCurrentPage = Math.min(currentPage.testimonials, testsTotalPages);
  const paginatedTestimonials = filteredTestimonials.slice(
    (testsCurrentPage - 1) * itemsPerPage.testimonials,
    testsCurrentPage * itemsPerPage.testimonials
  );

  const blogsTotalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage.blog));
  const blogsCurrentPage = Math.min(currentPage.blog, blogsTotalPages);
  const paginatedBlogs = filteredBlogs.slice(
    (blogsCurrentPage - 1) * itemsPerPage.blog,
    blogsCurrentPage * itemsPerPage.blog
  );

  const jobsTotalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage.jobs));
  const jobsCurrentPage = Math.min(currentPage.jobs, jobsTotalPages);
  const paginatedJobs = filteredJobs.slice(
    (jobsCurrentPage - 1) * itemsPerPage.jobs,
    jobsCurrentPage * itemsPerPage.jobs
  );

  const appsTotalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage.jobApplications));
  const appsCurrentPage = Math.min(currentPage.jobApplications || 1, appsTotalPages);
  const paginatedApplications = filteredApplications.slice(
    (appsCurrentPage - 1) * itemsPerPage.jobApplications,
    appsCurrentPage * itemsPerPage.jobApplications
  );

  const enqsTotalPages = Math.max(1, Math.ceil(filteredEnquiries.length / itemsPerPage.enquiries));
  const enqsCurrentPage = Math.min(currentPage.enquiries, enqsTotalPages);
  const paginatedEnquiries = filteredEnquiries.slice(
    (enqsCurrentPage - 1) * itemsPerPage.enquiries,
    enqsCurrentPage * itemsPerPage.enquiries
  );

  // Unified Sleek Pagination Bar Component
  const renderPagination = (tabKey, totalItems, perPage, curPage) => {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalItems === 0) return null;

    const startIdx = (curPage - 1) * perPage + 1;
    const endIdx = Math.min(totalItems, curPage * perPage);

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (curPage <= 3) {
          pages.push(1, 2, 3, 4, "...", totalPages);
        } else if (curPage >= totalPages - 2) {
          pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", curPage - 1, curPage, curPage + 1, "...", totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 mt-6 select-none">
        <div className="text-xs text-white/50 font-mono">
          Showing <strong className="text-white">{startIdx}</strong> to <strong className="text-white">{endIdx}</strong> of <strong className="text-[#B3FFC9]">{totalItems}</strong> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => ({ ...prev, [tabKey]: Math.max(1, curPage - 1) }))}
            disabled={curPage === 1}
            className="p-2 rounded-xl bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-[#B3FFC9]/40 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft size={14} />
          </button>

          {getPageNumbers().map((p, idx) => (
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-xs font-mono text-white/30">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage((prev) => ({ ...prev, [tabKey]: p }))}
                className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${curPage === p
                  ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.3)] border border-[#B3FFC9]"
                  : "bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                  }`}
              >
                {p}
              </button>
            )
          ))}

          <button
            onClick={() => setCurrentPage((prev) => ({ ...prev, [tabKey]: Math.min(totalPages, curPage + 1) }))}
            disabled={curPage === totalPages || totalPages === 0}
            className="p-2 rounded-xl bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:border-[#B3FFC9]/40 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
            title="Next Page"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Per Page Selector */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
          <span>Rows per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setItemsPerPage((prev) => ({ ...prev, [tabKey]: newSize }));
              setCurrentPage((prev) => ({ ...prev, [tabKey]: 1 }));
            }}
            className="px-2.5 py-1 rounded-lg bg-[#141414] border border-white/10 text-xs text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
          >
            {[4, 6, 8, 12, 24, 48].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Nav Items
  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "caseStudies", label: "Case Studies", icon: FileText, count: caseStudiesList.length },
    { id: "homeVideos", label: "Home Videos", icon: Video, count: projectsList.length },
    { id: "testimonials", label: "Testimonials", icon: Quote, count: testimonialsList.length },
    { id: "blog", label: "Blog Insights", icon: FileText, count: blogsList.length },
    { id: "jobs", label: "Careers", icon: Briefcase, count: jobsList.length },
    { id: "jobApplications", label: "Job Applications", icon: UserCheck, count: jobApplicationsList.length, highlight: jobApplicationsList.some(a => a.status === "New") },
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
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0c0c0c] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isActive
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
                  {activeTab === "caseStudies" ? "Case Studies Analysis" : (activeTab === "homeVideos" ? "Home Video Showcases" : (activeTab === "testimonials" ? "Client Testimonials" : (activeTab === "jobApplications" ? "Candidate Job Applications" : (activeTab === "enquiries" ? "Client Inquiries Inbox" : activeTab))))}
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
                {/* 7 Hero Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
                      <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-1">
                        <Eye size={10} /> {blogsList.reduce((acc, b) => acc + (Number(b.views) || 0), 0).toLocaleString()} reads
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
                    onClick={() => setActiveTab("jobApplications")}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 transition-all cursor-pointer space-y-3 group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.05)]"
                  >
                    <div className="flex items-center justify-between text-white/50">
                      <span className="text-[11px] uppercase font-bold tracking-wider" style={{ fontFamily: "'Syne', sans-serif" }}>Applications</span>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#B3FFC9] group-hover:scale-110 transition-transform">
                        <UserCheck size={14} />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-3xl font-extrabold text-[#B3FFC9]" style={{ fontFamily: "'Syne', sans-serif" }}>
                        {jobApplicationsList.length}
                      </p>
                      {jobApplicationsList.some(a => a.status === "New") && (
                        <span className="text-[10px] font-mono text-[#B3FFC9] flex items-center gap-0.5">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      <span>Candidate Profiles</span>
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

                  {/* Left Chart: Audience, Leads & Video Views Engagement Area Curve (8 Cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9] animate-pulse" />
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Traffic, Inquiries &amp; Video Engagement
                          </h3>
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-1">
                          Live database analytics: lead influx velocity and audience impact pacing
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Metric Mode Filter */}
                        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                          <button
                            onClick={() => setChartMetric("all")}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${chartMetric === "all" ? "bg-white/15 text-[#B3FFC9] font-bold" : "text-white/40 hover:text-white"
                              }`}
                          >
                            All Growth
                          </button>
                          <button
                            onClick={() => setChartMetric("leads")}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${chartMetric === "leads" ? "bg-white/15 text-[#B3FFC9] font-bold" : "text-white/40 hover:text-white"
                              }`}
                          >
                            Leads Only
                          </button>
                          <button
                            onClick={() => setChartMetric("reach")}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${chartMetric === "reach" ? "bg-white/15 text-[#22D3EE] font-bold" : "text-white/40 hover:text-white"
                              }`}
                          >
                            Reach Only
                          </button>
                        </div>

                        {/* Time Range Filter Pills */}
                        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-full border border-white/10">
                          {["7D", "30D", "90D", "1Y"].map((range) => (
                            <button
                              key={range}
                              onClick={() => setChartRange(range)}
                              className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${chartRange === range
                                ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.3)]"
                                : "text-white/50 hover:text-white"
                                }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Interactive SVG Area Chart */}
                    <div className="relative w-full h-64 sm:h-72 select-none">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="mintAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B3FFC9" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#B3FFC9" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background Grid Lines */}
                        <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="95" x2="700" y2="95" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="150" x2="700" y2="150" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="215" x2="700" y2="215" stroke="rgba(255,255,255,0.08)" />

                        {/* Secondary Series: Cyan Area & Line (Audience Reach & Impact) */}
                        {(chartMetric === "all" || chartMetric === "reach") && (
                          <g>
                            <path
                              d={timeSeriesAnalytics.secondaryArea}
                              fill="url(#cyanAreaGrad)"
                              className="transition-all duration-700 ease-out"
                            />
                            <path
                              d={timeSeriesAnalytics.secondaryPath}
                              fill="none"
                              stroke="#22D3EE"
                              strokeWidth="2.2"
                              strokeDasharray="4 4"
                              opacity="0.85"
                              className="transition-all duration-700 ease-out"
                            />
                          </g>
                        )}

                        {/* Primary Series: Mint Area & Line (Direct Inbound Leads & Interactions) */}
                        {(chartMetric === "all" || chartMetric === "leads") && (
                          <g>
                            <path
                              d={timeSeriesAnalytics.primaryArea}
                              fill="url(#mintAreaGrad)"
                              className="transition-all duration-700 ease-out"
                            />
                            <path
                              d={timeSeriesAnalytics.primaryPath}
                              fill="none"
                              stroke="#B3FFC9"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              className="transition-all duration-700 ease-out"
                            />
                          </g>
                        )}

                        {/* Dynamic Interactive Data Nodes */}
                        {timeSeriesAnalytics.nodes.map((pt, i) => (
                          <g key={i} className="cursor-pointer group/dot">
                            {/* Hitbox */}
                            <circle
                              cx={pt.cx}
                              cy={chartMetric === "reach" ? pt.cy2 : pt.cy}
                              r={16}
                              fill="transparent"
                              onMouseEnter={() => setHoveredPoint(i)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />

                            {/* Center Node Dot */}
                            <circle
                              cx={pt.cx}
                              cy={chartMetric === "reach" ? pt.cy2 : pt.cy}
                              r={hoveredPoint === i ? 7.5 : 5}
                              className={`transition-all duration-200 ${chartMetric === "reach"
                                ? "fill-[#0c0c0c] stroke-[#22D3EE]"
                                : "fill-[#0c0c0c] stroke-[#B3FFC9]"
                                }`}
                              strokeWidth={hoveredPoint === i ? 4 : 2.5}
                              onMouseEnter={() => setHoveredPoint(i)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />

                            {/* Floating Tooltip Card on Hover */}
                            {hoveredPoint === i && (
                              <g className="transition-opacity duration-200 pointer-events-none">
                                <rect
                                  x={Math.max(10, Math.min(pt.cx - 55, 580))}
                                  y={Math.max(10, (chartMetric === "reach" ? pt.cy2 : pt.cy) - 52)}
                                  width="110"
                                  height="44"
                                  rx="8"
                                  fill="#161616"
                                  stroke={chartMetric === "reach" ? "#22D3EE" : "#B3FFC9"}
                                  strokeWidth="1.2"
                                  className="shadow-2xl"
                                />
                                <text
                                  x={Math.max(65, Math.min(pt.cx, 635))}
                                  y={Math.max(26, (chartMetric === "reach" ? pt.cy2 : pt.cy) - 34)}
                                  fill="#ffffff"
                                  fontSize="10"
                                  fontWeight="600"
                                  textAnchor="middle"
                                  fontFamily="monospace"
                                  opacity="0.75"
                                >
                                  {pt.date || pt.label}
                                </text>
                                <text
                                  x={Math.max(65, Math.min(pt.cx, 635))}
                                  y={Math.max(42, (chartMetric === "reach" ? pt.cy2 : pt.cy) - 18)}
                                  fill={chartMetric === "reach" ? "#22D3EE" : "#B3FFC9"}
                                  fontSize="12"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                  fontFamily="monospace"
                                >
                                  {chartMetric === "reach" ? `${pt.reachVal} Reach` : pt.val}
                                </text>
                              </g>
                            )}
                          </g>
                        ))}
                      </svg>

                      {/* X-Axis Labels */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
                        {timeSeriesAnalytics.labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className={idx === timeSeriesAnalytics.labels.length - 1 ? "text-[#B3FFC9] font-bold" : ""}
                          >
                            {lbl.short}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Chart Dynamic KPI Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#B3FFC9]" />
                          <span>Total Inbound Leads</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">
                          {inquiryPipelineStats.total}
                          <span className="text-xs font-normal text-[#B3FFC9] ml-1.5">
                            ({inquiryPipelineStats.newCount} New)
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                          <span>Documented Reach</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">
                          {caseStudyReachMetrics.formattedViews}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                          <span>Studio Assets</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">
                          {portfolioAnalytics.total}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span>Lead Conversion</span>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">
                          {inquiryPipelineStats.conversionRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Chart: Content Portfolio Dynamic SVG Donut (4 Cols) */}
                  <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PieChart size={16} className="text-[#B3FFC9]" />
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Content Portfolio
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#B3FFC9] bg-[#B3FFC9]/10 px-2 py-0.5 rounded-md border border-[#B3FFC9]/20">
                          {portfolioAnalytics.total} Live Assets
                        </span>
                      </div>
                      <p className="text-xs text-white/40 font-mono mt-1">
                        Real-time database media asset breakdown
                      </p>
                    </div>

                    {/* Dynamic SVG Donut Ring */}
                    <div className="flex items-center justify-center relative py-2">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                          {/* Background Track */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#161616"
                            strokeWidth="12"
                          />

                          {/* Dynamic Color Segments */}
                          {portfolioAnalytics.categories.map((cat) => {
                            if (cat.count === 0 && portfolioAnalytics.total > 0) return null;
                            const isHovered = hoveredDonutCat === cat.key;
                            return (
                              <circle
                                key={cat.key}
                                cx="60"
                                cy="60"
                                r="46"
                                fill="none"
                                stroke={cat.color}
                                strokeWidth={isHovered ? "15" : "12"}
                                strokeDasharray={cat.dasharray}
                                strokeDashoffset={cat.dashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredDonutCat(cat.key)}
                                onMouseLeave={() => setHoveredDonutCat(null)}
                              />
                            );
                          })}
                        </svg>

                        {/* Center Metric Callout */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                          {portfolioAnalytics.activeHoverItem ? (
                            <>
                              <span className="text-xl font-black" style={{ color: portfolioAnalytics.activeHoverItem.color, fontFamily: "'Syne', sans-serif" }}>
                                {portfolioAnalytics.activeHoverItem.count}
                              </span>
                              <span className="text-[9px] uppercase font-mono text-white/70">
                                {portfolioAnalytics.activeHoverItem.pct}% {portfolioAnalytics.activeHoverItem.label.split(" ")[0]}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {portfolioAnalytics.total}
                              </span>
                              <span className="text-[9px] uppercase font-mono text-white/40">Total Assets</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Distribution Dynamic Progress Bars */}
                    <div className="space-y-2.5">
                      {portfolioAnalytics.categories.map((cat) => (
                        <div
                          key={cat.key}
                          onClick={() => setActiveTab(cat.tab)}
                          onMouseEnter={() => setHoveredDonutCat(cat.key)}
                          onMouseLeave={() => setHoveredDonutCat(null)}
                          className="group/item cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-mono mb-1">
                            <span className="text-white/70 group-hover/item:text-white flex items-center gap-1.5 transition-colors">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.label}
                            </span>
                            <span className="font-bold font-mono" style={{ color: cat.color }}>
                              {cat.count} ({cat.pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#161616] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${cat.exactPct || 0}%`,
                                backgroundColor: cat.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ==================== ANALYTICS GRAPHS ROW 2 ==================== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Left: Dynamic Inbound Leads Velocity Bar Chart (6 Cols) */}
                  <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#0c0c0c] border border-white/10 space-y-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-[#B3FFC9]" />
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Inbound Leads Velocity
                          </h3>
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-1">
                          Weekly client inquiries &amp; project bookings distribution
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] text-xs font-mono font-bold border border-[#B3FFC9]/20">
                        {leadsVelocityData.totalCount} Leads Recorded
                      </span>
                    </div>

                    {/* Dynamic Bar Chart Bars */}
                    <div className="pt-4 flex items-end justify-between gap-2.5 h-48 border-b border-white/10 pb-2 relative">
                      {leadsVelocityData.bars.map((bar, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                        >
                          {/* Top Count Badge */}
                          <span className={`text-[10px] font-mono transition-opacity duration-200 ${hoveredBarIndex === idx || bar.isPeak ? "opacity-100 text-[#B3FFC9] font-bold" : "opacity-0 text-white/50"
                            }`}>
                            {bar.count}
                          </span>

                          {/* Bar Pillar */}
                          <div className="w-full max-w-[38px] bg-[#161616] rounded-t-xl overflow-hidden h-full flex items-end">
                            <div
                              className={`w-full rounded-t-xl transition-all duration-500 group-hover:scale-y-105 ${bar.isPeak
                                ? "bg-gradient-to-t from-[#0e3b26] to-[#B3FFC9] shadow-[0_0_20px_rgba(179,255,201,0.4)]"
                                : "bg-gradient-to-t from-white/10 to-white/30 group-hover:to-[#B3FFC9]"
                                }`}
                              style={{ height: bar.heightPct }}
                            />
                          </div>

                          {/* Weekday Label */}
                          <span className={`text-[10px] font-mono uppercase ${bar.isPeak ? "text-[#B3FFC9] font-bold" : "text-white/40 group-hover:text-white"
                            }`}>
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Analytics & Pipeline Status Chips */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono text-white/60">
                        <span>Peak Inflow: <strong className="text-white">{leadsVelocityData.peakDay} ({leadsVelocityData.peakCount} inquiries)</strong></span>
                        <span className="text-[#B3FFC9] flex items-center gap-1 font-bold">Avg SLA: &lt; 2h</span>
                      </div>

                      {/* Lead Status Pipeline Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                        <span className="text-white/40">Status:</span>
                        <span
                          onClick={() => setActiveTab("enquiries")}
                          className="px-2.5 py-0.5 rounded-md bg-[#B3FFC9]/10 text-[#B3FFC9] border border-[#B3FFC9]/20 cursor-pointer hover:bg-[#B3FFC9]/20 transition-colors"
                        >
                          {inquiryPipelineStats.newCount} New
                        </span>
                        <span
                          onClick={() => setActiveTab("enquiries")}
                          className="px-2.5 py-0.5 rounded-md bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 cursor-pointer hover:bg-[#22D3EE]/20 transition-colors"
                        >
                          {inquiryPipelineStats.reviewedCount} In Review
                        </span>
                        <span
                          onClick={() => setActiveTab("enquiries")}
                          className="px-2.5 py-0.5 rounded-md bg-pink-400/10 text-pink-400 border border-pink-400/20 cursor-pointer hover:bg-pink-400/20 transition-colors"
                        >
                          {inquiryPipelineStats.contactedCount} Contacted
                        </span>
                        <span
                          onClick={() => setActiveTab("enquiries")}
                          className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          {inquiryPipelineStats.archivedCount} Archived
                        </span>
                      </div>
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
                  <div className="text-xs text-white/50 font-mono">
                    Showing page <strong className="text-white">{csCurrentPage}</strong> of <strong className="text-white">{csTotalPages}</strong> ({filteredCaseStudies.length} case studies total)
                  </div>
                </div>

                {filteredCaseStudies.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <FileText size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Case Studies Found</p>
                    <p className="text-xs text-white/40">Try adjusting your search query or add a new case study.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedCaseStudies.map((cs) => {
                        const thumbImg = cs.thumbnail || cs.coverImage || (Array.isArray(cs.images) && cs.images[0]);
                        const imagesCount = Array.isArray(cs.images) ? cs.images.length : (cs.coverImage ? 1 : 0);
                        const stats = cs.stats || [];

                        return (
                          <div
                            key={cs.id || cs._id}
                            className="p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-[#B3FFC9]/40 flex flex-col justify-between space-y-4 group transition-all"
                          >
                            <div className="space-y-3">
                              {/* Card Preview Banner with Cover Thumbnail */}
                              <div className="h-36 rounded-xl overflow-hidden bg-[#141414] relative border border-white/5 group-hover:border-[#B3FFC9]/30 transition-all">
                                {thumbImg ? (
                                  <img
                                    src={thumbImg}
                                    alt={cs.title || cs.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1b1b1b] to-[#0d0d0d] text-white/30 text-xs font-mono">
                                    No Thumbnail
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                                <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-20px)] truncate px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[10px] font-semibold border border-[#B3FFC9]/20">
                                  {cs.category || "Case Study"}
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
                    {renderPagination("caseStudies", filteredCaseStudies.length, itemsPerPage.caseStudies, csCurrentPage)}
                  </>
                )}
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
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${videoCategoryFilter === tab.key
                          ? "bg-[#B3FFC9] text-black"
                          : "bg-white/5 text-white/60 hover:text-white"
                          }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-white/50 font-mono">
                    Showing page <strong className="text-white">{projsCurrentPage}</strong> of <strong className="text-white">{projsTotalPages}</strong> ({filteredProjects.length} videos)
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <Video size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Videos Found</p>
                    <p className="text-xs text-white/40">Try adjusting your filters or upload a new home video showcase.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {paginatedProjects.map((p) => {
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
                    {renderPagination("homeVideos", filteredProjects.length, itemsPerPage.homeVideos, projsCurrentPage)}
                  </>
                )}
              </div>
            )}

            {/* ==================== TAB: TESTIMONIALS ==================== */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: "all", label: `All (${testimonialsList.length})` },
                      { key: "video", label: `Video (${testimonialsList.filter(t => t.videoId || t.videoUrl || t.type === 'video').length})` },
                      { key: "text", label: `Text Only (${testimonialsList.filter(t => (!t.videoId && !t.videoUrl) || t.type === 'text').length})` },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setTestimonialTypeFilter(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${testimonialTypeFilter === tab.key
                          ? "bg-[#B3FFC9] text-black"
                          : "bg-white/5 text-white/60 hover:text-white"
                          }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-white/50 font-mono">
                    Showing page <strong className="text-white">{testsCurrentPage}</strong> of <strong className="text-white">{testsTotalPages}</strong> ({filteredTestimonials.length} testimonials)
                  </div>
                </div>

                {filteredTestimonials.length === 0 ? (
                  <div className="text-center py-20 rounded-2xl border border-dashed border-white/10 bg-[#0d0d0d] space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-[#B3FFC9]">
                      <Quote size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Testimonials Found</h3>
                      <p className="text-xs text-white/40 mt-1">Post a video testimonial or text testimonial from clients and creators.</p>
                    </div>
                    <button
                      onClick={() => handleOpenTestimonialModal()}
                      className="px-4 py-2 rounded-full bg-[#B3FFC9] text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} /> Add Testimonial
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedTestimonials.map((t, tIdx) => {
                        const tId = t._id || t.id || tIdx;
                        const author = t.name || t.clientName || "Client";
                        const role = t.role || t.clientRole || "";
                        const company = t.company || t.clientCompany || "";
                        const quote = t.quote || t.testimonial || "";
                        const avatar = t.avatar || t.clientImage;
                        const vidId = t.videoId || (t.videoUrl ? t.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)?.[1] : "");
                        const isVideo = Boolean(vidId || (t.type === "video" && t.videoUrl));

                        return (
                          <div
                            key={tId}
                            className="rounded-2xl bg-[#0d0d0d] border border-white/10 hover:border-[#B3FFC9]/30 p-5 space-y-4 flex flex-col justify-between transition-all group hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(179,255,201,0.03)]"
                          >
                            <div className="space-y-3">
                              {/* Format Badge */}
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${isVideo
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : "bg-[#B3FFC9]/10 text-[#B3FFC9] border border-[#B3FFC9]/20"
                                  }`}>
                                  {isVideo ? <Video size={11} /> : <Quote size={11} />}
                                  <span>{isVideo ? "Video Testimonial" : "Text Testimonial"}</span>
                                </span>

                                {t.metric && (
                                  <span className="text-[10px] font-mono text-[#B3FFC9] bg-white/5 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                                    {t.metric}
                                  </span>
                                )}
                              </div>

                              {/* Video Preview / Embed Thumbnail or Text Review Box */}
                              {isVideo && vidId ? (
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
                                <div className="rounded-xl p-4 border border-white/5 bg-white/[0.02] flex items-center justify-between">
                                  <div className="flex text-[#B3FFC9]">
                                    {[...Array(t.rating || 5)].map((_, i) => (
                                      <Star key={i} size={14} className="fill-[#B3FFC9]" />
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-mono text-white/50">Verified Review</span>
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
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${t.isActive !== false ? "bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30" : "bg-white/5 text-white/40"
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
                    {renderPagination("testimonials", filteredTestimonials.length, itemsPerPage.testimonials, testsCurrentPage)}
                  </>
                )}
              </div>
            )}

            {/* ==================== TAB: BLOG ==================== */}
            {activeTab === "blog" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-white/50 font-mono">
                    Showing page <strong className="text-white">{blogsCurrentPage}</strong> of <strong className="text-white">{blogsTotalPages}</strong> ({filteredBlogs.length} articles total)
                  </div>
                </div>

                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <FileText size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Articles Found</p>
                    <p className="text-xs text-white/40">Try adjusting your search or write a new insights post.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedBlogs.map((post) => (
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
                              <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#B3FFC9] text-[10px] font-mono flex items-center gap-1">
                                <Eye size={10} /> {(Number(post.views) || 0).toLocaleString()} views
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
                    {renderPagination("blog", filteredBlogs.length, itemsPerPage.blog, blogsCurrentPage)}
                  </>
                )}
              </div>
            )}

            {/* ==================== TAB: JOBS ==================== */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-white/50 font-mono">
                    Showing page <strong className="text-white">{jobsCurrentPage}</strong> of <strong className="text-white">{jobsTotalPages}</strong> ({filteredJobs.length} career postings total)
                  </div>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <Briefcase size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Job Openings Found</p>
                    <p className="text-xs text-white/40">Try adjusting your search or post a new career opening.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedJobs.map((job) => (
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
                    {renderPagination("jobs", filteredJobs.length, itemsPerPage.jobs, jobsCurrentPage)}
                  </>
                )}
              </div>
            )}

            {/* ==================== TAB: JOB APPLICATIONS ==================== */}
            {activeTab === "jobApplications" && (
              <div className="space-y-6">
                {/* Header Controls & Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e0e] border border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    {["all", "new", "reviewed", "shortlisted", "rejected"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === st ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.25)]" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                          }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span>Showing page <strong className="text-white">{appsCurrentPage}</strong> of <strong className="text-white">{appsTotalPages}</strong> ({filteredApplications.length} candidates)</span>
                  </div>
                </div>

                {/* Empty State */}
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-20 bg-[#0d0d0d] border border-white/10 rounded-3xl space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
                      <UserCheck size={26} />
                    </div>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>No Job Applications Found</p>
                    <p className="text-xs text-white/40">When candidates apply from the /careers page, their applications will appear here in real time.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {paginatedApplications.map((app) => {
                        const appId = app.id || app._id;
                        const initial = app.name?.charAt(0)?.toUpperCase() || "A";
                        return (
                          <div
                            key={appId}
                            className="p-6 rounded-3xl bg-[#0d0d0d] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-lg group"
                          >
                            {/* Top Row: Candidate Overview & Quick Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                              <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_15px_rgba(179,255,201,0.15)]" style={{ fontFamily: "'Syne', sans-serif" }}>
                                  {initial}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-bold text-white text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                                      {app.name}
                                    </h4>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30 text-[10px] font-bold">
                                      {app.jobTitle}
                                    </span>
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${app.status === "New" ? "bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30" :
                                      (app.status === "Reviewed" ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" :
                                        (app.status === "Shortlisted" ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" : "bg-red-500/20 text-red-400 border border-red-500/30"))
                                      }`}>
                                      {app.status || "New"}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-mono text-white/40 mt-0.5">
                                    Applied on: {app.fullDate || app.date} · Exp: <strong className="text-white/70">{app.experience || "Not specified"}</strong>
                                  </p>
                                </div>
                              </div>

                              {/* Status Selector & Quick Action Buttons */}
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={app.status || "New"}
                                  onChange={(e) => handleSetApplicationStatus(appId, e.target.value)}
                                  className="px-3 py-1.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
                                >
                                  <option value="New">Status: New</option>
                                  <option value="Reviewed">Status: Reviewed</option>
                                  <option value="Shortlisted">Status: Shortlisted</option>
                                  <option value="Rejected">Status: Rejected</option>
                                </select>

                                <button
                                  onClick={() => handleViewApplication(app)}
                                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Eye size={13} className="text-[#B3FFC9]" />
                                  <span>Details</span>
                                </button>

                                <a
                                  href={`mailto:${app.email}?subject=Regarding%20your%20application%20for%20${encodeURIComponent(app.jobTitle)}%20at%20Littroi`}
                                  className="px-3 py-1.5 rounded-xl bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                                  style={{ fontFamily: "'Syne', sans-serif" }}
                                >
                                  <Send size={12} />
                                  <span>Reply</span>
                                </a>

                                <button
                                  onClick={() => setDeleteConfirm({ type: "jobApplication", id: appId, title: `Application from ${app.name}` })}
                                  className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Delete Application"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Contact & Links Row */}
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              <span className="text-white/60 font-mono">✉️ {app.email}</span>
                              {app.phone && <span className="text-white/60 font-mono">📞 {app.phone}</span>}

                              {app.portfolioUrl && (
                                <a
                                  href={app.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-[#B3FFC9]/10 text-[#B3FFC9] border border-[#B3FFC9]/30 transition-colors"
                                >
                                  <span>Showreel / Portfolio</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}

                              {app.resumeUrl && (
                                <a
                                  href={app.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/15 transition-colors"
                                >
                                  <span>Resume / CV</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>

                            {/* Cover Letter Snippet */}
                            {app.coverLetter && (
                              <p className="text-xs text-white/60 line-clamp-2 italic pt-2 border-t border-white/5">
                                "{app.coverLetter}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {renderPagination("jobApplications", filteredApplications.length, itemsPerPage.jobApplications, appsCurrentPage)}
                  </>
                )}
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
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === st ? "bg-[#B3FFC9] text-black shadow-[0_0_15px_rgba(179,255,201,0.25)]" : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                          }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span>Showing page <strong className="text-white">{enqsCurrentPage}</strong> of <strong className="text-white">{enqsTotalPages}</strong> ({filteredEnquiries.length} leads)</span>
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
                  <>
                    <div className="space-y-4">
                      {paginatedEnquiries.map((enq) => {
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
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${enq.status === "New" ? "bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30" :
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
                    {renderPagination("enquiries", filteredEnquiries.length, itemsPerPage.enquiries, enqsCurrentPage)}
                  </>
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/60">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={csForm.tags}
                    onChange={(e) => setCsForm({ ...csForm, tags: e.target.value })}
                    placeholder="Editing, Distribution, Short Form"
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-white text-sm focus:border-[#B3FFC9] focus:outline-none"
                  />
                </div>

                {/* Cover Thumbnail Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60">
                    Listing Cover Thumbnail (Shows on Case Studies cards)
                  </label>
                  {csForm.thumbnail ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video max-w-sm border border-white/15 bg-[#161616]">
                      <img src={csForm.thumbnail} alt="Case Study Thumbnail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          const thumbToDelete = csForm.thumbnail;
                          setCsForm({ ...csForm, thumbnail: "" });
                          if (thumbToDelete && thumbToDelete.includes("cloudinary.com")) {
                            await uploadAPI.deleteImage(thumbToDelete);
                            showToast("Thumbnail deleted from Cloudinary");
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                        title="Delete Thumbnail"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#161616] border border-white/10 text-xs text-white/60 hover:text-white cursor-pointer transition-colors hover:border-[#B3FFC9]/40">
                      <ImageIcon size={16} className="text-[#B3FFC9]" />
                      <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Upload Cover Thumbnail"}</span>
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
                              setCsForm((prev) => ({ ...prev, thumbnail: url }));
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

                {/* Multiple Images Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white/60">
                      Project Images & Proofs (Upload to Cloudinary)
                    </label>
                    {isUploadingImage ? (
                      <span className="text-[11px] text-[#B3FFC9] font-mono animate-pulse">
                        Uploading to Cloudinary...
                      </span>
                    ) : (
                      csForm.images && csForm.images.length > 0 && (
                        <span className="text-[11px] text-[#B3FFC9] font-mono">
                          {csForm.images.length} {csForm.images.length === 1 ? "image" : "images"} uploaded
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
                        <span>{isUploadingImage ? "Uploading..." : "Add More Images"}</span>
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
                                showToast(`${files.length} images uploaded to Cloudinary`);
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
                        {isUploadingImage ? "Uploading to Cloudinary..." : "Click to Upload Images to Cloudinary"}
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
                              showToast(`${files.length} images uploaded to Cloudinary`);
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

                {/* Before & After Growth Proofs (Multiple Pairs Supported) */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Before &amp; After Growth Proofs</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B3FFC9]/10 text-[#B3FFC9] font-mono font-normal">
                          {(csForm.beforeAfter?.length || 1)} {csForm.beforeAfter?.length === 1 ? "Comparison" : "Comparisons"}
                        </span>
                      </label>
                      <p className="text-[11px] text-white/40 font-mono mt-0.5">
                        Add one or more before vs after screenshot comparisons showing client growth
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addCsBeforeAfterPair}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B3FFC9]/10 hover:bg-[#B3FFC9]/20 text-[#B3FFC9] border border-[#B3FFC9]/30 text-xs font-bold font-mono transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>+ Add Another Pair</span>
                    </button>
                  </div>

                  {/* Render list of Before & After Pairs */}
                  <div className="space-y-4">
                    {(csForm.beforeAfter && csForm.beforeAfter.length > 0 ? csForm.beforeAfter : [{ beforeImage: "", afterImage: "", beforeLabel: "Before", afterLabel: "After", title: "" }]).map((pair, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-4 rounded-2xl bg-[#0f0f10] border border-white/10 space-y-3.5 relative transition-all hover:border-white/20"
                      >
                        {/* Pair Header */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/70">
                              #{pIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={pair.title || ""}
                              onChange={(e) => updateCsBeforeAfterPair(pIdx, "title", e.target.value)}
                              placeholder={`Comparison #${pIdx + 1} Title (e.g. Reach Spike, Watch Hours, Followers)`}
                              className="px-2.5 py-1 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#B3FFC9] focus:outline-none flex-1 max-w-md"
                            />
                          </div>

                          {(csForm.beforeAfter?.length > 1) && (
                            <button
                              type="button"
                              onClick={() => removeCsBeforeAfterPair(pIdx)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                              title="Delete this comparison pair"
                            >
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          )}
                        </div>

                        {/* Side by side Before & After boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Before Card */}
                          <div className="space-y-2 p-3.5 rounded-xl bg-[#141414] border border-red-500/20">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-red-400 font-mono flex items-center gap-1.5 shrink-0">
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                BEFORE
                              </span>
                              <input
                                type="text"
                                value={pair.beforeLabel || ""}
                                onChange={(e) => updateCsBeforeAfterPair(pIdx, "beforeLabel", e.target.value)}
                                placeholder="e.g. Before: 0.34% CVR"
                                className="px-2.5 py-1 text-[11px] bg-black/40 border border-white/10 rounded-lg text-white/80 focus:border-red-400 focus:outline-none w-full"
                              />
                            </div>

                            {pair.beforeImage ? (
                              <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                                <img src={pair.beforeImage} alt="Before Proof" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const imgToDelete = pair.beforeImage;
                                    updateCsBeforeAfterPair(pIdx, "beforeImage", "");
                                    if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                                      try {
                                        await uploadAPI.deleteImage(imgToDelete);
                                        showToast("Before proof deleted from Cloudinary");
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                                  title="Remove Before Proof"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center border border-dashed border-red-500/30 hover:border-red-400 rounded-xl p-5 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all cursor-pointer">
                                <Plus size={18} className="text-red-400 mb-1" />
                                <span className="text-[11px] font-bold text-white/80">Upload "Before" Proof</span>
                                <span className="text-[10px] text-white/40 font-mono mt-0.5">e.g. baseline reach/views</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        showToast("Uploading Before proof to Cloudinary...");
                                        const url = await uploadAPI.uploadSingle(file);
                                        updateCsBeforeAfterPair(pIdx, "beforeImage", url);
                                        showToast("Before proof uploaded");
                                      } catch {
                                        showToast("Error uploading before proof");
                                      }
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>

                          {/* After Card */}
                          <div className="space-y-2 p-3.5 rounded-xl bg-[#141414] border border-[#B3FFC9]/30">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#B3FFC9] font-mono flex items-center gap-1.5 shrink-0">
                                <span className="w-2 h-2 rounded-full bg-[#B3FFC9] shadow-[0_0_8px_#B3FFC9]" />
                                AFTER
                              </span>
                              <input
                                type="text"
                                value={pair.afterLabel || ""}
                                onChange={(e) => updateCsBeforeAfterPair(pIdx, "afterLabel", e.target.value)}
                                placeholder="e.g. After: 11.76% CVR"
                                className="px-2.5 py-1 text-[11px] bg-black/40 border border-white/10 rounded-lg text-white/80 focus:border-[#B3FFC9] focus:outline-none w-full"
                              />
                            </div>

                            {pair.afterImage ? (
                              <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                                <img src={pair.afterImage} alt="After Proof" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const imgToDelete = pair.afterImage;
                                    updateCsBeforeAfterPair(pIdx, "afterImage", "");
                                    if (imgToDelete && imgToDelete.includes("cloudinary.com")) {
                                      try {
                                        await uploadAPI.deleteImage(imgToDelete);
                                        showToast("After proof deleted from Cloudinary");
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md cursor-pointer"
                                  title="Remove After Proof"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center border border-dashed border-[#B3FFC9]/30 hover:border-[#B3FFC9] rounded-xl p-5 bg-[#B3FFC9]/[0.02] hover:bg-[#B3FFC9]/[0.05] transition-all cursor-pointer">
                                <Plus size={18} className="text-[#B3FFC9] mb-1" />
                                <span className="text-[11px] font-bold text-white/80">Upload "After" Proof</span>
                                <span className="text-[10px] text-white/40 font-mono mt-0.5">e.g. scaled spike/stats</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        showToast("Uploading After proof to Cloudinary...");
                                        const url = await uploadAPI.uploadSingle(file);
                                        updateCsBeforeAfterPair(pIdx, "afterImage", url);
                                        showToast("After proof uploaded");
                                      } catch {
                                        showToast("Error uploading after proof");
                                      }
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Button at bottom of list */}
                  <button
                    type="button"
                    onClick={addCsBeforeAfterPair}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#B3FFC9]/30 hover:border-[#B3FFC9] bg-[#B3FFC9]/[0.02] hover:bg-[#B3FFC9]/[0.06] text-[#B3FFC9] text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>+ Add Another Before &amp; After Comparison Pair</span>
                  </button>
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
                {/* Type Switcher: Video Testimonial vs Text Testimonial */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/60">Testimonial Format *</label>
                  <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[#141414] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, type: "video" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${testimonialForm.type === "video"
                        ? "bg-[#B3FFC9] text-black shadow-md font-extrabold"
                        : "text-white/60 hover:text-white"
                        }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <Video size={15} />
                      <span>Video Testimonial</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, type: "text", videoUrl: "", videoId: "" })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${testimonialForm.type === "text"
                        ? "bg-[#B3FFC9] text-black shadow-md font-extrabold"
                        : "text-white/60 hover:text-white"
                        }`}
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <Quote size={15} />
                      <span>Text Testimonial</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Client / Creator Name *</label>
                    <input
                      type="text"
                      required
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      placeholder="Enter client name..."
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
                      placeholder="e.g. Founder / Creator / CEO..."
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
                      placeholder="Company or Brand name..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Display Order</label>
                    <input
                      type="number"
                      value={testimonialForm.order}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, order: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Rating</label>
                    <select
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    >
                      <option value={5}>★★★★★ (5 Stars)</option>
                      <option value={4}>★★★★☆ (4 Stars)</option>
                      <option value={3}>★★★☆☆ (3 Stars)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/60">Key Result Metric (Optional)</label>
                    <input
                      type="text"
                      value={testimonialForm.metric}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, metric: e.target.value })}
                      placeholder="e.g. +227% Retention Lift or 15h Saved/Week"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-white text-xs focus:border-[#B3FFC9] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conditional: YouTube Video Link & Position (Only for Video type) */}
                {testimonialForm.type === "video" ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#141414] border border-white/10">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white/60">YouTube Testimonial Video Link / ID *</label>
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
                          placeholder="https://www.youtube.com/watch?v=..."
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${testimonialForm.videoFirst
                            ? "bg-[#B3FFC9] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                          Left: Video | Right: Text
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestimonialForm({ ...testimonialForm, videoFirst: false })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!testimonialForm.videoFirst
                            ? "bg-[#B3FFC9] text-black"
                            : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                        >
                          Left: Text | Right: Video
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#B3FFC9]/5 border border-[#B3FFC9]/20 flex items-center gap-3 text-xs text-white/80">
                    <Quote size={20} className="text-[#B3FFC9] shrink-0" />
                    <span>
                      <strong>Text Review Mode:</strong> No video required. Displays as a glowing client testimonial card with verified badge and star rating.
                    </span>
                  </div>
                )}

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
                    placeholder="Write client testimonial quote / feedback here..."
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

        {/* ==================== MODAL: VIEW CANDIDATE APPLICATION ==================== */}
        {modalType === "viewApplication" && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
            <div
              className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl text-left my-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Green Glow Line */}
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B3FFC9] to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#183626] border border-[#B3FFC9]/30 text-[#B3FFC9] flex items-center justify-center font-black text-base shadow-[0_0_20px_rgba(179,255,201,0.2)] shrink-0"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {selectedApplication.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {selectedApplication.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#183626] text-[#B3FFC9] border border-[#B3FFC9]/30 text-[10px] font-bold">
                        {selectedApplication.jobTitle}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        ID: {selectedApplication.id || selectedApplication._id}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="text-white/50 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status and Timestamp Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141414] border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50 font-mono">Status:</span>
                  <select
                    value={selectedApplication.status || "New"}
                    onChange={(e) => handleSetApplicationStatus(selectedApplication.id || selectedApplication._id, e.target.value)}
                    className="px-3 py-1 rounded-xl bg-[#1a1a1a] border border-white/15 text-xs font-bold text-white focus:border-[#B3FFC9] focus:outline-none cursor-pointer"
                  >
                    <option value="New">🟢 New</option>
                    <option value="Reviewed">🟡 Reviewed</option>
                    <option value="Shortlisted">🔵 Shortlisted</option>
                    <option value="Rejected">🔴 Rejected</option>
                  </select>
                </div>
                <div className="text-xs font-mono text-white/40 flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#B3FFC9]" />
                  <span>{selectedApplication.fullDate || selectedApplication.date}</span>
                </div>
              </div>

              {/* Detail Fields 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Email Address</span>
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="text-sm font-semibold text-white hover:text-[#B3FFC9] truncate block"
                  >
                    {selectedApplication.email}
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Phone Number</span>
                  <div className="text-sm font-semibold text-white">
                    {selectedApplication.phone ? (
                      <a href={`tel:${selectedApplication.phone}`} className="hover:text-[#B3FFC9]">
                        {selectedApplication.phone}
                      </a>
                    ) : (
                      <span className="text-white/40">Not provided</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Experience Level</span>
                  <div className="text-sm font-semibold text-white">
                    {selectedApplication.experience || "1 - 2 Years"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Position Applied</span>
                  <div className="text-sm font-semibold text-[#B3FFC9]">
                    {selectedApplication.jobTitle}
                  </div>
                </div>
              </div>

              {/* External Links Section: Showreel & Resume */}
              {(selectedApplication.portfolioUrl || selectedApplication.resumeUrl) && (
                <div className="p-4 rounded-2xl bg-[#121212] border border-white/5 space-y-2.5">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">Candidate Links &amp; Showcase</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedApplication.portfolioUrl && (
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#183626] hover:bg-[#B3FFC9] text-[#B3FFC9] hover:text-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(179,255,201,0.15)]"
                      >
                        <ExternalLink size={13} />
                        <span>Open Showreel / Portfolio</span>
                      </a>
                    )}

                    {selectedApplication.resumeUrl && (
                      <a
                        href={selectedApplication.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#B3FFC9] border border-white/10 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>View Resume / CV</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Cover Note Section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <MessageSquare size={13} className="text-[#B3FFC9]" />
                  Cover Note / Pitch
                </span>
                <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedApplication.coverLetter || "No additional message provided."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setDeleteConfirm({
                      type: "jobApplication",
                      id: selectedApplication.id || selectedApplication._id,
                      title: `Application from ${selectedApplication.name}`
                    });
                  }}
                  className="px-4 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete Application</span>
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
                    href={`mailto:${selectedApplication.email}?subject=Regarding%20your%20application%20for%20${encodeURIComponent(selectedApplication.jobTitle)}%20at%20Littroi`}
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
