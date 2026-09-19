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
    <div className="w-full min-h-screen bg-[#050505] text-white pt-28 sm:pt-36 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1400px] mx-auto space-y-12 animate-pulse select-none">
      {/* Eyebrow & Title Skeleton */}
      <div className="space-y-4">
        <div className="h-3 w-28 bg-[#B3FFC9]/25 rounded-full" />
        <div className="h-10 sm:h-16 w-3/4 sm:w-1/2 bg-white/10 rounded-2xl" />
        <div className="h-4 w-full sm:w-2/3 bg-white/5 rounded-lg" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-3xl bg-[#0e0e0e] border border-white/10 p-6 space-y-5">
            <div className="aspect-[16/10] rounded-2xl bg-white/[0.04] border border-white/5" />
            <div className="space-y-2.5">
              <div className="h-3 w-20 bg-[#B3FFC9]/20 rounded-full" />
              <div className="h-5 w-4/5 bg-white/10 rounded-md" />
              <div className="h-3.5 w-full bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Secret Admin Route (Hidden from search engines & public discovery) */}
        <Route path="/studio-hq" element={<Admin />} />

        {/* Public Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          {/* Legacy /admin URL explicitly returns 404 Frame Not Found to obscure admin existence */}
          <Route path="/admin" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/about-us-2" element={<Navigate to="/about-us" replace />} />
          <Route path="/about-2" element={<Navigate to="/about-us" replace />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonial" element={<Navigate to="/testimonials" replace />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
          <Route path="/contact-us-2" element={<Navigate to="/contact-us" replace />} />
          <Route path="/contact-2" element={<Navigate to="/contact-us" replace />} />
          <Route path="/services" element={<Navigate to="/" replace />} />
          <Route path="/services-2" element={<Navigate to="/" replace />} />
          <Route path="/home-2" element={<Navigate to="/" replace />} />
          <Route path="/defining" element={<Navigate to="/" replace />} />
          <Route path="/boost-your-business-with-effective-digital-strategies" element={<Navigate to="/blog" replace />} />
          <Route path="/why-cro-is-key-to-maximizing-your-content-roi" element={<Navigate to="/blog" replace />} />
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

