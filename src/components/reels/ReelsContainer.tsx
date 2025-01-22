import { useEffect, useRef, useState, useCallback } from "react";
import ReelCard from "./ReelCard";
import useLoadReels from "../../hooks/reels/useLoadReels";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const PAGE_SIZE = 5;

export default function ReelsContainer() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0); // Track the current reel index
  const { loadReels, reels, loader, hasmore } = useLoadReels();

  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Callback for observing scroll position and updating the current index
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.offsetHeight;

    reelRefs.current.forEach((reel, index) => {
      if (reel) {
        const reelTop = reel.offsetTop;
        const reelBottom = reelTop + reel.offsetHeight;

        if (reelTop <= scrollTop + containerHeight / 2 && reelBottom > scrollTop + containerHeight / 2) {
          setCurrentReelIndex(index);
        }
      }
    });
  }, []);

  // Use intersection observer to load more reels when reaching the last div
  const lastDivRef = useIntersectionObserver(
    () => {
      if (!loader && hasmore) {
        loadReels();
      }
    },
    () => { },
    { threshold: 0.3 }
  );

  // Effect to load more reels when current index reaches second-to-last reel
  useEffect(() => {
    if (currentReelIndex >= reels.length - 2 && hasmore && !loader) {
      loadReels();
    }
  }, [currentReelIndex, reels.length, hasmore, loader, loadReels]);

  return (
    <div className="h-[100dvh] w-full max-w-md m-auto bg-black overflow-hidden">
      {loader && reels.length === 0 ? (
        <div className="flex justify-center items-center h-full text-white">
          <p>Loading...</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-[100dvh] scrollbar-hide overflow-y-scroll snap-start snap-mandatory snap-y"
        >
          {reels.map((reel, index) => (
            <div
              ref={(el) => (reelRefs.current[index] = el)}
              key={index}
              className="snap-start w-full h-full"
            >
              <ReelCard reel={reel} />
            </div>
          ))}
          <div
            ref={lastDivRef}
            className="relative flex dark:bg-black bg-white text-black dark:text-white justify-center items-center z-10 h-full w-full snap-start overflow-hidden"
          >
            {loader ? <p>Loading more reels...</p> : hasmore ? <p>Scroll down for more reels...</p> : <p>No more reels!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
