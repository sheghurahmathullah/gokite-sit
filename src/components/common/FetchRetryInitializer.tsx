"use client";

import { useEffect } from "react";
import { enableGlobalFetchRetry } from "@/lib/fetchWithRetry";

/**
 * Component that initializes global fetch retry logic on mount
 * This should be included in the root layout
 */
export function FetchRetryInitializer() {
  useEffect(() => {
    // Enable global fetch retry for internal API calls
    enableGlobalFetchRetry();
  }, []);

  // This component doesn't render anything
  return null;
}

