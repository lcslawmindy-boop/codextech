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
        // Check localStorage first
        const raw = localStorage.getItem(NDA_KEY);
        if (raw) {
          const record = JSON.parse(raw);
          if (record?.accepted === true && record?.version === CURRENT_VERSION) {
            setAccepted(true);
            return;
          }
        }

        // Check if email is stored and has a signature on file
        const savedEmail = localStorage.getItem("nda_member_email");
        if (savedEmail) {
          const sigs = await base44.entities.NDASignature.filter({ email: savedEmail });
          if (sigs && sigs.length > 0) {
            // Auto-accept and refresh localStorage
            localStorage.setItem(NDA_KEY, JSON.stringify({ accepted: true, version: CURRENT_VERSION }));
            setAccepted(true);
            return;
          }
        }

        setAccepted(false);
      } catch {
        setAccepted(false);
      }
    }
    check();
  }, []);

  return { accepted, loading: accepted === null };
}