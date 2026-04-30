import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const NDA_KEY = "bearden_nda_accepted";
const CURRENT_VERSION = "1.0";

export function useNdaGate() {
  // NDA gate disabled — all users have open access
  return { accepted: true, loading: false };
}