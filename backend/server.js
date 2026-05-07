import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import scrapeRoutes from './src/routes/scrapeRoutes.js';
import storyRoutes from './src/routes/storyRoutes.js';
import scraperService from './src/services/scraperService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'HackerNews Story Hub API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api', scrapeRoutes);
app.use('/api', storyRoutes);

const startAutoScraping = async () => {
  try {
    console.log('Starting auto-scraping on server startup...');
    await scraperService.scrapeTopStories();
    console.log('Auto-scraping completed successfully');
  } catch (error) {
    console.error('Auto-scraping failed on startup:', error.message);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await startAutoScraping();
});
