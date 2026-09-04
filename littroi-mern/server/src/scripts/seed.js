import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Service } from "../models/Service.js";
import { Project } from "../models/Project.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { BlogPost } from "../models/BlogPost.js";
import { Testimonial } from "../models/Testimonial.js";
import { Job } from "../models/Job.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/littroi_db");
    console.log("[Seeder] Connected to MongoDB.");

    // Clean existing
    await User.deleteMany();
    await Service.deleteMany();
    await Project.deleteMany();
    await CaseStudy.deleteMany();
    await BlogPost.deleteMany();
    await Testimonial.deleteMany();
    await Job.deleteMany();
    console.log("[Seeder] Cleaned existing collections.");

    // 1. Seed Admin User
    await User.create({
      name: "Littroi Executive Admin",
      email: "admin@littroi.com",
      password: "admin123", // Will be auto-hashed by User model
      role: "admin"
    });
    console.log("[Seeder] Admin user seeded (admin@littroi.com / admin123)");

    // 2. Seed Services
    const initialServices = [
      {
        number: "01",
        title: "SAAS Video Production",
        category: "Video Production",
        shortDesc: "High-converting product demos and interactive UI walkthroughs.",
        fullDesc: "We transform complex software products into captivating visual narratives.",
        features: ["Product Demo Videos", "Interactive UI Motion", "Feature Launch Films"],
        icon: "MonitorPlay",
        order: 1
      },
      {
        number: "02",
        title: "Podcast Editing & Packaging",
        category: "Audio / Video",
        shortDesc: "End-to-end podcast post-production with multi-cam switching and viral clips.",
        fullDesc: "From raw footage to multi-platform distribution.",
        features: ["Color Grading", "Studio Audio Mixing", "Viral Micro-Segments"],
        icon: "Mic",
        order: 2
      },
      {
        number: "03",
        title: "Long Form Content",
        category: "Storytelling",
        shortDesc: "Documentary-style YouTube videos and brand masterclasses.",
        fullDesc: "Attention scarcity demands narrative brilliance.",
        features: ["Retention Pacing", "Sound Engineering", "YouTube Management"],
        icon: "Film",
        order: 3
      },
      {
        number: "04",
        title: "Short Form Content",
        category: "Viral Growth",
        shortDesc: "Algorithmically optimized Reels, TikToks, and Shorts.",
        fullDesc: "Zero-fluff, punchy vertical storytelling.",
        features: ["3-Second Hooks", "Kinetic Subtitles", "Multi-Platform"],
        icon: "Smartphone",
        order: 4
      },
      {
        number: "05",
        title: "Motion Graphics & 3D",
        category: "Visual Effects",
        shortDesc: "Sophisticated 2D/3D motion design that elevates product value.",
        fullDesc: "Bring abstract ideas to life.",
        features: ["3D Product Renders", "Kinetic Typography", "Lottie Animations"],
        icon: "Layers",
        order: 5
      },
      {
        number: "06",
        title: "Static Creatives & Carousels",
        category: "Social Design",
        shortDesc: "Thumb-stopping LinkedIn carousels and high-CTR paid ad creatives.",
        fullDesc: "Information design crafted for modern social feeds.",
        features: ["Paid Ad Creatives", "LinkedIn Decks", "Infographics"],
        icon: "LayoutGrid",
        order: 6
      },
      {
        number: "07",
        title: "Brand Identity Development",
        category: "Branding",
        shortDesc: "Modern brand systems, visual guidelines, and media kits.",
        fullDesc: "We don't just design logos; we construct living brand identities.",
        features: ["Brand Architecture", "Typography Systems", "Media Kits"],
        icon: "Sparkles",
        order: 7
      },
      {
        number: "08",
        title: "Thumbnails Creation",
        category: "Conversion Design",
        shortDesc: "High CTR YouTube thumbnails engineered with psychological color theory.",
        fullDesc: "The difference between 10K and 1M views is the click.",
        features: ["CTR Optimization", "A/B Testing Variants", "Retouching"],
        icon: "Image",
        order: 8
      }
    ];
    await Service.insertMany(initialServices);
    console.log("[Seeder] 8 Core Services seeded.");

    // 2.5 Seed Home Video Projects (Our Projects, Podcast Clips, Short Form)
    const initialProjects = [
      // Our Projects (16:9 Landscape)
      { title: "SaaS Launch Showcase", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "MWdasGhL9o0", videoUrl: "https://www.youtube.com/watch?v=MWdasGhL9o0", thumbnail: "https://img.youtube.com/vi/MWdasGhL9o0/maxresdefault.jpg", aspectRatio: "16/9", order: 1 },
      { title: "Brand Identity Film", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "rBNWNtLIA4s", videoUrl: "https://www.youtube.com/watch?v=rBNWNtLIA4s", thumbnail: "https://img.youtube.com/vi/rBNWNtLIA4s/maxresdefault.jpg", aspectRatio: "16/9", order: 2 },
      { title: "Product Commercial", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "Ya8-PsyzTR4", videoUrl: "https://www.youtube.com/watch?v=Ya8-PsyzTR4", thumbnail: "https://img.youtube.com/vi/Ya8-PsyzTR4/maxresdefault.jpg", aspectRatio: "16/9", order: 3 },
      { title: "3D Motion Graphics", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "6-qp1PNaGiM", videoUrl: "https://www.youtube.com/watch?v=6-qp1PNaGiM", thumbnail: "https://img.youtube.com/vi/6-qp1PNaGiM/maxresdefault.jpg", aspectRatio: "16/9", order: 4 },
      { title: "High-Paced Promo", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "Rmeb2Cv6haA", videoUrl: "https://www.youtube.com/watch?v=Rmeb2Cv6haA", thumbnail: "https://img.youtube.com/vi/Rmeb2Cv6haA/maxresdefault.jpg", aspectRatio: "16/9", order: 5 },
      { title: "Retail in America Reel", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "BQ8yYuzlovk", videoUrl: "https://www.youtube.com/watch?v=BQ8yYuzlovk", thumbnail: "https://littroi.com/wp-content/uploads/2026/06/Ron-7-scaled.png", aspectRatio: "16/9", order: 6 },
      { title: "Tech Explainer", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "_kcU6ZxSrzw", videoUrl: "https://www.youtube.com/watch?v=_kcU6ZxSrzw", thumbnail: "https://img.youtube.com/vi/_kcU6ZxSrzw/maxresdefault.jpg", aspectRatio: "16/9", order: 7 },
      { title: "Creative Storytelling", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "c1Bb2gW248A", videoUrl: "https://www.youtube.com/watch?v=c1Bb2gW248A", thumbnail: "https://img.youtube.com/vi/c1Bb2gW248A/maxresdefault.jpg", aspectRatio: "16/9", order: 8 },
      { title: "Agency Showreel", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "yHTgr-JzxrI", videoUrl: "https://www.youtube.com/watch?v=yHTgr-JzxrI", thumbnail: "https://img.youtube.com/vi/yHTgr-JzxrI/maxresdefault.jpg", aspectRatio: "16/9", order: 9 },
      { title: "Dream Talks Master", category: "our-projects", categoryLabel: "Our Projects", youtubeId: "iw0Fyvb095s", videoUrl: "https://www.youtube.com/watch?v=iw0Fyvb095s", thumbnail: "https://img.youtube.com/vi/iw0Fyvb095s/maxresdefault.jpg", aspectRatio: "16/9", order: 10 },

      // Podcast Clips (9:16 Vertical)
      { title: "Podcast Clip #1", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "d_8rxpIULNI", videoUrl: "https://www.youtube.com/shorts/d_8rxpIULNI", thumbnail: "https://img.youtube.com/vi/d_8rxpIULNI/hqdefault.jpg", aspectRatio: "9/16", order: 1 },
      { title: "Podcast Clip #2", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "cunqekHZxwA", videoUrl: "https://www.youtube.com/shorts/cunqekHZxwA", thumbnail: "https://img.youtube.com/vi/cunqekHZxwA/hqdefault.jpg", aspectRatio: "9/16", order: 2 },
      { title: "Podcast Clip #3", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "12i0lRjvUoE", videoUrl: "https://www.youtube.com/shorts/12i0lRjvUoE", thumbnail: "https://img.youtube.com/vi/12i0lRjvUoE/hqdefault.jpg", aspectRatio: "9/16", order: 3 },
      { title: "Podcast Clip #4", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "feS8f6KNNrE", videoUrl: "https://www.youtube.com/shorts/feS8f6KNNrE", thumbnail: "https://img.youtube.com/vi/feS8f6KNNrE/hqdefault.jpg", aspectRatio: "9/16", order: 4 },
      { title: "Podcast Clip #5", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "yhCBiH0SoBU", videoUrl: "https://www.youtube.com/shorts/yhCBiH0SoBU", thumbnail: "https://img.youtube.com/vi/yhCBiH0SoBU/hqdefault.jpg", aspectRatio: "9/16", order: 5 },
      { title: "Podcast Clip #6", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "uuP2xg3aFcg", videoUrl: "https://www.youtube.com/shorts/uuP2xg3aFcg", thumbnail: "https://img.youtube.com/vi/uuP2xg3aFcg/hqdefault.jpg", aspectRatio: "9/16", order: 6 },
      { title: "Podcast Clip #7", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "61wm0FE1mew", videoUrl: "https://www.youtube.com/shorts/61wm0FE1mew", thumbnail: "https://img.youtube.com/vi/61wm0FE1mew/hqdefault.jpg", aspectRatio: "9/16", order: 7 },
      { title: "Podcast Clip #8", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "8IGD7yLvhmo", videoUrl: "https://www.youtube.com/shorts/8IGD7yLvhmo", thumbnail: "https://img.youtube.com/vi/8IGD7yLvhmo/hqdefault.jpg", aspectRatio: "9/16", order: 8 },
      { title: "Podcast Clip #9", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "CvhHiuMMDYo", videoUrl: "https://www.youtube.com/shorts/CvhHiuMMDYo", thumbnail: "https://img.youtube.com/vi/CvhHiuMMDYo/hqdefault.jpg", aspectRatio: "9/16", order: 9 },
      { title: "Podcast Clip #10", category: "podcast-clips", categoryLabel: "Podcast Clips", youtubeId: "n5kGbHE4mRI", videoUrl: "https://www.youtube.com/shorts/n5kGbHE4mRI", thumbnail: "https://img.youtube.com/vi/n5kGbHE4mRI/hqdefault.jpg", aspectRatio: "9/16", order: 10 },

      // Short Form Content (9:16 Vertical)
      { title: "Short Form #1", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "VTBXEhkKT1Y", videoUrl: "https://www.youtube.com/shorts/VTBXEhkKT1Y", thumbnail: "https://img.youtube.com/vi/VTBXEhkKT1Y/hqdefault.jpg", aspectRatio: "9/16", order: 1 },
      { title: "Short Form #2", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "yD7pK3WVp4M", videoUrl: "https://www.youtube.com/shorts/yD7pK3WVp4M", thumbnail: "https://img.youtube.com/vi/yD7pK3WVp4M/hqdefault.jpg", aspectRatio: "9/16", order: 2 },
      { title: "Short Form #3", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "pgxT_b8yj0o", videoUrl: "https://www.youtube.com/shorts/pgxT_b8yj0o", thumbnail: "https://img.youtube.com/vi/pgxT_b8yj0o/hqdefault.jpg", aspectRatio: "9/16", order: 3 },
      { title: "Short Form #4", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "vIVtrsp54Kc", videoUrl: "https://www.youtube.com/shorts/vIVtrsp54Kc", thumbnail: "https://img.youtube.com/vi/vIVtrsp54Kc/hqdefault.jpg", aspectRatio: "9/16", order: 4 },
      { title: "Short Form #5", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "RgmoKjvP4Wk", videoUrl: "https://www.youtube.com/shorts/RgmoKjvP4Wk", thumbnail: "https://img.youtube.com/vi/RgmoKjvP4Wk/hqdefault.jpg", aspectRatio: "9/16", order: 5 },
      { title: "Short Form #6", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "8XxNw40VlAo", videoUrl: "https://www.youtube.com/shorts/8XxNw40VlAo", thumbnail: "https://img.youtube.com/vi/8XxNw40VlAo/hqdefault.jpg", aspectRatio: "9/16", order: 6 },
      { title: "Short Form #7", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "mlgM1RFbk1U", videoUrl: "https://www.youtube.com/shorts/mlgM1RFbk1U", thumbnail: "https://img.youtube.com/vi/mlgM1RFbk1U/hqdefault.jpg", aspectRatio: "9/16", order: 7 },
      { title: "Short Form #8", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "0N-Rg64UbJc", videoUrl: "https://www.youtube.com/shorts/0N-Rg64UbJc", thumbnail: "https://img.youtube.com/vi/0N-Rg64UbJc/hqdefault.jpg", aspectRatio: "9/16", order: 8 },
      { title: "Short Form #9", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "IHxOuDUIsGI", videoUrl: "https://www.youtube.com/shorts/IHxOuDUIsGI", thumbnail: "https://img.youtube.com/vi/IHxOuDUIsGI/hqdefault.jpg", aspectRatio: "9/16", order: 9 },
      { title: "Short Form #10", category: "short-form", categoryLabel: "Short Form Content", youtubeId: "Q3tTyeLjsyE", videoUrl: "https://www.youtube.com/shorts/Q3tTyeLjsyE", thumbnail: "https://img.youtube.com/vi/Q3tTyeLjsyE/hqdefault.jpg", aspectRatio: "9/16", order: 10 },

      // SaaS Video (16:9 Large Showcase)
      { title: "SaaS Video Showcase", category: "saas-video", categoryLabel: "SaaS Video", youtubeId: "tV-bkSj05OA", videoUrl: "https://www.youtube.com/watch?v=tV-bkSj05OA", thumbnail: "https://img.youtube.com/vi/tV-bkSj05OA/maxresdefault.jpg", aspectRatio: "16/9", order: 1 }
    ];
    await Project.insertMany(initialProjects);
    console.log("[Seeder] 31 Home Video Projects seeded (Our Projects, SaaS Video, Podcast Clips, Short Form).");

    // 3. Seed Case Studies (from littroi.com/case-studies/)
    const initialCaseStudies = [
      {
        title: "Dream Talks",
        name: "Dream Talks",
        slug: "dream-talks-case-study",
        initials: "DT",
        thumbColor: "#4C8DFF",
        category: "Instagram + YouTube · Editing & Distribution",
        cardCat: "Instagram + YouTube",
        client: "@dream.talks_ · 13 Dream Consultants",
        handle: "@dream.talks_ · 13 Dream Consultants",
        filters: ["all", "instagram-growth", "youtube-growth"],
        num: "01",
        tags: ["Instagram", "YouTube", "Shorts", "Editing", "Distribution"],
        coverImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png",
        stats: [
          { num: "706.1K", label: "IG Views / 30 days" },
          { num: "36.4K", label: "IG Interactions" },
          { num: "534K", label: "IG Accounts reached" },
          { num: "157.2K", label: "YT Views / 28 days" },
          { num: "1.2K", label: "YT Watch hours" },
          { num: "+50", label: "YT Subscribers" }
        ],
        challenge: "Dream Talks had great conversations, but the content wasn't posted consistently across Instagram or YouTube, so reach and engagement stayed low on both platforms.",
        approach: "We broke each episode into short clips and handled editing, graphics, captions, and posting to keep content flowing regularly across Instagram and YouTube. Instagram hit 706K views and 534K accounts reached (+336.7% profile activity), while YouTube picked up 157.2K views and 1.2K watch hours in 28 days, with Shorts driving a 74.6% watch-through rate.",
        images: [
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.31-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.42-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.57-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.11-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.19-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.29-PM.png"
        ],
        isPublished: true
      },
      {
        title: "Harrison Saunders",
        name: "Harrison Saunders",
        slug: "growth-voyage-case-study",
        initials: "HS",
        thumbColor: "#FF7A45",
        category: "Growth · Editing & Retention Strategy",
        cardCat: "Growth",
        client: "The Growth Voyage Podcast · @TheGrowthVoyagePodcast",
        handle: "The Growth Voyage Podcast · @TheGrowthVoyagePodcast",
        filters: ["all", "retention-strategy"],
        num: "02",
        tags: ["Editing", "Retention Strategy"],
        coverImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.36-PM.png",
        stats: [
          { num: "3:02 → 11:16", label: "Avg. view duration" },
          { num: "4.2% → 13.7%", label: "Avg. % viewed" },
          { num: "+227%", label: "Retention lift" }
        ],
        challenge: "Viewers on The Growth Voyage were dropping off early because the channel had no clear introduction explaining what the podcast offers.",
        approach: "We introduced a short podcast trailer that quickly communicated the show's value and set viewer expectations before the episode began. Average view duration climbed from 3:02 to 11:16 and average percentage viewed nearly quadrupled, a +227% lift in retention.",
        images: [
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.36-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.55-PM.png"
        ],
        isPublished: true
      },
      {
        title: "Dan Jordan",
        name: "Dan Jordan",
        slug: "dan-jordan-case-study",
        initials: "DJ",
        thumbColor: "#B3FFC9",
        category: "Shorts Growth · Hooks & Editing",
        cardCat: "Shorts Growth",
        client: "@danjordn · Shopify growth coach",
        handle: "@danjordn · Shopify growth coach",
        filters: ["all", "shorts-growth"],
        num: "03",
        tags: ["YT Shorts", "Hooks", "Channel Growth"],
        coverImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.46-PM.png",
        stats: [
          { num: "28K", label: "Top Short views" },
          { num: "1.3K", label: "Subscribers" },
          { num: "83", label: "Videos" },
          { num: "0.34% → 11.76%", label: "Conversion rate" }
        ],
        challenge: "Our client was struggling to get consistent views on his content. Despite sharing valuable insights, his videos weren't gaining traction or generating the level of engagement and growth he was aiming for.",
        approach: "We optimized his YouTube Shorts with punchy first-3-second hooks, fast-paced edits, bold on-screen captions, and a consistent branded format, helping individual Shorts reach up to 28K views and lifting his on-video conversion rate from 0.34% to 11.76%.",
        images: [
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.46-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.25.11-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.25.43-PM.png"
        ],
        isPublished: true
      },
      {
        title: "Ron Thurston",
        name: "Ron Thurston",
        slug: "ron-thurston-case-study",
        initials: "RT",
        thumbColor: "#C084FC",
        category: "Channel Growth · Thumbnails & Keywords",
        cardCat: "Channel Growth",
        client: "@retailinamerica · Retail in America",
        handle: "@retailinamerica · Retail in America",
        filters: ["all", "thumbnail-seo", "channel-growth"],
        num: "04",
        tags: ["Thumbnails", "Tags & Keywords", "Channel Analytics"],
        coverImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.03-PM.png",
        stats: [
          { num: "7.8K", label: "Views / 28 days" },
          { num: "40.8", label: "Watch hours" },
          { num: "+20", label: "Subscribers" },
          { num: "341", label: "Views on optimized video (from 28)" }
        ],
        challenge: "The videos had strong conversations but the titles and thumbnails were not visually compelling, which limited click-through and discoverability.",
        approach: "We redesigned the thumbnails and titles to be brighter, more eye-catching, and curiosity-driven, and optimized tags and keywords across the catalog. Monthly views grew from 109 to 7.8K and a single re-tagged video went from 28 views to 341.",
        images: [
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.03-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.13-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.24-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.30-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.37-PM.png"
        ],
        isPublished: true
      },
      {
        title: "Spencer Gilmore",
        name: "Spencer Gilmore",
        slug: "spencer-gilmore-case-study",
        initials: "SG",
        thumbColor: "#FFD166",
        category: "Channel Growth · Content System",
        cardCat: "Channel Growth",
        client: "@spencer_gilmore · Hair Rescue",
        handle: "@spencer_gilmore · Hair Rescue",
        filters: ["all", "channel-growth"],
        num: "05",
        tags: ["Content System", "Video Editing", "Social Management"],
        coverImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.55-PM.png",
        stats: [
          { num: "303K", label: "Top video views" },
          { num: "3.29K", label: "Subscribers" },
          { num: "324", label: "Videos" }
        ],
        challenge: "Our client struggled with maintaining consistency on social media. Despite great services, their online presence wasn't bringing in any engagement or growth.",
        approach: "We implemented a daily content system, scripting, video editing, graphics, and end-to-end social media management, helping his top video alone reach over 303K views.",
        images: [
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.24.55-PM.png",
          "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.25.02-PM.png"
        ],
        isPublished: true
      }
    ];
    await CaseStudy.insertMany(initialCaseStudies);
    console.log("[Seeder] 5 Case Studies seeded into MongoDB.");

    // 4. Seed Blog Posts
    const initialBlogs = [
      {
        title: "Why Short-Form Content is Dominating B2B SaaS Growth in 2026",
        slug: "short-form-content-b2b-saas-growth",
        excerpt: "Discover the exact retention frameworks and hook psychology driving 7-figure pipeline velocity through vertical video.",
        content: "<h3>The Death of the Traditional B2B Whitepaper</h3><p>Buyers in 2026 don't read 30-page PDFs. They watch 60-second breakdowns on LinkedIn and YouTube Shorts. If your product explanation can't command attention in the first 3 seconds, you're invisible.</p><h3>The Hook-Retain-Convert Formula</h3><p>1. <strong>Visual Pattern Interrupt:</strong> Break the feed monotony.<br/>2. <strong>High-Velocity Value:</strong> Deliver an insight within 12 seconds.<br/>3. <strong>Frictionless CTA:</strong> Direct users to a high-converting demo environment.</p>",
        category: "Content Strategy",
        readTime: "4 min read",
        featuredImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.22.21-PM.png",
        author: {
          name: "Vishal Singh Mahar",
          role: "Creative Director"
        },
        tags: ["SaaS", "Growth", "Shorts"],
        isPublished: true
      },
      {
        title: "The Engineering Behind 2.1M Organic Reel Views",
        slug: "engineering-behind-2-1m-organic-reel-views",
        excerpt: "An inside look at how algorithmic retention curves and sound design turned a stagnating account into a viral powerhouse.",
        content: "<h3>Algorithmic Retention Curves</h3><p>Algorithms don't favor creators; they favor watch time and completion rate. By restructuring the video narrative into micro-arcs every 4 seconds, drop-off rates were reduced by 68%.</p>",
        category: "Growth & Retention",
        readTime: "6 min read",
        featuredImage: "https://littroi.com/wp-content/uploads/2026/07/Screenshot-2026-07-15-at-6.23.36-PM.png",
        author: {
          name: "Littroi Editorial",
          role: "Content Strategist"
        },
        tags: ["Reels", "Retention", "Growth"],
        isPublished: true
      }
    ];
    await BlogPost.insertMany(initialBlogs);
    console.log("[Seeder] Blog posts seeded into MongoDB.");

    // 5. Seed Initial Careers / Jobs
    const initialJobs = [
      {
        title: "Lead Video Editor",
        department: "Post-Production",
        location: "Bareilly (Studio / Remote)",
        type: "Full-time",
        employmentType: "Full-time",
        experience: "2-4 Years",
        salary: "Competitive",
        overview: "Lead high-velocity video editing workflows for Tier-1 SaaS brands, podcasts, and creator channels.",
        description: "Lead high-velocity video editing workflows for Tier-1 SaaS brands, podcasts, and creator channels.",
        responsibilities: [
          "Edit narrative-driven SaaS showcase reels and podcast episodes",
          "Collaborate with creative directors on visual pacing and sound engineering",
          "Review and QA post-production output from junior editors"
        ],
        requirements: [
          "2+ years editing in Premiere Pro / After Effects",
          "Deep understanding of YouTube / Shorts retention algorithms",
          "Strong portfolio of high-engagement video edits"
        ],
        applyEmail: "careers@littroi.com",
        isActive: true
      },
      {
        title: "Senior 3D & Motion Designer",
        department: "Visual Effects",
        location: "Bareilly (Studio / Remote)",
        type: "Full-time",
        employmentType: "Full-time",
        experience: "3+ Years",
        salary: "Competitive",
        overview: "Design high-fidelity 3D software abstractions, kinetic UI animations, and hyper-modern brand visuals.",
        description: "Design high-fidelity 3D software abstractions, kinetic UI animations, and hyper-modern brand visuals.",
        responsibilities: [
          "Create photorealistic 3D product renders and device mockups",
          "Develop kinetic typography systems for social campaigns",
          "Build reusable motion design templates for video production"
        ],
        requirements: [
          "Proficiency in Cinema4D / Blender and After Effects",
          "Exceptional sense of timing, physics, lighting, and composition",
          "Experience with Figma and UI/UX design workflows is a plus"
        ],
        applyEmail: "careers@littroi.com",
        isActive: true
      },
      {
        title: "Podcast Producer & Audio Engineer",
        department: "Audio / Video",
        location: "Bareilly (Studio / Remote)",
        type: "Full-time",
        employmentType: "Full-time",
        experience: "2+ Years",
        salary: "Competitive",
        overview: "Own full podcast audio mastering, multi-camera sync, micro-clip extraction, and weekly release scheduling.",
        description: "Own full podcast audio mastering, multi-camera sync, micro-clip extraction, and weekly release scheduling.",
        responsibilities: [
          "Studio audio restoration, mixing, leveling, and mastering",
          "Identify and extract high-engagement conversational moments for Shorts",
          "Coordinate guest assets and YouTube metadata packaging"
        ],
        requirements: [
          "Proficiency in iZotope RX, Adobe Audition / Logic Pro",
          "Strong grasp of viral conversation hooks and storytelling",
          "High attention to detail and sound design excellence"
        ],
        applyEmail: "careers@littroi.com",
        isActive: true
      }
    ];
    await Job.insertMany(initialJobs);
    console.log("[Seeder] 3 Initial Career Roles seeded into MongoDB.");

    console.log("[Seeder] Complete database seed finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder Error]:", error);
    process.exit(1);
  }
};

seedData();
