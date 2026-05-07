import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getStories, 
  getStoryById, 
  toggleBookmark, 
  getBookmarkedStories 
} from '../controllers/storyController.js';

const router = express.Router();

router.get('/stories', getStories);
router.get('/stories/:id', getStoryById);
router.get('/bookmarks', authenticate, getBookmarkedStories);
router.post('/stories/:id/bookmark', authenticate, toggleBookmark);

export default router;
