import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
}

export default function LikeButton({ isLiked, onToggle }: LikeButtonProps) {
  return (
    <button 
      onClick={onToggle}
      className="transform active:scale-125 transition-transform duration-200"
    >
      <Heart 
        className={`w-6 h-6 ${
          isLiked ? 'text-red-500 fill-current' : 'dark:text-white'
        }`} 
      />
    </button>
  );
}