import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../../utils/constants";
import litroiLogo from "../../assets/littroi-logo.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? window.scrollY <= 40 : true
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      setScrolled(currentScrollY > 20);

      // Keep navbar visible if mobile drawer is open
      if (mobileOpen) {
        setVisible(true);
        return;
      }

      // Show navbar ONLY at the start of the website (top of page)
      // When scrolling down OR scrolling up anywhere else on the page, hide it
      if (currentScrollY <= 40) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Check initial position on mount
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Careers", path: "/careers" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "Legal Policies", path: "/legal-policies" },
  ];

  const linkMotion = {
    whileHover: { scale: 1.14 },
    whileTap: { scale: 1.32 },
    transition: { type: "spring", stiffness: 420, damping: 16 }
  };

  return (
    <header
      className={`ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item fixed top-0 inset-x-0 z-[9999] ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      } ${
        scrolled ? "bg-black/95 backdrop-blur-md shadow-2xl border-b border-white/5" : "bg-transparent"
      }`}
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease",
      }}
      data-section="section-primary-header-builder"
    >
      <div
        className="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14"
        data-section="section-primary-header-builder"
      >
        <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-grid-center-col-layout flex items-center justify-between min-h-[90px] lg:min-h-[100px]">

          {/* LEFT: Site Logo Section */}
          <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left flex items-center">
            <div className="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
              <div className="site-branding ast-site-identity flex items-center" itemType="https://schema.org/Organization" itemScope>
                <span className="site-logo-img inline-block">
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Link
                      to="/"
                      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
                      className="custom-logo-link block focus:outline-none"
                      rel="home"
                      aria-current="page"
                    >
                      <img
                        width="95"
                        height="95"
                        src={litroiLogo}
                        className="custom-logo h-[75px] sm:h-[85px] w-auto object-contain"
                        alt="Littroi"
                        decoding="async"
                      />
                    </Link>
                  </motion.div>
                </span>
                <div className="ast-site-title-wrap sr-only">
                  <span className="site-title" itemProp="name">
                    <Link to="/" rel="home" itemProp="url">Littroi</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Main Desktop Navigation */}
          <div className="site-header-primary-section-center site-header-section ast-flex ast-grid-section-center hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
              <div className="ast-main-header-bar-alignment">
                <div className="main-header-bar-navigation">
                  <nav
                    className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item"
                    id="primary-site-navigation-desktop"
                    aria-label="Primary Site Navigation"
                    itemType="https://schema.org/SiteNavigationElement"
                    itemScope
                  >
                    <div className="main-navigation ast-inline-flex">
                      <ul
                        id="ast-hf-menu-1"
                        className="main-header-menu ast-menu-shadow ast-nav-menu ast-flex submenu-with-border ast-menu-hover-style-zoom stack-on-mobile flex items-center gap-6 lg:gap-9 list-none m-0 p-0"
                      >
                        {navLinks.map((link) => (
                          <motion.li
                            key={link.path}
                            className="menu-item"
                            {...linkMotion}
                          >
                            <NavLink
                              to={link.path}
                              end={link.path === "/"}
                              className={({ isActive }) =>
                                `menu-link text-[15px] font-semibold tracking-wide transition-colors duration-200 inline-block select-none ${
                                  isActive
                                    ? "text-[#B3FFC9]"
                                    : "text-white hover:text-[#B3FFC9]"
                                }`
                              }
                              style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                              {link.name}
                            </NavLink>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Book a Call Header Button */}
          <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section hidden md:flex items-center flex-shrink-0">
            <div className="ast-builder-layout-element ast-flex site-header-focus-item ast-header-button-1" data-section="section-hb-button-1">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 1.22 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
                className="ast-builder-button-wrap ast-builder-button-size-"
              >
                <a
                  className="ast-custom-button-link group block"
                  href={SITE_CONFIG.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                  aria-label="Book a Call"
                >
                  <div
                    className="ast-custom-button px-7 py-3 rounded-full border border-[#B3FFC9] text-[#B3FFC9] text-[15px] font-bold tracking-wide transition-all duration-300 group-hover:bg-[#B3FFC9] group-hover:text-black cursor-pointer shadow-[0_0_15px_rgba(179,255,201,0.15)] group-hover:shadow-[0_0_25px_rgba(179,255,201,0.4)]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Book a Call
                  </div>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 1.25 }}
              className="text-white p-2.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={26} className="text-[#B3FFC9]" /> : <Menu size={26} />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-8 pb-10 pt-6 animate-fadeIn">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileTap={{ scale: 1.25 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-lg font-bold transition-colors inline-block ${
                      isActive ? "text-[#B3FFC9]" : "text-white hover:text-[#B3FFC9]"
                    }`
                  }
                  style={{ fontFamily: "'Syne', sans-serif" }}
                  onClick={() => setMobileOpen(false)}
                  end={link.path === "/"}
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
            <motion.a
              whileTap={{ scale: 1.18 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 420, damping: 16 }}
              href={SITE_CONFIG.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-7 py-3.5 rounded-full border border-[#B3FFC9] text-[#B3FFC9] text-base font-bold text-center hover:bg-[#B3FFC9] hover:text-black transition-all duration-300"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Book a Call
            </motion.a>
          </nav>
        </div>
      )}
    </header>
  );
}
