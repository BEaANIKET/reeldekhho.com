import { useEffect, useRef, useState, useCallback } from "react";
import ReelCard from "./ReelCard";
import useLoadReels from "../../hooks/reels/useLoadReels";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThrottle } from "@react-hook/throttle";

const PAGE_SIZE = 5;

export default function ReelsContainer() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const { loadReels, reels, loader, hasmore } = useLoadReels();
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const isScrolling = useRef(false);

  // Throttled scroll handler with snap enforcement
  const handleScroll = useThrottle(() => {
    if (!containerRef.current || isScrolling.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const closestIndex = Math.round(scrollTop / containerHeight);

    if (closestIndex !== currentReelIndex) {
      isScrolling.current = true;
      const targetScroll = closestIndex * containerHeight;

      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      setCurrentReelIndex(closestIndex);

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  }, 100);

  // Prevent keyboard scrolling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      container.setAttribute('tabIndex', '0'); // Make container focusable
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Load more reels when approaching end
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
          style={{
            scrollSnapType: 'y mandatory',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {reels.map((reel, index) => (
            <div
              ref={(el) => (reelRefs.current[index] = el)}
              key={index}
              className="snap-start w-full h-full"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}