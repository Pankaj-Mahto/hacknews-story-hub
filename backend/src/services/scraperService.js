import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

class ScraperService {
  constructor() {
    this.hackerNewsUrl = 'https://news.ycombinator.com';
  }

  async scrapeTopStories() {
    try {
      //console.log('Starting to scrape top stories...');
      
      const response = await axios.get(this.hackerNewsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const stories = [];

      // Select all story rows using tr.athing selector
      const storyElements = $('tr.athing');
      
      // Iterate through story rows sequentially from top to bottom
      storyElements.each((index, element) => {
        const $row = $(element);
        
        // Extract title from titleline element
        const $titleElement = $row.find('.titleline');
        const title = $titleElement.text().trim();
        const url = $titleElement.find('a').attr('href') || '';
        
        // Locate the immediate NEXT row containing subtext/meta information
        const $subtextRow = $row.next();
        
        // Only proceed if we have a valid title and URL
        if (!title || title === '' || !url || url === '') {
          return; // Skip malformed row, continue to next
        }
        
        // Extract metadata from subtext row
        let points = 0;
        let author = '';
        let postedAt = 'unknown';
        
        if ($subtextRow.length > 0) {
          const $subtextElement = $subtextRow.find('.subtext');
          
          // Extract points as Number
          const pointsText = $subtextElement.find('.score').text();
          points = Number(pointsText.match(/\d+/)?.[0] || '0');
          
          // Extract author
          author = $subtextElement.find('.hnuser').text().trim();
          
          // Extract postedAt time text
          const subtext = $subtextElement.text().trim();
          const timeMatch = subtext.match(/\d+\s+(?:second|minute|hour|day|week|month|year)s?\s+ago/i);
          if (timeMatch) {
            postedAt = timeMatch[0].trim();
          } else {
            // Fallback: find span elements containing time patterns
            const $ageElement = $subtextElement.find('span').filter(function() {
              const text = $(this).text().trim();
              return /\d+\s+(?:second|minute|hour|day|week|month|year)s?\s+ago/i.test(text);
            });
            if ($ageElement.length > 0) {
              postedAt = $ageElement.first().text().trim();
            }
          }
        }
        
        // Extract HackerNews ID from URL
        const hnIdMatch = url.match(/id=(\d+)/);
        const hnId = hnIdMatch ? hnIdMatch[1] : `story-${index}-${Date.now()}`;

        // Create story object ONLY if all required fields exist
        if (title && url && points !== undefined && author && postedAt !== 'unknown') {
          stories.push({
            title,
            url: url.startsWith('http') ? url : `${this.hackerNewsUrl}${url}`,
            points,
            author: author || 'anonymous',
            postedAt,
            hnId
          });
        }
        
        // Continue looping UNTIL exactly 10 COMPLETE valid stories are collected
        if (stories.length >= 10) {
          return false; // Stop iteration
        }
      });

      // Sort stories by points descending to ensure highest pointed stories are prioritized
      stories.sort((a, b) => b.points - a.points);
      
      //console.log(`Found ${stories.length} stories to process`);
      return await this.saveStories(stories);
    } catch (error) {
      console.error('Error scraping HackerNews:', error.message);
      throw new Error('Failed to scrape HackerNews stories');
    }
  }

  async saveStories(stories) {
    try {
      const savedStories = [];
      
      for (const storyData of stories) {
        const savedStory = await Story.findOneAndUpdate(
          { url: storyData.url },
          { 
            $set: {
              title: storyData.title,
              url: storyData.url,
              points: storyData.points,
              author: storyData.author,
              postedAt: storyData.postedAt,
              hnId: storyData.hnId,
              scrapedAt: new Date()
            }
          },
          { 
            upsert: true, 
            new: true,
            runValidators: true 
          }
        );
        
        savedStories.push(savedStory);
      }

      //console.log(`Successfully processed ${savedStories.length} stories`);
      return savedStories;
    } catch (error) {
      console.error('Error saving stories:', error.message);
      throw new Error('Failed to save stories to database');
    }
  }

  async getLatestScrapedStories() {
    try {
      return await Story.find()
        .sort({ points: -1, scrapedAt: -1 })
        .limit(10);
    } catch (error) {
      console.error('Error fetching latest stories:', error.message);
      throw new Error('Failed to fetch stories from database');
    }
  }
}

export default new ScraperService();
