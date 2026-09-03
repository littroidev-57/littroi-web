import React from "react";
import { Link, useLocation } from "react-router-dom";
import littroiHeroImg from "../../assets/littroi-hero-page.png";

export function Footer() {
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about-us" },
    { name: "Case studies", path: "/case-studies" },
    { name: "Careers", path: "/careers" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "Legal-policies", path: "/legal-policies" },
  ];

  return (
    <footer
      className="elementor-element elementor-element-a2b4365 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no wpr-column-slider-no wpr-equal-height-no e-con e-parent e-lazyloaded bg-black text-white relative pt-16 sm:pt-24 pb-0 overflow-hidden select-none"
      data-id="a2b4365"
      data-element_type="container"
      data-e-type="container"
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Column 1: Build Right With Littroi (strictly ONE LINE) + Solid Green Book a Call Button */}
          <div className="md:col-span-6 flex flex-col items-start space-y-6 max-w-[560px]">
            <h2
              className="m-0 text-white whitespace-nowrap leading-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(26px, 3.4vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Build Right With Littroi
            </h2>

            {/* Solid Mint Green Book a Call Bar Button with clean spacing */}
            <a
              href="https://calendly.com/littroi-info/strategy-call"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[480px] h-[52px] rounded-[10px] bg-[#b3ffc9] text-black font-bold flex items-center justify-center text-base tracking-wide hover:bg-[#9effba] hover:shadow-[0_0_30px_rgba(179,255,201,0.4)] transition-all duration-300 hover:scale-[1.01] mt-3"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Book a Call
            </a>
          </div>

          {/* Column 2: Vertical Nav Menu */}
          <div className="md:col-span-3 flex flex-col items-start">
            <nav aria-label="Menu" className="w-full">
              <ul className="space-y-2">
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
                        className={`text-sm transition-colors duration-200 block ${
                          isActive
                            ? "text-[#b3ffc9] font-semibold"
                            : "text-white/70 hover:text-[#b3ffc9]"
                        }`}
                        style={{
                          fontFamily: "'Syne', sans-serif",
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Column 3: Location & Solid Green Social Icon Squares (Centered Vertically in Height) */}
          <div className="md:col-span-3 flex flex-col items-start justify-center self-center space-y-4">
            <h3
              className="m-0 text-white/80 text-xs font-semibold tracking-wider text-left"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Bareilly, India
            </h3>

            {/* Social Icons (Solid Mint Green Squares matching Screenshot 2) */}
            <div className="flex items-center justify-start gap-2.5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/littroi/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[7px] bg-[#b3ffc9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Littroius/61572722251178/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[7px] bg-[#b3ffc9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                </svg>
              </a>

              {/* Youtube */}
              <a
                href="https://www.youtube.com/@Littroi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[7px] bg-[#b3ffc9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300 shadow-sm"
                aria-label="Youtube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512">
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                </svg>
              </a>

              {/* Linkedin */}
              <a
                href="https://www.linkedin.com/company/littroi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-[7px] bg-[#b3ffc9] text-black flex items-center justify-center hover:bg-[#9effba] hover:scale-105 transition-all duration-300 shadow-sm"
                aria-label="Linkedin"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Giant LITTROI Hero Image with smooth up-down transition and top spacing */}
      <div
        className="w-full overflow-hidden flex items-end justify-center pointer-events-none select-none px-2 sm:px-4 mt-6 sm:mt-12"
        style={{ animation: "floatUpDown 3.8s ease-in-out infinite" }}
      >
        <img
          src={littroiHeroImg}
          alt="Littroi"
          className="w-full max-w-full h-auto object-contain block mx-auto opacity-100"
          style={{
            maxHeight: "45vh",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </footer>
  );
}
