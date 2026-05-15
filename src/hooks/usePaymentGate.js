import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Checks if the current user has an active paid subscription.
 * Uses the restoreAccess backend function which cross-checks Stripe directly.
 * Falls back to the user's subscription_status field (set by Stripe webhook).
 */
export function usePaymentGate() {
  const [paid, setPaid] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          if (!cancelled) { setPaid(false); setLoading(false); }
          return;
        }

        const user = await base44.auth.me();

        // Admins always have access
        if (user?.role === 'admin') {
          if (!cancelled) { setPaid(true); setLoading(false); }
          return;
        }

        // Fast path: check user entity first (set by Stripe webhook)
        if (user?.subscription_status === 'active' || user?.admin_access_granted) {
          if (!cancelled) { setPaid(true); setLoading(false); }
          return;
        }

        // Slow path: verify against Stripe directly (catches missed webhooks)
        try {
          const res = await base44.functions.invoke('restoreAccess', {});
          if (!cancelled) {
            const active = res.data?.status === 'active';
            setPaid(active);
          }
        } catch {
          // If restoreAccess fails, fall back to user entity
          if (!cancelled) setPaid(false);
        }
      } catch {
        if (!cancelled) setPaid(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return { paid, isTrial, loading };
}