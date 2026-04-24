/**
 * useABTest — Sticky session bucket assignment with analytics tracking.
 * Usage:
 *   const { bucket, track } = useABTest("headline-01", ["A", "B", "C"]);
 *   // bucket is sticky per session (sessionStorage)
 *   // track("cta_clicked") logs { testId, bucket } to base44 analytics
 */
import { useState } from "react";
import { base44 } from "@/api/base44Client";

export function useABTest(testId, variants = ["A", "B"]) {
  const key = `zarp_ab_${testId}`;

  const [bucket] = useState(() => {
    const saved = sessionStorage.getItem(key);
    if (saved && variants.includes(saved)) return saved;
    const assigned = variants[Math.floor(Math.random() * variants.length)];
    sessionStorage.setItem(key, assigned);
    // Log assignment to analytics
    try {
      base44.analytics.track({
        eventName: "ab_test_assigned",
        properties: { testId, bucket: assigned },
      });
    } catch (_) {}
    return assigned;
  });

  const track = (eventName, extraProps = {}) => {
    try {
      base44.analytics.track({
        eventName,
        properties: { testId, bucket, ...extraProps },
      });
    } catch (_) {}
  };

  return { bucket, track };
}

export default useABTest;