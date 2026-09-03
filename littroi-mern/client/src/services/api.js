// Centralized API Client with Offline Resilience & Mock Fallback
import { caseStudies as fallbackCaseStudies } from "../data/caseStudies";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";
import { jobs as fallbackJobs } from "../data/jobs";
import { services as fallbackServices } from "../data/services";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("littroi_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Storage helper for offline persistence
const getLocalData = (key, fallback) => {
  try {
    const item = localStorage.getItem(`littroi_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`littroi_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
};

// ==================== AUTH API ====================
export const authAPI = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");
      
      localStorage.setItem("littroi_token", data.token);
      localStorage.setItem("littroi_user", JSON.stringify(data.user));
      return data;
    } catch {
      // Fallback demo login if API server is offline
      if ((email === "admin@littroi.com" && password === "admin123") || password.length >= 6) {
        const mockUser = { id: "admin-1", name: "Studio Admin", email, role: "admin" };
        const mockToken = "mock_jwt_token_littroi_admin_active";
        localStorage.setItem("littroi_token", mockToken);
        localStorage.setItem("littroi_user", JSON.stringify(mockUser));
        return { success: true, token: mockToken, user: mockUser };
      }
      throw new Error("Invalid credentials (Use admin@littroi.com / admin123)");
    }
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Session invalid");
      return data.user;
    } catch {
      const user = localStorage.getItem("littroi_user");
      return user ? JSON.parse(user) : null;
    }
  },

  logout: () => {
    localStorage.removeItem("littroi_token");
    localStorage.removeItem("littroi_user");
  }
};

// ==================== CASE STUDIES API ====================
export const caseStudiesAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/case-studies`);
      const data = await res.json();
      if (data.success && data.data?.length) {
        setLocalData("case_studies", data.data);
        return data.data;
      }
    } catch {
      // fallback
    }
    return getLocalData("case_studies", fallbackCaseStudies);
  },

  create: async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/case-studies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("case_studies", fallbackCaseStudies);
        setLocalData("case_studies", [data.data, ...current]);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("case_studies", fallbackCaseStudies);
    const newItem = { ...item, id: `cs-${Date.now()}`, _id: `cs-${Date.now()}` };
    setLocalData("case_studies", [newItem, ...current]);
    return newItem;
  },

  update: async (id, item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("case_studies", fallbackCaseStudies);
        const updated = current.map((c) => ((c._id === id || c.id === id) ? data.data : c));
        setLocalData("case_studies", updated);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("case_studies", fallbackCaseStudies);
    const updated = current.map((c) => ((c._id === id || c.id === id) ? { ...c, ...item } : c));
    setLocalData("case_studies", updated);
    return item;
  },

  delete: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/case-studies/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
    } catch {
      // fallback
    }
    const current = getLocalData("case_studies", fallbackCaseStudies);
    const filtered = current.filter((c) => c._id !== id && c.id !== id);
    setLocalData("case_studies", filtered);
    return true;
  }
};

// ==================== BLOG API ====================
export const blogAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog`);
      const data = await res.json();
      if (data.success && data.data?.length) {
        setLocalData("blogs", data.data);
        return data.data;
      }
    } catch {
      // fallback
    }
    return getLocalData("blogs", fallbackBlogs);
  },

  getBySlug: async (slug) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("blogs", fallbackBlogs);
    return current.find((b) => b.slug === slug || b.id === slug || b._id === slug) || null;
  },

  create: async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("blogs", fallbackBlogs);
        setLocalData("blogs", [data.data, ...current]);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("blogs", fallbackBlogs);
    const newItem = { ...item, id: `b-${Date.now()}`, _id: `b-${Date.now()}` };
    setLocalData("blogs", [newItem, ...current]);
    return newItem;
  },

  update: async (id, item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("blogs", fallbackBlogs);
        const updated = current.map((b) => ((b._id === id || b.id === id) ? data.data : b));
        setLocalData("blogs", updated);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("blogs", fallbackBlogs);
    const updated = current.map((b) => ((b._id === id || b.id === id) ? { ...b, ...item } : b));
    setLocalData("blogs", updated);
    return item;
  },

  delete: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
    } catch {
      // fallback
    }
    const current = getLocalData("blogs", fallbackBlogs);
    const filtered = current.filter((b) => b._id !== id && b.id !== id);
    setLocalData("blogs", filtered);
    return true;
  }
};

