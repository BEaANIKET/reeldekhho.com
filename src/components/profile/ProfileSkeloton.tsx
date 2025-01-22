

export const ProfileSkeloton = () => {
    return (
        <div className="relative animate-pulse">
            {/* Cover Video Skeleton */}
            <div className="h-[200px] md:h-[300px] bg-gray-300 dark:bg-gray-700"></div>

            {/* Profile Info Bar Skeleton */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row relative">
                    {/* Profile Picture Skeleton */}
                    <div className="flex-shrink-0 absolute -top-20 md:-top-24 left-4">
                        <div className="relative inline-block">
                            <div className="w-32 md:w-40 h-32 md:h-40 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-900"></div>
                            <div className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                        </div>
                    </div>

                    {/* Name and Basic Info Skeleton */}
                    <div className="flex-grow mt-16 md:mt-4 md:ml-48 space-y-2">
                        <div className="w-40 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="w-60 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="mt-4 md:mt-4 flex space-x-2">
                        <div className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex space-x-8 mt-6 pb-4 border-b dark:border-gray-700">
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            {/* Profile Details Skeleton */}
            <div className="mt-6 px-4">
                <div className="w-48 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="w-full h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
        </div>

    )
}