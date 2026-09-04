// Centralized API Client with Direct MongoDB Persistence
import { caseStudies as fallbackCaseStudies } from "../data/caseStudies";
import { blogPosts as fallbackBlogs } from "../data/blogPosts";
import { jobs as fallbackJobs } from "../data/jobs";
import { services as fallbackServices } from "../data/services";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Cookie utility functions for storing token in cookies (30-day persistence)
export const cookieUtils = {
  set: (name, value, days = 30) => {
    try {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    } catch {}
  },
  get: (name) => {
    try {
      const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    } catch {
      return null;
    }
  },
  remove: (name) => {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    } catch {}
  }
};

const getToken = () => {
  return cookieUtils.get("littroi_token") || localStorage.getItem("littroi_token");
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Keep Render Free Tier server awake while application is open in browser
if (typeof window !== "undefined") {
  const pingHealth = () => {
    fetch(`${API_BASE_URL}/health`).catch(() => {});
  };
  // Initial ping & periodic 4-minute ping
  pingHealth();
  setInterval(pingHealth, 4 * 60 * 1000);
}

// ==================== AUTH API ====================
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Authentication failed. Check your credentials.");
    }
    
    // Save token in Cookie (30 days) and localStorage
    cookieUtils.set("littroi_token", data.token, 30);
    localStorage.setItem("littroi_token", data.token);
    localStorage.setItem("littroi_user", JSON.stringify(data.user));
    return data;
  },

  getMe: async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
        credentials: "include"
      });
      // ONLY clear tokens when server explicitly returns 401 Unauthorized or 403 Forbidden
      if (res.status === 401 || res.status === 403) {
        cookieUtils.remove("littroi_token");
        localStorage.removeItem("littroi_token");
        localStorage.removeItem("littroi_user");
        return null;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem("littroi_user", JSON.stringify(data.user));
          return data.user;
        }
      }
      // If server is returning a 5xx error or waking up from sleep, keep local session valid
      const savedUser = localStorage.getItem("littroi_user");
      return savedUser ? JSON.parse(savedUser) : { role: "admin", email: "admin@littroi.com" };
    } catch (err) {
      // Network failure / cold-start timeout: keep user logged in with local storage cache
      console.warn("Auth check network notice (keeping local session):", err.message);
      const savedUser = localStorage.getItem("littroi_user");
      return savedUser ? JSON.parse(savedUser) : { role: "admin", email: "admin@littroi.com" };
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      }).catch(() => {});
    } catch {}
    cookieUtils.remove("littroi_token");
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
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.warn("Case studies fetch fallback:", err);
    }
    return fallbackCaseStudies;
  },

  create: async (item) => {
    const res = await fetch(`${API_BASE_URL}/case-studies`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save case study to MongoDB");
    }
    return data.data;
  },

  update: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update case study in MongoDB");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/case-studies/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete case study from MongoDB");
    }
    return true;
  }
};

// ==================== BLOG API ====================
export const blogAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/blog`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.warn("Blog fetch fallback:", err);
    }
    return fallbackBlogs;
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
    return fallbackBlogs.find((b) => b.slug === slug || b.id === slug || b._id === slug) || null;
  },

  create: async (item) => {
    const res = await fetch(`${API_BASE_URL}/blog`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to publish article to MongoDB");
    }
    return data.data;
  },

  update: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update article in MongoDB");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete article from MongoDB");
    }
    return true;
  }
};

// ==================== JOBS / CAREERS API ====================
export const jobsAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    } catch (err) {
      console.warn("Jobs fetch fallback:", err);
    }
    return fallbackJobs;
  },

  create: async (item) => {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save job opening to MongoDB");
    }
    return data.data;
  },

  update: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update job opening in MongoDB");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete job from MongoDB");
    }
    return true;
  }
};

// ==================== CONTACT / INQUIRIES API ====================
export const contactAPI = {
  submit: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to submit inquiry");
    }
    return data;
  },

  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map((item) => ({
          id: item._id || item.id,
          _id: item._id || item.id,
          name: item.name,
          email: item.email,
          phone: item.phone || "",
          company: item.company || "",
          message: item.message,
          source: item.source || "Website",
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
          fullDate: item.createdAt ? new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent",
          status: item.status || (item.isRead ? "Reviewed" : "New"),
          isRead: item.isRead
        }));
      }
    } catch (err) {
      console.warn("Enquiries fetch error:", err);
    }
    return [];
  },

  updateStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update inquiry status");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete inquiry");
    }
    return true;
  }
};

// ==================== SERVICES API ====================
export const servicesAPI = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length) {
        return data.data;
      }
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
        return data.data;
      }
    } catch (err) {
      console.warn("Projects fetch error:", err);
    }
    return [];
  },

  create: async (item) => {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to save video project to MongoDB");
    }
    return data.data;
  },

  update: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update project in MongoDB");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete project from MongoDB");
    }
    return true;
  }
};

// ==================== TESTIMONIALS API ====================
export const testimonialsAPI = {
  getAll: async (all = false) => {
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials${all ? "?all=true" : ""}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.warn("Failed to fetch testimonials from MongoDB:", err.message);
      return [];
    }
  },

  create: async (item) => {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create testimonial in MongoDB");
    }
    return data.data;
  },

  update: async (id, item) => {
    const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update testimonial in MongoDB");
    }
    return data.data;
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete testimonial from MongoDB");
    }
    return true;
  }
};

// ==================== UPLOAD / CLOUDINARY API ====================
export const uploadAPI = {
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("littroi_token");
    const res = await fetch(`${API_BASE_URL}/upload/single`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.url) {
      throw new Error(data.message || "Image upload failed");
    }
    return data.url;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
    const token = localStorage.getItem("littroi_token");
    const res = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success || !Array.isArray(data.urls)) {
      throw new Error(data.message || "Multiple upload failed");
    }
    return data.urls;
  },

  deleteImage: async (urlOrPublicId) => {
    if (!urlOrPublicId) return true;
    const token = localStorage.getItem("littroi_token");
    try {
      const res = await fetch(`${API_BASE_URL}/upload/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: urlOrPublicId })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.warn("Cloudinary delete request failed:", err.message);
      return false;
    }
  },

  deleteMultiple: async (urlsOrPublicIds) => {
    if (!urlsOrPublicIds || urlsOrPublicIds.length === 0) return true;
    const token = localStorage.getItem("littroi_token");
    try {
      const res = await fetch(`${API_BASE_URL}/upload/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ urls: urlsOrPublicIds })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.warn("Cloudinary multiple delete request failed:", err.message);
      return false;
    }
  }
};
