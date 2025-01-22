import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { stories } from '../data/dummyData';

export default function Stories() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('stories-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const handleStoryClick = (username: string) => {
    navigate(`/stories/${username}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 mb-4 relative">
      {scrollPosition > 0 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg z-10"
        >
          <ChevronLeft className="w-5 h-5 dark:text-white" />
        </button>
      )}
      
      <div
        id="stories-container"
        className="flex space-x-4 overflow-x-auto scrollbar-hide"
      >
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button 
              onClick={() => handleStoryClick(story.username)}
              className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600 hover:scale-105 transition-transform"
            >
              <img
                src={story.avatar}
                alt={story.username}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
              />
            </button>
            <span className="text-xs dark:text-white">{story.username}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg z-10"
      >
        <ChevronRight className="w-5 h-5 dark:text-white" />
      </button>
    </div>
  );
}