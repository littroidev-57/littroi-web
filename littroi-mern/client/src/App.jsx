import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { CaseStudies } from "./pages/CaseStudies";
import { CaseStudyDetail } from "./pages/CaseStudyDetail";
import { Careers } from "./pages/Careers";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Contact } from "./pages/Contact";
import { Testimonials } from "./pages/Testimonials";
import { LegalPolicies } from "./pages/LegalPolicies";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
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
        <Route path="/legal-policies" element={<LegalPolicies />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
