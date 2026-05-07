import express from 'express';
import { scrapeStories, getLatestStories } from '../controllers/scrapeController.js';

const router = express.Router();

router.post('/scrape', scrapeStories);
router.get('/latest', getLatestStories);

export default router;
