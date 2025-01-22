interface StoryProgressProps {
  progress: number;
}

export default function StoryProgress({ progress }: StoryProgressProps) {
  return (
    <div className="w-full bg-gray-600 bg-opacity-50 h-1 rounded-full overflow-hidden">
      <div 
        className="h-full bg-white transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}