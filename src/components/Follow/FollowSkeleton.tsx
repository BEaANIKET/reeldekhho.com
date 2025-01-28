import React from "react";

const FollowSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
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
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              {/* User Info Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            {/* Buttons Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowSkeleton;