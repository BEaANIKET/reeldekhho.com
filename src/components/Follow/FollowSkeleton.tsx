import React from "react";

const FollowSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse fixed px-4 py-6 w-[85vw] sm:w-[50vw] bg-white rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg">
      {/* Header Skeleton */}
      <div className="p-4 border-b">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Followers List Skeleton */}
      <div className="divide-y">
        {[1, 2, 3].map((id) => (
          <div key={id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar Skeleton */}
              <div className="sm:w-10 sm:h-10 w-5 h-5 bg-gray-200 rounded-full"></div>
              {/* User Info Skeleton */}
              <div className="space-y-2">
                <div className="h-4 sm:w-24 w-10 bg-gray-200 rounded"></div>
                <div className="h-3 sm:w-16 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
            {/* Buttons Skeleton */}
            <div className="flex items-center gap-2">
              <div className="sm:h-8 sm:w-20 h-4 w-10 bg-gray-200 rounded-full"></div>
              <div className="sm:h-8 sm:w-20 h-4 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowSkeleton;