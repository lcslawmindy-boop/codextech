import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Single $49/mo membership model.
 * Returns { tier, loading, refetch }
 * tier: "free" | "member"
 * admin always returns "member"
 */
export function useTier() {
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      if (!user) { setTier("free"); setLoading(false); return; }

      // Admins always have full access
      if (user.role === "admin") { setTier("member"); setLoading(false); return; }

      // Check BetaApplication for active membership
      const apps = await base44.entities.BetaApplication.filter({ email: user.email });
      const app = apps[0];

      if (!app) { setTier("free"); setLoading(false); return; }

      const plan = (app.plan_purchased || "").toLowerCase();
      const isActive = app.status === "converted" || app.status === "active" ||
        plan.includes("member") || plan.includes("research") ||
        plan.includes("pro") || plan.includes("starter") || plan.includes("elite");

      setTier(isActive ? "member" : "free");
    } catch {
      setTier("free");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  return { tier, loading, refetch: check };
}