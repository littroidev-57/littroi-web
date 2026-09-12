import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "./constants";

export function SEO({
  title,
  description = SITE_CONFIG.positioning,
  canonical,
  ogImage = "https://littroi.com/android-chrome-512x512.png",
  ogType = "website",
  noindex = false,
}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://littroi.com";
  const fullTitle = !title || title === "Home" 
    ? SITE_CONFIG.title 
    : (title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`);
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
    </Helmet>
  );
}
