

export const ProfilePostSkeloton = () => {
    return (

        <div className=" flex flex-col w-full h-fit">

            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                <div className="max-w-screen-lg mx-auto mt-2 sm:mt-5 md:mt-10 px-4">
                    {/* Profile Section */}
                    <div className="flex flex-row items-center md:items-start gap-6">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-300 rounded-[25%]"></div>
                        </div>

                        {/* User Info Section */}
                        <div className="flex-grow">
                            {/* Username */}
                            <div className="w-40 h-6 bg-gray-300 rounded-md mb-4"></div>

                            {/* Stats Section */}
                            <div className="flex gap-2">
                                <div className="flex space-x-2 sm:space-x-4 md:space-x-8 mt-4">
                                    <div>
                                        <div className="w-10 h-4 bg-gray-300 rounded-md mb-1"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
                                    </div>
                                    <div>
                                        <div className="w-10 h-4 bg-gray-300 rounded-md mb-1"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
                                    </div>
                                    <div>
                                        <div className="w-10 h-4 bg-gray-300 rounded-md mb-1"></div>
                                        <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Occupation */}
                            <div className="sm:mt-4 mt-1 bg-gray-300 p-2 rounded-md">
                                <div className="w-28 h-5 bg-gray-200 rounded-md mb-2"></div>
                                <div className="w-full h-4 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="sm:mt-4 mt-2 flex gap-4 flex-grow">
                    <div className="flex-1 h-10 bg-gray-300 rounded-md"></div>
                    <div className="flex-1 h-10 bg-gray-300 rounded-md"></div>
                </div>

                {/* Video Placeholder */}
                <div className="mt-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="relative w-full h-[9.5rem] sm:h-60 md:h-72 lg:h-80 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>
            </div>


            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Post Type Navigation Skeleton */}
                <div className="flex justify-center border-t dark:border-gray-700">
                    <div className="flex space-x-12">
                        {["POSTS", "SAVED", "LIKED"].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 px-4 py-4 animate-pulse"
                            >
                                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-16"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instagram-style Grid Skeleton */}
                <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="relative aspect-square animate-pulse">
                            <div className="w-full h-full bg-gray-300 dark:bg-gray-700"></div>
                            {/* Hover Overlay Skeleton */}
                            <div className="absolute inset-0 bg-black bg-opacity-0"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}