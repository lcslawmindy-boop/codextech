import { useEffect, useRef, useState } from "react";

/**
 * usePullToRefresh
 * Attaches a native-style pull-to-refresh gesture to a scrollable container.
 * @param {Function} onRefresh - async function to call on pull
 * @param {object} options
 * @param {number} options.threshold - px pulled before triggering (default 80)
 */
export function usePullToRefresh(onRefresh, { threshold = 80 } = {}) {
  const containerRef = useRef(null);
  const [pullY, setPullY] = useState(0);       // 0-1 progress
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const onTouchMove = (e) => {
      if (!pulling.current || startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        e.preventDefault();
        setPullY(Math.min(dy / threshold, 1));
      }
    };

    const onTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullY >= 1 && !refreshing) {
        setRefreshing(true);
        setPullY(0);
        try { await onRefresh(); } finally { setRefreshing(false); }
      } else {
        setPullY(0);
      }
      startY.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, threshold, pullY, refreshing]);

  return { containerRef, pullY, refreshing };
}