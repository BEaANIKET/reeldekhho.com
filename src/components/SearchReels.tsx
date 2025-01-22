import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api/axiosConfig";
import ReelCard from "./reels/ReelCard";

const SearchReels = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false); // For infinite scroll loading
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [fetchedReelIds, setFetchedReelIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [startLoading, setStartLoading] = useState(true); // For initial load
    const [currentReelIndex, setCurrentReelIndex] = useState(0); // Track current reel index

    const reelContainerRef = useRef<HTMLDivElement>(null);

    // Fetch a specific reel by ID
    const fetchReels = useCallback(async (reelId: string) => {
        setStartLoading(true);
        try {
            const response = await api.get(`/post/getbyid?id=${reelId}`);
            if (response.data.post) {
                setPosts([response.data.post]);
                setFetchedReelIds([response.data.post._id]);
            }
        } catch (error) {
            console.error("Error fetching reel:", error.message);
        } finally {
            setStartLoading(false); // Ensure `startLoading` is only for initial load
        }
    }, []);

    // Fetch more reels for infinite scrolling
    const fetchMoreReels = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await api.get(`/post/get?page=${page}&excludeIds=${fetchedReelIds.join(",")}`);
            const newPosts = response.data.posts || [];
            if (newPosts.length > 0) {
                setPosts((prev) => [...prev, ...newPosts]);
                setFetchedReelIds((prev) => [...prev, ...newPosts.map((reel: any) => reel._id)]);
                setPage((prev) => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more reels:", error.message);
        } finally {
            setLoading(false); // Ensure loading is updated for infinite scroll
        }
    }, [loading, hasMore, page, fetchedReelIds]);

    // Fetch initial reel based on the `id` parameter
    useEffect(() => {
        if (id) fetchReels(id);
    }, [id, fetchReels]);

    // Handle scroll event to update the current reel index
    const handleScroll = useCallback(() => {
        const container = reelContainerRef.current;
        if (!container) return;

        const reels = container.querySelectorAll<HTMLDivElement>(".reel-card");
        const scrollTop = container.scrollTop;
        const containerHeight = container.offsetHeight;

        reels.forEach((reel, index) => {
            const reelTop = reel.offsetTop;
            const reelBottom = reelTop + reel.offsetHeight;

            if (reelTop <= scrollTop + containerHeight / 2 && reelBottom > scrollTop + containerHeight / 2) {
                setCurrentReelIndex(index);
            }
        });
    }, []);

    // Load more reels when the current index reaches `posts.length - 2`
    useEffect(() => {
        if (currentReelIndex >= posts.length - 2 && hasMore && !loading) {
            fetchMoreReels();
        }
    }, [currentReelIndex, posts.length, hasMore, loading, fetchMoreReels]);

    return (
        <div className="h-[100dvh] w-full max-w-md m-auto bg-black overflow-hidden">
            {startLoading ? (
                <div className="flex justify-center items-center h-full w-full text-white">
                    <p>Loading reels...</p>
                </div>
            ) : (
                <div
                    ref={reelContainerRef}
                    onScroll={handleScroll}
                    className="h-[100dvh] scrollbar-hide overflow-y-scroll snap-start snap-mandatory snap-y"
                >
                    {posts.map((reel, index) => (
                        <div key={index} className="snap-start w-full h-full reel-card">
                            <ReelCard reel={reel} />
                        </div>
                    ))}
                    <div
                        className="relative flex dark:bg-black bg-white text-black dark:text-white justify-center items-center z-10 h-8 w-full snap-start overflow-hidden"
                    >
                        {loading ? <p>Loading more reels...</p> : hasMore ? <p>Scroll down for more reels...</p> : <p>No more reels!</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchReels;
