import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import StoriesList from '../components/StoriesList';
import BookmarksList from '../components/BookmarksList';

const HomePage = () => {
  const [currentView, setCurrentView] = useState('stories');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentView === 'stories' ? 'Top Stories' : 'My Bookmarks'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {currentView === 'stories' 
                ? 'Discover the latest trending stories from HackerNews community'
                : 'Your personal collection of saved stories'
              }
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {currentView === 'stories' ? (
              <StoriesList />
            ) : (
              <BookmarksList />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
