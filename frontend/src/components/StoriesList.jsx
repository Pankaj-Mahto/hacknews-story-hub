import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import api from '../api/axios';

const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalStories: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchStories = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) {
        params.append('search', search);
      }
      
      const response = await api.get(`/stories?${params}`);
      
      if (response.data.success) {
        setStories(response.data.data.stories);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch stories');
      }
    } catch (error) {
      console.error('Fetch stories error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchStories(newPage);
    }
  };

  const handleBookmarkChange = (storyId, isBookmarked) => {
    setStories(prevStories =>
      prevStories.map(story =>
        story._id === storyId ? { ...story, bookmarked: isBookmarked } : story
      )
    );
  };

  const handleRefresh = () => {
    fetchStories(pagination.currentPage);
  };

  if (loading && stories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <EmptyState
        title="Failed to load stories"
        description={error}
        actionText="Try Again"
        onAction={handleRefresh}
      />
    );
  }

  if (!loading && stories.length === 0) {
    return (
      <EmptyState
        title="No stories available"
        description="There are no stories to display. Try scraping some stories first."
        actionText="Refresh"
        onAction={handleRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === '') {
                  fetchStories(1, '');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchStories(1, searchQuery);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid gap-4">
        {stories.map((story) => (
          <StoryCard
            key={story._id}
            story={story}
            isBookmarked={story.bookmarked || false}
            onBookmarkChange={handleBookmarkChange}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600 px-3 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage || loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default StoriesList;
