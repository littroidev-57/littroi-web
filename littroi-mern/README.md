# Littroi Media Studio — MERN Stack Application

A production-ready MERN stack rebuild of the **Littroi Media** creative agency platform, engineered for peak performance, smooth motion, high-retention video showcases, and seamless Calendly strategy booking.

---

## 🚀 Key Highlights

- **Aesthetic**: Bold editorial creative studio design with glassmorphism, ambient gradients, and crisp typography (Syne & Plus Jakarta Sans).
- **Video First**: Reusable lazy-loading video player with muted autoplay, full-screen controls, and responsive 16:9 & 9:16 aspect ratios.
- **Calendly Booking**: Direct integration of the official Littroi strategy call calendar (`https://calendly.com/littroi-info/strategy-call`) on all CTAs and the `/contact` page.
- **Micro-Animations**: Framer Motion scroll reveals, staggered typography reveals, and GPU-accelerated infinite marquee loops.
- **MongoDB Backend**: Complete Express.js REST API with Mongoose schemas for User, Service, Project, CaseStudy, BlogPost, Testimonial, Job, and ContactEnquiry.
- **Admin Portal**: Dedicated `/admin` route with JWT authentication and CMS capabilities.

---

## 📁 Project Architecture

```
littroi-mern/
├── client/                     # Frontend (React, Vite, Tailwind, Framer Motion)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Badge, VideoPlayer, Modal, Loader
│   │   │   ├── shared/         # Navbar, Footer, BookCallButton
│   │   │   └── animations/     # FadeIn, TextReveal, Marquee
│   │   ├── sections/           # Modular page sections (Hero, Intro, Clients, etc.)
│   │   ├── pages/              # Home, About, Case Studies, Careers, Blog, Contact, Legal, Admin
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── data/               # Structured agency datasets
│   │   └── utils/              # SEO, helpers, constants
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Backend (Node.js, Express, MongoDB, Mongoose)
    ├── src/
    │   ├── config/             # Database connection & env loaders
    │   ├── models/             # Mongoose schemas
    │   ├── controllers/        # Route controllers
    │   ├── middleware/         # JWT Auth, Role Authorizer, Error Handler, Rate Limiter
    │   ├── routes/             # REST endpoints (/api/services, /api/projects, etc.)
    │   ├── scripts/            # Database seeders
    │   ├── app.js
    │   └── server.js
    └── package.json
```

---

## 🛠️ Quick Start

### 1. Install All Dependencies
```bash
cd littroi-mern
npm run install-all
```

### 2. Configure Environment Files
- Client: Verify `client/.env`
- Server: Verify `server/.env`

### 3. Run Development Servers
```bash
# Start Vite Client (http://localhost:5173)
npm run client

# Start Express Backend (http://localhost:5000)
npm run server
```

---

## 🌐 Routes Map

| Route | Page / Description |
|---|---|
| `/` | Homepage with Hero, Intro, Clients, Projects, Services, Testimonials, Marquee, CTA |
| `/about` | About page with brand values, story, leadership, and CTAs |
| `/case-studies` | Client case studies showcase with ROI metrics |
| `/case-studies/:slug` | In-depth case study breakdown (challenge, solution, deliverables) |
| `/careers` | Open job listings with accordion view & apply actions |
| `/blog` | Editorial articles & video retention strategies |
| `/blog/:slug` | Full article view with author info & related posts |
| `/contact` | Direct Calendly booking experience + inquiry form |
| `/legal-policies` | Master services agreement, privacy, and studio policies |
| `/admin` | Secure CMS dashboard for agency management |

---

## 🔒 Security Features
- **Helmet.js** for HTTP security headers
- **CORS** whitelisting
- **Express Rate Limit** to mitigate brute force & DDoS attempts
- **Bcrypt.js** password hashing
- **JWT (JSON Web Tokens)** for protected admin endpoints
