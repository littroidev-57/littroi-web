import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";

// Route code-splitting: Heavy subpages and Admin dashboard loaded on demand
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const CaseStudies = lazy(() => import("./pages/CaseStudies").then((m) => ({ default: m.CaseStudies })));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail").then((m) => ({ default: m.CaseStudyDetail })));
const Careers = lazy(() => import("./pages/Careers").then((m) => ({ default: m.Careers })));
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Testimonials = lazy(() => import("./pages/Testimonials").then((m) => ({ default: m.Testimonials })));
const LegalPolicies = lazy(() => import("./pages/LegalPolicies").then((m) => ({ default: m.LegalPolicies })));
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center bg-black">
      <div className="video-loading-spinner" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Standalone Admin Route (No public header/footer) */}
        <Route path="/admin" element={<Admin />} />

        {/* Public Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonial" element={<Navigate to="/testimonials" replace />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/legal-policies" element={<LegalPolicies />} />
          <Route path="/privacy-policy" element={<Navigate to="/legal-policies" replace />} />
          <Route path="/terms" element={<Navigate to="/legal-policies" replace />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/legal-policies" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

