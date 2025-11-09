/**
 * Session Monitor Hook
 * Automatically monitors session expiry and refreshes when needed
 */

import { useEffect, useRef } from "react";
import {
  isSessionExpiring,
  isSessionExpired,
  refreshSession,
  clearSessionData,
  getTimeUntilExpiry,
} from "@/lib/sessionManager";

interface UseSessionMonitorOptions {
  enabled?: boolean;
  checkInterval?: number; // in milliseconds
  refreshThreshold?: number; // in minutes before expiry
  onSessionExpired?: () => void;
  onSessionRefreshed?: () => void;
  onRefreshFailed?: () => void;
}

export function useSessionMonitor(options: UseSessionMonitorOptions = {}) {
  const {
    enabled = true,
    checkInterval = 60000, // Check every 1 minute
    refreshThreshold = 5, // Refresh 5 minutes before expiry
    onSessionExpired,
    onSessionRefreshed,
    onRefreshFailed,
  } = options;

  const refreshingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      console.log("[SessionMonitor] Monitoring disabled");
      return;
    }

    console.log("[SessionMonitor] Starting session monitoring");

    const checkSession = async () => {
      // Skip if already refreshing
      if (refreshingRef.current) {
        console.log("[SessionMonitor] Refresh already in progress, skipping...");
        return;
      }

      // Check if session has expired
      if (isSessionExpired()) {
        console.log("[SessionMonitor] Session has expired");
        clearSessionData();
        onSessionExpired?.();
        return;
      }

      // Check if session is about to expire
      if (isSessionExpiring(refreshThreshold)) {
        const timeLeft = getTimeUntilExpiry();
        console.log(
          `[SessionMonitor] Session expiring soon (${timeLeft} minutes left), attempting refresh...`
        );

        refreshingRef.current = true;

        try {
          const success = await refreshSession();

          if (success) {
            console.log("[SessionMonitor] Session refreshed successfully");
            onSessionRefreshed?.();
          } else {
            console.error("[SessionMonitor] Session refresh failed");
            onRefreshFailed?.();
          }
        } catch (error) {
          console.error("[SessionMonitor] Error during session refresh:", error);
          onRefreshFailed?.();
        } finally {
          refreshingRef.current = false;
        }
      } else {
        const timeLeft = getTimeUntilExpiry();
        if (timeLeft > 0) {
          console.log(`[SessionMonitor] Session valid (${timeLeft} minutes remaining)`);
        }
      }
    };

    // Initial check
    checkSession();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkSession, checkInterval);

    // Cleanup
    return () => {
      console.log("[SessionMonitor] Stopping session monitoring");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    enabled,
    checkInterval,
    refreshThreshold,
    onSessionExpired,
    onSessionRefreshed,
    onRefreshFailed,
  ]);

  return {
    isMonitoring: enabled,
  };
}

