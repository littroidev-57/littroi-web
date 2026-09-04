import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Littroi API Server Running on Port ${PORT}`);
  console.log(`🌐 Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`🎯 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);

  // Keep-alive pinger for Render Free Tier (pings every 10 mins to prevent sleep)
  const renderUrl = process.env.RENDER_EXTERNAL_URL || "https://littroi-web.onrender.com";
  if (process.env.NODE_ENV === "production" || process.env.ENABLE_KEEP_ALIVE === "true") {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes (Render sleeps at 15 mins)
    console.log(`[Keep-Alive] Initialized. Pinging ${renderUrl}/api/health every 10m.`);
    
    setInterval(async () => {
      try {
        const res = await fetch(`${renderUrl}/api/health`);
        if (res.ok) {
          console.log(`[Keep-Alive] Ping successful at ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        console.warn(`[Keep-Alive] Ping failed: ${err.message}`);
      }
    }, PING_INTERVAL);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Error]: ${err.message}`);
});


