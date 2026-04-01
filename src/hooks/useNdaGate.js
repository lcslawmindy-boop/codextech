import { useState, useEffect } from "react";

const NDA_KEY = "bearden_nda_accepted";
const CURRENT_VERSION = "1.0";

export function useNdaGate() {
  const [accepted, setAccepted] = useState(null); // null = loading

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NDA_KEY);
      if (!raw) { setAccepted(false); return; }
      const record = JSON.parse(raw);
      setAccepted(record?.accepted === true && record?.version === CURRENT_VERSION);
    } catch {
      setAccepted(false);
    }
  }, []);

  return { accepted, loading: accepted === null };
}