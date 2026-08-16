import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

// Hook: returns the current user's research-credit balance + a spend() function.
export function useCredits() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await base44.functions.invoke("getCreditBalance", {});
      setBalance(res.data?.balance ?? 0);
    } catch {
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Spend credits for an export. Returns { ok, balance } or { ok: false, balance, required }.
  const spend = useCallback(async (description, credits) => {
    try {
      const res = await base44.functions.invoke("spendCredits", { description, credits });
      if (res.data?.success) {
        setBalance(res.data.balance);
        return { ok: true, balance: res.data.balance };
      }
      return { ok: false, balance: res.data?.balance ?? 0, required: credits };
    } catch (e) {
      const data = e?.response?.data;
      return { ok: false, balance: data?.balance ?? 0, required: credits, error: data?.error };
    }
  }, []);

  return { balance, loading, refresh, spend };
}