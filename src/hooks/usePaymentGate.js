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
        const apps = await base44.entities.BetaApplication.filter({ email: user.email });
        const app = apps[0];
        const plan = app?.plan_purchased?.toLowerCase() || "";
        // Any paid plan unlocks the platform
        const hasPaid = app?.status === "converted" ||
          plan.includes("starter") || plan.includes("researcher") || plan.includes("pro");
        setPaid(hasPaid);
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