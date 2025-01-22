import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { stories } from '../../data/dummyData';
import StoryProgress from './StoryProgress'; 

export default function StoryViewer() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories.find(story => story.username === username);
  const storyIndex = stories.findIndex(story => story.username === username);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [currentStoryIndex]);

  const handleNext = () => {
    if (storyIndex < stories.length - 1) {
      navigate(`/stories/${stories[storyIndex + 1].username}`);
    } else {
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (storyIndex > 0) {
      navigate(`/stories/${stories[storyIndex - 1].username}`);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        {/* Progress Bar */}
        <div className="absolute top-0 w-full z-10 p-2">
          <StoryProgress progress={progress} />
        </div>

        {/* Close Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 z-10 text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Story Content */}
        <div className="h-full flex items-center justify-center">
          <img 
            src={currentStory.avatar} 
            alt={currentStory.username}
            className="max-h-[90vh] object-contain"
          />
        </div>

        {/* Navigation Buttons */}
        {storyIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        {storyIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* User Info */}
        <div className="absolute top-8 left-4 flex items-center space-x-2 text-white">
          <img
            src={currentStory.avatar}
            alt={currentStory.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{currentStory.username}</span>
        </div>
      </div>
    </div>
  );
}