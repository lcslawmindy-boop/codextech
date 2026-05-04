import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { isMemberPlan } from "@/lib/tiers";

/**
 * Unified tier hook — single $49/mo membership model.
 * Returns { tier, loading, isMember, refetch }
 * tier: "free" | "member"
 *
 * Access check priority:
 * 1. user.role === "admin" → always member
 * 2. user.subscription_status === "active" → member (set by Stripe webhook)
 * 3. BetaApplication.plan_purchased / status fallback
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

      // Stripe webhook sets this directly — most reliable
      if (user.subscription_status === "active") { setTier("member"); setLoading(false); return; }

      // Fallback: check BetaApplication record
      const apps = await base44.entities.BetaApplication.filter({ email: user.email });
      const app = apps[0];
      if (app && isMemberPlan(app.plan_purchased, app.status)) {
        setTier("member"); setLoading(false); return;
      }

      setTier("free");
    } catch {
      setTier("free");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  return { tier, loading, isMember: tier === "member", refetch: check };
}