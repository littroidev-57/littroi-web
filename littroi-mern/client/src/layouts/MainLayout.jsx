import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";

export function MainLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  // Scroll to top automatically on route changes and track SPA navigation in GA
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-RM8VNFK9CK", {
        page_path: pathname + window.location.search,
      });
    }
  }, [pathname]);

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-primary selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

