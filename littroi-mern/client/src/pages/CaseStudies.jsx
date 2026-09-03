import React, { useState, useEffect } from "react";
import { SEO } from "../utils/seo";
import { caseStudiesAPI } from "../services/api";
import { caseStudies as fallbackCaseStudies } from "../data/caseStudies";

export function CaseStudies() {
  const [studies, setStudies] = useState(fallbackCaseStudies);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAllCards, setShowAllCards] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeModalStudy, setActiveModalStudy] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const loadStudies = async () => {
      const data = await caseStudiesAPI.getAll();
      if (data && data.length) {
        setStudies(data);
      }
    };
    loadStudies();
  }, []);

  // Handle ESC key to close modal & lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxImg) {
          setLightboxImg(null);
        } else if (activeModalStudy) {
          setActiveModalStudy(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImg, activeModalStudy]);

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    if (activeModalStudy || lightboxImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [activeModalStudy, lightboxImg]);

  const tabs = [
    { key: "all", label: `ALL (${studies.length})` },
    { key: "instagram-growth", label: "INSTAGRAM" },
    { key: "youtube-growth", label: "YOUTUBE" },
    { key: "retention-strategy", label: "RETENTION" },
    { key: "shorts-growth", label: "SHORTS" },
    { key: "thumbnail-seo", label: "THUMBNAIL & SEO" },
    { key: "channel-growth", label: "CHANNEL GROWTH" }
  ];

  // Filtering logic
  const filteredStudies = studies.filter((study) => {
    if (activeFilter === "all") return true;
    const filters = study.filters || [];
    const cat = (study.category || "").toLowerCase();
    const catKey = (study.catKey || "").toLowerCase();
    return (
      filters.includes(activeFilter) ||
      cat.includes(activeFilter.replace("-", " ")) ||
      catKey.includes(activeFilter)
    );
  });

  const visibleStudies =
    activeFilter === "all" && !showAllCards
      ? filteredStudies.slice(0, 4)
      : filteredStudies;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setShowAllCards(true);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <>
      <SEO
        title="Case studies"
        description="Real clients, real challenges, real results — no fluff."
        canonical="/case-studies"
      />

      <style>{`
        .cs-page-root {
          font-family: 'Poppins', sans-serif;
          background: #000;
          color: #fff;
          min-height: 100vh;
          position: relative;
        }

        .cs-hero-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 120px 32px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
        }

        .cs-hero-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B3FFC9;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cs-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6.5vw, 76px);
          font-weight: 800;
          line-height: 0.98;
          color: #fff;
          letter-spacing: -0.03em;
        }

        .cs-hero-title em {
          font-style: italic;
          color: #B3FFC9;
          font-weight: 800;
        }

        .cs-hero-sub {
          color: rgba(255,255,255,0.45);
          font-size: 15px;
          line-height: 1.6;
          text-align: right;
          max-width: 320px;
          font-family: 'Poppins', sans-serif;
        }

        @media (max-width: 768px) {
          .cs-hero-container { padding: 90px 20px 24px; }
          .cs-hero-sub { text-align: left; }
        }

        /* Tabs */
        .cs-tabs-wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px 32px 30px;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .cs-tabs-wrap::-webkit-scrollbar { display: none; }

        .cs-tab-btn {
          flex: 0 0 auto;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: transparent;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .cs-tab-btn:hover:not(.is-active) {
          border-color: rgba(179,255,201,0.4);
          color: #B3FFC9;
        }
        .cs-tab-btn.is-active {
          background: #B3FFC9;
          border-color: #B3FFC9;
          color: #000;
          font-weight: 800;
        }

        /* Grid */
        .cs-grid-container {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          padding: 0 32px 80px;
          background: #000;
        }

        .cs-card {
          position: relative;
          min-height: 380px;
          aspect-ratio: 16 / 10;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: #080808;
          border: 1px solid rgba(255,255,255,0.06);
          --bar-h: 96px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .cs-card:hover {
          border-color: rgba(179,255,201,0.3);
          transform: translateY(-2px);
        }

        .cs-thumb {
          position: absolute;
          top: 0; left: 0; right: 0;
          bottom: var(--bar-h);
          z-index: 0;
        }

        .cs-thumb-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--thumb-color, #B3FFC9) 30%, transparent), transparent 65%),
            linear-gradient(160deg, #131313 0%, #060606 100%);
          transition: background 0.4s ease;
        }
        .cs-card:hover .cs-thumb-bg {
          background:
            radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--thumb-color, #B3FFC9) 42%, transparent), transparent 65%),
            linear-gradient(160deg, #161616 0%, #050505 100%);
        }

        .cs-initials-badge {
          position: absolute;
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
          width: 84px; height: 84px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 28px;
          color: #fff;
          background: color-mix(in srgb, var(--thumb-color, #B3FFC9) 35%, #0a0a0a);
          border: 1px solid color-mix(in srgb, var(--thumb-color, #B3FFC9) 55%, transparent);
          box-shadow: 0 0 0 6px color-mix(in srgb, var(--thumb-color, #B3FFC9) 10%, transparent);
          transition: transform 0.25s ease;
        }
        .cs-card:hover .cs-initials-badge {
          transform: translate(-50%, -50%) scale(1.06);
        }

        .cs-card-detail {
          position: absolute;
          bottom: calc(var(--bar-h) + 14px);
          left: 0; right: 0;
          z-index: 3;
          padding: 0 24px 12px;
          transform: translateY(12px);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .cs-card:hover .cs-card-detail {
          transform: translateY(0);
          opacity: 1;
        }

        .cs-detail-stats {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 9px;
        }
        .cs-detail-num {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: #B3FFC9;
          line-height: 1;
        }
        .cs-detail-label {
          font-size: 9px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-top: 2px;
        }

        .cs-detail-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .cs-detail-tag {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          background: rgba(179,255,201,0.08);
          color: rgba(179,255,201,0.6);
          border: 0.5px solid rgba(179,255,201,0.15);
        }

        .cs-card-bar {
          position: relative;
          z-index: 7;
          min-height: var(--bar-h);
          box-sizing: border-box;
          padding: 16px 24px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
        }
        .cs-card-cat {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B3FFC9;
          margin-bottom: 5px;
        }
        .cs-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 3px;
        }
        .cs-card-right {
          text-align: right;
          flex-shrink: 0;
          margin-left: 12px;
        }
        .cs-card-arrow {
          display: block;
          font-size: 18px;
          color: #fff;
          margin-bottom: 6px;
          transition: transform 0.2s;
        }
        .cs-card:hover .cs-card-arrow {
          transform: rotate(-45deg);
        }
        .cs-card-num {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.15);
          letter-spacing: 0.1em;
        }

        .cs-view-all {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px 20px 10px;
        }
        .cs-btn-all {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          border: 1px solid #B3FFC9;
          color: #B3FFC9;
          border-radius: 50px;
          background: transparent;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          transition: 0.3s;
        }
        .cs-btn-all:hover:not(:disabled) {
          background: #B3FFC9;
          color: #000;
        }
        .cs-btn-all:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .cs-spinner {
          width: 12px; height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: currentColor;
          animation: cs-spin 0.7s linear infinite;
        }
        @keyframes cs-spin { to { transform: rotate(360deg); } }

        /* Contained Modal Overlay matching littroi.com */
        .cs-modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 999999 !important;
          background: rgba(5, 5, 5, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 3.5vw, 48px);
          animation: csFade 0.25s ease forwards;
        }
        @keyframes csFade { from { opacity: 0; } to { opacity: 1; } }

        .cs-modal {
          background: #0a0a0a;
          width: 100%;
          max-width: 1380px;
          height: min(88vh, 900px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 32px 90px rgba(0, 0, 0, 0.9);
          position: relative;
          display: grid;
          grid-template-columns: 420px 1fr;
          overflow: hidden;
        }

        .cs-modal-close {
          position: absolute;
          top: 22px; right: 22px;
          z-index: 20;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .cs-modal-close:hover {
          background: #B3FFC9;
          color: #000;
          border-color: #B3FFC9;
        }

        .cs-modal-left {
          padding: 56px 36px 36px;
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.07);
        }

        .cs-modal-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #B3FFC9;
          margin-bottom: 8px;
        }
        .cs-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 4px;
        }
        .cs-modal-handle {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 18px;
        }

        .cs-modal-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .cs-modal-tag {
          font-family: 'Syne', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(179,255,201,0.08);
          color: rgba(179,255,201,0.7);
          border: 0.5px solid rgba(179,255,201,0.2);
        }

        .cs-modal-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .cs-modal-stat {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .cs-modal-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #B3FFC9;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .cs-modal-stat-label {
          font-size: 9.5px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .cs-modal-section { margin-bottom: 22px; }
        .cs-modal-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #B3FFC9;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .cs-modal-section-body {
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255,255,255,0.75);
          font-weight: 300;
        }

        .cs-modal-right {
          padding: 64px 40px 40px;
          overflow-y: auto;
          background: #060606;
        }
        .cs-modal-shots-title {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #B3FFC9;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }
        .cs-modal-shots {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .cs-modal-shots img {
          width: 100%;
          display: block;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: zoom-in;
          transition: opacity 0.2s;
        }
        .cs-modal-shots img:hover { opacity: 0.85; }

        /* Lightbox */
        .cs-lightbox {
          position: fixed !important;
          inset: 0 !important;
          z-index: 9999999 !important;
          background: rgba(0,0,0,0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: csFade 0.2s ease forwards;
        }
        .cs-lightbox img {
          max-width: 100%;
          max-height: 92vh;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.9);
        }
        .cs-lightbox-close {
          position: absolute;
          top: 20px; right: 20px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .cs-lightbox-close:hover {
          background: #B3FFC9;
          color: #000;
        }

        @media (max-width: 900px) {
          .cs-modal { grid-template-columns: 1fr; }
          .cs-modal-left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .cs-modal-left, .cs-modal-right { padding: 56px 22px 30px; }
        }

        @media (max-width: 760px) {
          .cs-grid-container { grid-template-columns: 1fr; padding: 0 16px 60px; gap: 14px; }
          .cs-card { aspect-ratio: unset; min-height: unset; }
          .cs-thumb { position: relative; inset: auto; width: 100%; aspect-ratio: 16 / 9; }
          .cs-initials-badge { width: 64px; height: 64px; font-size: 22px; }
          .cs-card-detail { display: none; }
          .cs-card-bar { position: relative; }
        }
      `}</style>

      <div className="cs-page-root">
        
        {/* ==================== HERO ==================== */}
        <section className="cs-hero-container">
          <div>
            <div className="cs-hero-eyebrow">
              <span>—</span> <span>CASE STUDIES</span>
            </div>
            <h1 className="cs-hero-title">
              Work that<br />
              <em>speaks.</em>
            </h1>
          </div>
          <div className="cs-hero-sub">
            Real clients, real challenges,<br />
            real results — no fluff.
          </div>
        </section>

        {/* ==================== TABS ==================== */}
        <section className="cs-tabs-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                if (tab.key !== "all") {
                  setShowAllCards(true);
                }
              }}
              className={`cs-tab-btn ${activeFilter === tab.key ? "is-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* ==================== 2-COL CARD GRID ==================== */}
        <section className="cs-grid-container">
          {visibleStudies.map((study, idx) => {
            const initials =
              study.initials ||
              (study.name || study.title || "LT")
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

            const thumbColor =
              study.thumbColor ||
              (idx % 5 === 0
                ? "#4C8DFF"
                : idx % 5 === 1
                ? "#FF7A45"
                : idx % 5 === 2
                ? "#B3FFC9"
                : idx % 5 === 3
                ? "#C084FC"
                : "#FFD166");

            const numStr = study.num || `0${idx + 1}`;
            const stats = study.stats || [];

            return (
              <div
                key={study.id || study._id || idx}
                onClick={() => setActiveModalStudy(study)}
                className="cs-card"
                style={{ "--thumb-color": thumbColor }}
              >
                {/* Thumb Area with Glowing Gradient & Center Initials Badge */}
                <div className="cs-thumb">
                  <div className="cs-thumb-bg" />
                  <div className="cs-initials-badge">{initials}</div>
                </div>

                {/* Hover Detail Overlay (above the bar) */}
                <div className="cs-card-detail">
                  {stats.length > 0 && (
                    <div className="cs-detail-stats">
                      {stats.slice(0, 2).map((s, sIdx) => (
                        <div key={sIdx}>
                          <div className="cs-detail-num">{s.num}</div>
                          <div className="cs-detail-label">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {study.tags && study.tags.length > 0 && (
                    <div className="cs-detail-tags">
                      {study.tags.slice(0, 2).map((t, tIdx) => (
                        <span key={tIdx} className="cs-detail-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar */}
                <div className="cs-card-bar">
                  <div>
                    <p className="cs-card-cat">
                      {study.cardCat || study.category || "Case Study"}
                    </p>
                    <p className="cs-card-name">
                      {study.name || study.title}
                    </p>
                  </div>
                  <div className="cs-card-right">
                    <span className="cs-card-arrow">→</span>
                    <span className="cs-card-num">{numStr}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* VIEW ALL BUTTON */}
          {activeFilter === "all" && !showAllCards && (
            <div className="cs-view-all">
              <button
                className="cs-btn-all"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
              >
                {isLoadingMore && <span className="cs-spinner" />}
                <span>
                  {isLoadingMore ? "LOADING…" : "VIEW ALL CASE STUDIES →"}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* ==================== FULLSCREEN CASE STUDY MODAL ==================== */}
        {activeModalStudy && (
          <div
            className="cs-modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModalStudy(null);
            }}
          >
            <div className="cs-modal">
              <button
                className="cs-modal-close"
                onClick={() => setActiveModalStudy(null)}
                title="Close Modal"
              >
                ✕
              </button>

              {/* Left Column: Narrative, Tags, 6 Stats, Challenge & Approach */}
              <div className="cs-modal-left">
                <p className="cs-modal-eyebrow">
                  {activeModalStudy.category || "Instagram + YouTube · Editing & Distribution"}
                </p>
                <h2 className="cs-modal-title">
                  {activeModalStudy.name || activeModalStudy.title}
                </h2>
                <p className="cs-modal-handle">
                  {activeModalStudy.handle || activeModalStudy.client}
                </p>

                {activeModalStudy.tags && activeModalStudy.tags.length > 0 && (
                  <div className="cs-modal-tags">
                    {activeModalStudy.tags.map((t, idx) => (
                      <span key={idx} className="cs-modal-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {activeModalStudy.stats && activeModalStudy.stats.length > 0 && (
                  <div className="cs-modal-stats">
                    {activeModalStudy.stats.map((s, idx) => (
                      <div key={idx} className="cs-modal-stat">
                        <div className="cs-modal-stat-num">{s.num}</div>
                        <div className="cs-modal-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeModalStudy.challenge && (
                  <div className="cs-modal-section">
                    <p className="cs-modal-section-title">The Challenge</p>
                    <p className="cs-modal-section-body">
                      {activeModalStudy.challenge}
                    </p>
                  </div>
                )}

                {activeModalStudy.approach && (
                  <div className="cs-modal-section">
                    <p className="cs-modal-section-title">Our Approach</p>
                    <p className="cs-modal-section-body">
                      {activeModalStudy.approach}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Multiple Results Screenshots / Images Gallery */}
              <div className="cs-modal-right">
                <p className="cs-modal-shots-title">Results in the data</p>
                <div className="cs-modal-shots">
                  {activeModalStudy.images && activeModalStudy.images.length > 0 ? (
                    activeModalStudy.images.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Screenshot ${idx + 1}`}
                        loading="lazy"
                        onClick={() => setLightboxImg(src)}
                      />
                    ))
                  ) : (
                    <div className="p-8 text-center text-white/30 text-xs font-mono">
                      No additional data screenshots uploaded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LIGHTBOX ==================== */}
        {lightboxImg && (
          <div className="cs-lightbox" onClick={() => setLightboxImg(null)}>
            <button
              className="cs-lightbox-close"
              onClick={() => setLightboxImg(null)}
              title="Close Image"
            >
              ✕
            </button>
            <img
              src={lightboxImg}
              alt="Enlarged screenshot"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </>
  );
}
