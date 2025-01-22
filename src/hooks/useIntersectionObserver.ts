import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  callback: () => void = () => { },
  callback2: () => void = () => { },
  options = { threshold: .1 }
) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      } else {
        callback2();
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [callback, callback2, options]);

  return observerRef;
}

// anwkjnaknfklasnklfmkladkwqhkhwrhw