import { useState } from 'react';

/**
 * Payment / NDA gate has been removed — the full site is now public.
 * Always returns paid: true so all routes are accessible.
 */
export function usePaymentGate() {
  const [paid] = useState(true);
  const [isTrial] = useState(false);
  const [loading] = useState(false);
  return { paid, isTrial, loading };
}