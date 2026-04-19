import { createContext, useContext } from "react";

export const TrialContext = createContext({ isTrial: false });

export function useTrial() {
  return useContext(TrialContext);
}