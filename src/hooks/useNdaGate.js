import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const NDA_KEY = 'apex_nda_accepted_v1';

/**
 * Checks if the current user has accepted the NDA.
 * Checks localStorage first (fast), then the user entity (authoritative).
 */
export function useNdaGate() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // Fast path: localStorage flag
      if (localStorage.getItem(NDA_KEY) === 'true') {
        if (!cancelled) { setAccepted(true); setLoading(false); }
        return;
      }

      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          if (!cancelled) { setAccepted(false); setLoading(false); }
          return;
        }

        const user = await base44.auth.me();

        // Admins bypass NDA gate
        if (user?.role === 'admin') {
          localStorage.setItem(NDA_KEY, 'true');
          if (!cancelled) { setAccepted(true); setLoading(false); }
          return;
        }

        // Check user entity for nda_accepted flag
        if (user?.nda_accepted) {
          localStorage.setItem(NDA_KEY, 'true');
          if (!cancelled) { setAccepted(true); setLoading(false); }
          return;
        }

        if (!cancelled) { setAccepted(false); setLoading(false); }
      } catch {
        if (!cancelled) { setAccepted(false); setLoading(false); }
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return { accepted, loading };
}