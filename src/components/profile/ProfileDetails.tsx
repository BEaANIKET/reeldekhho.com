import { Info } from 'lucide-react';

interface ProfileDetailsProps {
  pageType: string;
  category: string;
  recommendationPercentage: number;
  reviewCount: number;
}

export default function ProfileDetails({
  pageType,
  category,
  recommendationPercentage,
  reviewCount,
}: ProfileDetailsProps) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Details</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <span className="font-medium dark:text-white">{pageType}</span>
            <span className="text-gray-500 dark:text-gray-400"> · </span>
            <span className="text-gray-600 dark:text-gray-300">{category}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-medium dark:text-white">
            {recommendationPercentage}% recommend
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            ({reviewCount.toLocaleString()} Reviews)
          </span>
        </div>
      </div>
    </div>
  );
} 