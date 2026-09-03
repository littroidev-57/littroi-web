// Import all client logo assets from assets folder
const logoModules = import.meta.glob("../assets/*.png", { eager: true, import: "default" });

// Extract all Group logos and named logos — exclude hero/logo assets
const EXCLUDED = ["hero", "littroi-logo", "littroi-hero"];
export const clientLogos = Object.entries(logoModules)
  .filter(([path]) => !EXCLUDED.some((ex) => path.includes(ex)))
  .map(([path, src], index) => {
    const filename = path.split("/").pop().replace(".png", "");
    return {
      id: `client-logo-${index}`,
      name: filename,
      src: src,
      alt: filename
    };
  });

// Split into Row 1 and Row 2 for dual marquee effect like littroi.com
const half = Math.ceil(clientLogos.length / 2);
export const clientLogosRow1 = clientLogos.slice(0, half);
export const clientLogosRow2 = clientLogos.slice(half);

export const clients = [
  {
    id: "kg-loan-experts",
    name: "KG Loan Experts",
    category: "Financial Services",
    metric: "4.8x Lead Growth"
  },
  {
    id: "soffee-bike",
    name: "Soffee Bike",
    category: "E-Mobility",
    metric: "2.4M Views"
  },
  {
    id: "hair-rescue",
    name: "Hair Rescue",
    category: "Health & Beauty",
    metric: "+280% Organic Reach"
  },
  {
    id: "td-elite",
    name: "TD Elite",
    category: "Athletics & Training",
    metric: "180K Community"
  },
  {
    id: "the-growth-voyage",
    name: "The Growth Voyage",
    category: "Podcast Series",
    metric: "Top 5% Chart"
  },
  {
    id: "mindset90",
    name: "Mindset90",
    category: "Podcast Media",
    metric: "6x Audience Growth"
  },
  {
    id: "tst",
    name: "TST Media",
    category: "Tech & Media",
    metric: "1.2M+ Reach"
  },
  {
    id: "treeline-press",
    name: "Treeline Press",
    category: "Publishing",
    metric: "280% Reach Lift"
  },
  {
    id: "13dreams",
    name: "13Dreams",
    category: "SaaS Product",
    metric: "40K Views, 200+ Leads"
  },
  {
    id: "maitly-ai",
    name: "Maitly.ai",
    category: "Artificial Intelligence",
    metric: "Enterprise Launch"
  },
  {
    id: "the-podcast-blueprint",
    name: "The Podcast Blueprint",
    category: "Production Masterclass",
    metric: "500K+ Impressions"
  },
  {
    id: "reethink-podcast",
    name: "ReeThink Podcast",
    category: "Thought Leadership",
    metric: "10x Retention Lift"
  }
];
