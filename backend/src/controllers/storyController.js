import Story from '../models/Story.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getStories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    let query = {};
    
    // Add search functionality
    if (search) {
      query.title = {
        $regex: search,
        $options: 'i' // case insensitive
      };
    }

    // Get total count for pagination
    const totalStories = await Story.countDocuments(query);

    // Get stories with pagination and sorting
    const stories = await Story.find(query)
      .sort({ points: -1, scrapedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalStories / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      message: 'Stories retrieved successfully',
      data: {
        stories,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalStories,
          limit: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stories'
    });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID format'
      });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Story retrieved successfully',
      data: {
        story
      }
    });
  } catch (error) {
    console.error('Get story by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching story'
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid story ID format'
      });
    }

    // Check if story exists
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Get user and check if story is already bookmarked
    const user = await User.findById(userId);
    const isBookmarked = user.bookmarks.includes(id);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(bookmarkId => 
        bookmarkId.toString() !== id
      );
    } else {
      // Add bookmark
      user.bookmarks.push(id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isBookmarked ? 'Bookmark removed successfully' : 'Bookmark added successfully',
      data: {
        bookmarked: !isBookmarked,
        storyId: id
      }
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating bookmark'
    });
  }
};

export const getBookmarkedStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      options: {
        sort: { points: -1, scrapedAt: -1 },
        skip: skip,
        limit: limit
      }
    });

    const totalBookmarks = user.bookmarks.length;
    const totalPages = Math.ceil(totalBookmarks / limit);

    res.status(200).json({
      success: true,
      message: 'Bookmarked stories retrieved successfully',
      data: {
        stories: user.bookmarks,
        pagination: {
          currentPage: page,
          totalPages,
          totalStories: totalBookmarks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get bookmarked stories error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookmarked stories'
    });
  }
};