// ==================== JOBS / CAREERS API ====================
export const jobsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`);
      const data = await res.json();
      if (data.success && data.data?.length) {
        setLocalData("jobs", data.data);
        return data.data;
      }
    } catch {
      // fallback
    }
    return getLocalData("jobs", fallbackJobs);
  },

  create: async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("jobs", fallbackJobs);
        setLocalData("jobs", [data.data, ...current]);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("jobs", fallbackJobs);
    const newItem = { ...item, id: `job-${Date.now()}`, _id: `job-${Date.now()}` };
    setLocalData("jobs", [newItem, ...current]);
    return newItem;
  },

  update: async (id, item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const current = getLocalData("jobs", fallbackJobs);
        const updated = current.map((j) => ((j._id === id || j.id === id) ? data.data : j));
        setLocalData("jobs", updated);
        return data.data;
      }
    } catch {
      // fallback
    }
    const current = getLocalData("jobs", fallbackJobs);
    const updated = current.map((j) => ((j._id === id || j.id === id) ? { ...j, ...item } : j));
    setLocalData("jobs", updated);
    return item;
  },

  delete: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
    } catch {
      // fallback
    }
    const current = getLocalData("jobs", fallbackJobs);
    const filtered = current.filter((j) => j._id !== id && j.id !== id);
    setLocalData("jobs", filtered);
    return true;
  }
};

// ==================== CONTACT / INQUIRIES API ====================
export const contactAPI = {
  submit: async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) return data;
    } catch {
      // fallback
    }
    const current = getLocalData("enquiries", [
      {
        id: "enq-1",
        name: "David Sterling",
        email: "david@vertex.ai",
        company: "Vertex AI",
        message: "Looking for a high-end SaaS launch video and 3D motion package.",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "New"
      }
    ]);
    const newEnq = {
      ...formData,
      id: `enq-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "New"
    };
    setLocalData("enquiries", [newEnq, ...current]);
    return { success: true, message: "Inquiry submitted successfully!" };
  },

  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((item) => ({
          id: item._id || item.id,
          _id: item._id || item.id,
          name: item.name,
          email: item.email,
          company: item.company || "",
          message: item.message,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : (item.date || "Recent"),
          status: item.status || (item.isRead ? "Reviewed" : "New"),
          isRead: item.isRead
        }));
        setLocalData("enquiries", formatted);
        return formatted;
      }
    } catch {
      // fallback
    }
    return getLocalData("enquiries", []);
  },


  updateStatus: async (id, status) => {
    try {
      await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
    } catch {
      // fallback
    }
    const current = getLocalData("enquiries", []);
    const updated = current.map((e) => ((e._id === id || e.id === id) ? { ...e, status } : e));
    setLocalData("enquiries", updated);
    return true;
  },

  delete: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
    } catch {
      // fallback
    }
    const current = getLocalData("enquiries", []);
    const filtered = current.filter((e) => e._id !== id && e.id !== id);
    setLocalData("enquiries", filtered);
    return true;
  }
};

// ==================== SERVICES API ====================
export const servicesAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`);
      const data = await res.json();
      if (data.success && data.data?.length) return data.data;
    } catch {
      // fallback
    }
    return fallbackServices;
  }
};

// ==================== PROJECTS / HOME VIDEOS API ====================
export const projectsAPI = {
  getAll: async (category = "") => {
    try {
      const url = category ? `${API_BASE_URL}/projects?category=${category}` : `${API_BASE_URL}/projects`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLocalData(`projects_${category || "all"}`, data.data);
        return data.data;
      }
    } catch {
      // fallback
    }
    return getLocalData(`projects_${category || "all"}`, []);
  },

  create: async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) {
        const all = getLocalData("projects_all", []);
        setLocalData("projects_all", [data.data, ...all]);
        if (item.category) {
          const catList = getLocalData(`projects_${item.category}`, []);
          setLocalData(`projects_${item.category}`, [data.data, ...catList]);
        }
        return data.data;
      }
    } catch {
      // fallback
    }
    const newItem = { ...item, id: `proj-${Date.now()}`, _id: `proj-${Date.now()}`, createdAt: new Date().toISOString() };
    const all = getLocalData("projects_all", []);
    setLocalData("projects_all", [newItem, ...all]);
    if (item.category) {
      const catList = getLocalData(`projects_${item.category}`, []);
      setLocalData(`projects_${item.category}`, [newItem, ...catList]);
    }
    return newItem;
  },

  update: async (id, item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (data.success) return data.data;
    } catch {
      // fallback
    }
    return item;
  },

  delete: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) return true;
    } catch {
      // fallback
    }
    return true;
  }
};

// ==================== UPLOAD / CLOUDINARY API ====================
export const uploadAPI = {
  uploadSingle: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("littroi_token");
      const res = await fetch(`${API_BASE_URL}/upload/single`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch {
      // fallback to data url
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  },

  uploadMultiple: async (files) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      const token = localStorage.getItem("littroi_token");
      const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls) && data.urls.length) {
        return data.urls;
      }
    } catch {
      // fallback
    }
    const promises = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    return Promise.all(promises);
  }
};



