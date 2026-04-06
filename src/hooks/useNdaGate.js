import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const NDA_KEY = "bearden_nda_accepted";
const CURRENT_VERSION = "1.0";

export function useNdaGate() {
  const [accepted, setAccepted] = useState(null); // null = loading

  useEffect(() => {
    async function check() {
      try {
        // Admins bypass the NDA gate entirely
        const user = await base44.auth.me();
        if (user?.role === 'admin') { setAccepted(true); return; }
      } catch {}
      try {
        const raw = localStorage.getItem(NDA_KEY);
        if (!raw) { setAccepted(false); return; }
        const record = JSON.parse(raw);
        setAccepted(record?.accepted === true && record?.version === CURRENT_VERSION);
      } catch {
        setAccepted(false);
      }
    }
    check();
  }, []);

  return { accepted, loading: accepted === null };
}