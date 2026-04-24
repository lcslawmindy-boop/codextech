import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { isTrialActive } from "./useTrialPass";

export function usePaymentGate() {
  const [paid, setPaid] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          setLoading(false);
          return;
        }
        // Admin users or explicit override
        if (user.role === "admin" || user.admin_access_granted) { setPaid(true); setLoading(false); return; }

        // Only rely on Stripe Webhook populated status
        if (user.subscription_status === "active") { setPaid(true); setLoading(false); return; }

        setPaid(false);
      } catch {
        setPaid(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  return { paid, isTrial, loading };
}