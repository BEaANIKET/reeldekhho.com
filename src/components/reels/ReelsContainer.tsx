import { useEffect, useRef, useState, useCallback } from "react";
import ReelCard from "./ReelCard";
import useLoadReels from "../../hooks/reels/useLoadReels";

export default function ReelsContainer() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const { loadReels, reels, loader, hasmore } = useLoadReels();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

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

  useEffect(() => {
    if (currentReelIndex >= reels.length - 2 && hasmore) {
      loadReels();
    }
  }, [currentReelIndex, reels.length, hasmore, loadReels]);

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
          style={{
            scrollSnapType: "y mandatory",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {reels.map((reel, index) => (
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
}
