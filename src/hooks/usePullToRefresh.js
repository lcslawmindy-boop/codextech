import { useEffect, useRef, useState } from "react";

/**
 * Native-style pull-to-refresh hook.
 * @param {Function} onRefresh - async function to call on refresh
 * @param {Object} options
 * @param {number} options.threshold - pixels to pull before triggering (default 80)
 */
export function usePullToRefresh(onRefresh, { threshold = 80 } = {}) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current || window;

    const getScrollTop = () => {
      if (containerRef.current) return containerRef.current.scrollTop;
      return window.scrollY || document.documentElement.scrollTop;
    };

    const onTouchStart = (e) => {
      if (getScrollTop() <= 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && getScrollTop() <= 0) {
        setPulling(true);
        setPullDistance(Math.min(dy, threshold * 1.5));
        if (dy > 10) e.preventDefault();
      }
    };

    const onTouchEnd = async () => {
      if (pullDistance >= threshold) {
        setRefreshing(true);
        setPullDistance(0);
        setPulling(false);
        await onRefresh();
        setRefreshing(false);
      } else {
        setPulling(false);
        setPullDistance(0);
      }
      startY.current = null;
    };

    const target = containerRef.current || document;
    target.addEventListener("touchstart", onTouchStart, { passive: true });
    target.addEventListener("touchmove", onTouchMove, { passive: false });
    target.addEventListener("touchend", onTouchEnd);

    return () => {
      target.removeEventListener("touchstart", onTouchStart);
      target.removeEventListener("touchmove", onTouchMove);
      target.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, threshold, pullDistance]);

  return { containerRef, pulling, pullDistance, refreshing };
}