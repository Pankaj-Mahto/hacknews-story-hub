import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const StoryCard = ({ story, isBookmarked = false, onBookmarkChange }) => {
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setBookmarkLoading(true);
    
    try {
      const response = await api.post(`/stories/${story._id}/bookmark`);
      
      if (response.data.success) {
        const newBookmarkState = response.data.data.bookmarked;
        setBookmarked(newBookmarkState);
        
        if (onBookmarkChange) {
          onBookmarkChange(story._id, newBookmarkState);
        }
        
        toast.success(
          newBookmarkState ? 'Story bookmarked!' : 'Bookmark removed!'
        );
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleStoryClick = () => {
    window.open(story.url, '_blank', 'noopener,noreferrer');
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'news.ycombinator.com';
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4" onClick={handleStoryClick}>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-6">
              {story.title}
            </h3>
            
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6z" />
                </svg>
                {story.points || 0}
              </div>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{story.author}</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {story.postedAt}
              </div>
              
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
                </svg>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{getDomainFromUrl(story.url)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStoryClick();
              }}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Open story"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                bookmarkLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : bookmarked
                  ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                  : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarkLoading ? (
                <svg className="animate-spin w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
