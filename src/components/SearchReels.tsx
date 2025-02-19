import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api/axiosConfig";
import ReelCard from "./reels/ReelCard";
import { ArrowLeft } from "lucide-react";

const SearchReels = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false); // For infinite scroll loading
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [fetchedReelIds, setFetchedReelIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [startLoading, setStartLoading] = useState(true); // For initial load
    const [currentReelIndex, setCurrentReelIndex] = useState(0); // Track current reel index
    const navigate = useNavigate()
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
        //('sadadas');

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

            <header className="sm:flex hidden absolute left-2 text-black   top-3 items-center gap-4 mb-6">
                <ArrowLeft
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-2xl font-bold">Posts</h1>
            </header>
            {startLoading ? (
                <div className="flex justify-center items-center h-full w-full text-white">
                    <p>Loading reels...</p>
                </div>
            ) : (
                <div
                    ref={reelContainerRef}
                    onScroll={handleScroll}
                    className="h-[100dvh] scrollbar-hide overflow-y-scroll snap-start snap-mandatory snap-y"
                    style={{
                        scrollSnapType: "y mandatory",
                        overscrollBehavior: "contain",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {posts.map((reel, index) => (
                        <div key={index} style={{
                            scrollSnapAlign: "start",
                            scrollSnapStop: "always",
                        }}
                            className="h-[100dvh] reel-card scrollbar-hide overflow-y-scroll snap-start snap-mandatory snap-y">
                            <ReelCard reel={reel} />
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default SearchReels;
