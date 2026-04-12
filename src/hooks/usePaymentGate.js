import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function usePaymentGate() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) { setLoading(false); return; }
        // Admin users always have access
        if (user.role === "admin") { setPaid(true); setLoading(false); return; }

        // Check 1: User entity has active subscription (set by Stripe webhook)
        if (user.subscription_status === "active") { setPaid(true); setLoading(false); return; }

        // Check 2: BetaApplication record shows converted or a paid plan
        const apps = await base44.entities.BetaApplication.filter({ email: user.email });
        const app = apps[0];
        if (app) {
          const plan = app.plan_purchased?.toLowerCase() || "";
          const hasPaid = app.status === "converted" ||
            plan.includes("starter") || plan.includes("researcher") || plan.includes("pro");
          if (hasPaid) { setPaid(true); setLoading(false); return; }
        }

        setPaid(false);
      } catch {
        setPaid(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { paid, loading };
}