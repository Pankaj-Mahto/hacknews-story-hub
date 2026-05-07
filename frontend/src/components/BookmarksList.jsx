import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import api from '../api/axios';

const BookmarksList = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalStories: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchBookmarks = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/bookmarks?page=${page}&limit=10`);
      
      if (response.data.success) {
        setBookmarks(response.data.data.stories);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookmarks(newPage);
    }
  };

  const handleBookmarkChange = (storyId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks(prevBookmarks =>
        prevBookmarks.filter(bookmark => bookmark._id !== storyId)
      );
    }
  };

  const handleRefresh = () => {
    fetchBookmarks(pagination.currentPage);
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && bookmarks.length === 0) {
    return (
      <EmptyState
        title="Failed to load bookmarks"
        description={error}
        actionText="Try Again"
        onAction={handleRefresh}
      />
    );
  }

  if (!loading && bookmarks.length === 0) {
    return (
      <EmptyState
        title="No bookmarks yet"
        description="Start bookmarking stories to see them here. Browse the top stories and click the bookmark icon to save your favorites."
        actionText="Browse Stories"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Bookmarks</h2>
          <p className="text-gray-600 text-sm">
            Your personal collection of saved stories
          </p>
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

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pagination.totalStories}</p>
              <p className="text-gray-600 text-sm">
                {pagination.totalStories === 1 ? 'Bookmarked Story' : 'Bookmarked Stories'}
              </p>
            </div>
          </div>
          
          {pagination.totalStories > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <StoryCard
            key={bookmark._id}
            story={bookmark}
            isBookmarked={true}
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
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

export default BookmarksList;
