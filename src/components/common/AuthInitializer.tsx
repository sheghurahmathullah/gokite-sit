"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ensureFreshToken, AuthClientStorage } from "@/lib/auth-client";

export default function AuthInitializer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Run once on mount and on route changes.
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we already have a username stored
      const existingUsername = AuthClientStorage.getStoredUsername();

      if (!existingUsername) {
        // Automatically login with the specified email
        try {
          const response = await fetch("/api/auth/guest-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: "codetezteam@gmail.com" }),
          });

          if (response.ok) {
            // Store username and token issue time in session storage
            AuthClientStorage.setStoredUsername("codetezteam@gmail.com");
            AuthClientStorage.setTokenIssuedNow();

            // Extract and store sessionDuration if available
            const sessionDurationHeader =
              response.headers.get("x-session-duration");
            if (sessionDurationHeader) {
              const durationMs = Number(sessionDurationHeader) * 1000; // Convert seconds to milliseconds
              if (!isNaN(durationMs) && durationMs > 0) {
                AuthClientStorage.setStoredSessionDuration(durationMs);
              }
            }

            // Also check if sessionDuration cookie was set and store it
            setTimeout(() => {
              const sessionDurationFromCookie =
                AuthClientStorage.getStoredSessionDuration();
              if (sessionDurationFromCookie) {
                AuthClientStorage.setStoredSessionDuration(
                  sessionDurationFromCookie
                );
              }
            }, 100); // Small delay to ensure cookies are set
          }
        } catch (error) {
          console.error("Failed to auto-login:", error);
        }
      }

      // Ensure token is fresh (this will handle both new and existing tokens)
      ensureFreshToken();
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}
