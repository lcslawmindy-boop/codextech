import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Returns { tier, loading }
 * tier is one of: "free" | "starter" | "researcher" | "pro"
 */
export function useTier() {
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) { setTier("free"); setLoading(false); return; }
        if (user.role === "admin") { setTier("pro"); setLoading(false); return; }

        const apps = await base44.entities.BetaApplication.filter({ email: user.email });
        const app = apps[0];

        if (!app) { setTier("free"); setLoading(false); return; }

        const plan = app.plan_purchased?.toLowerCase() || "";

        if (plan.includes("elite")) { setTier("elite"); }
        else if (plan.includes("pro") || plan.includes("researcher") || app.status === "converted") { setTier("pro"); }
        else if (plan.includes("starter") || plan.includes("member")) { setTier("starter"); }
        else { setTier("free"); }
      } catch {
        setTier("free");
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { tier, loading };
}