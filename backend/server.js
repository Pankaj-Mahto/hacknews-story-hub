import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/database.js";

import authRoutes from "./src/routes/authRoutes.js";
import scrapeRoutes from "./src/routes/scrapeRoutes.js";
import storyRoutes from "./src/routes/storyRoutes.js";

import scraperService from "./src/services/scraperService.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIX: correct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect DB
connectDB();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// =====================
// API Routes
// =====================
app.get("/api", (req, res) => {
  res.json({ message: "HackerNews Story Hub API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api", scrapeRoutes);
app.use("/api", storyRoutes);

// =====================
// Serve Frontend (React Build)
// =====================
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =====================
// Auto Scraper
// =====================
const startAutoScraping = async () => {
  try {
    await scraperService.scrapeTopStories();
    console.log("Auto-scraping completed successfully");
  } catch (error) {
    console.error("Auto-scraping failed:", error.message);
  }
};

// =====================
// Start Server
// =====================
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await startAutoScraping();
});