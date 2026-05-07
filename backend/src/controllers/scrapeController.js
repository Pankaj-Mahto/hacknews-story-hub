import scraperService from '../services/scraperService.js';

export const scrapeStories = async (req, res) => {
  try {
    console.log('Scrape request received');
    
    const stories = await scraperService.scrapeTopStories();
    
    res.status(200).json({
      success: true,
      message: 'Stories scraped successfully',
      data: {
        stories,
        count: stories.length
      }
    });
  } catch (error) {
    console.error('Scrape controller error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to scrape stories'
    });
  }
};

export const getLatestStories = async (req, res) => {
  try {
    const stories = await scraperService.getLatestScrapedStories();
    
    res.status(200).json({
      success: true,
      message: 'Latest stories retrieved successfully',
      data: {
        stories,
        count: stories.length
      }
    });
  } catch (error) {
    console.error('Get latest stories error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve latest stories'
    });
  }
};
