/**
 * Session Management Utility
 * Handles automatic session renewal and email storage
 */

// Hash email using simple base64 encoding (you can use more secure hashing if needed)
export function hashEmail(email: string): string {
  try {
    return btoa(email);
  } catch (error) {
    console.error("Failed to hash email:", error);
    return "";
  }
}

// Unhash email
export function unhashEmail(hashedEmail: string): string {
  try {
    return atob(hashedEmail);
  } catch (error) {
    console.error("Failed to unhash email:", error);
    return "";
  }
}

// Store user email in sessionStorage (hashed)
export function storeUserEmail(email: string): void {
  try {
    const hashed = hashEmail(email);
    sessionStorage.setItem("userEmail", hashed);
    console.log("[SessionManager] Email stored successfully");
  } catch (error) {
    console.error("[SessionManager] Failed to store email:", error);
  }
}

// Retrieve user email from sessionStorage (unhashed)
export function getUserEmail(): string | null {
  try {
    const hashed = sessionStorage.getItem("userEmail");
    if (!hashed) return null;
    return unhashEmail(hashed);
  } catch (error) {
    console.error("[SessionManager] Failed to retrieve email:", error);
    return null;
  }
}

// Store session duration and expiry time
export function storeSessionDuration(sessionDuration: number): void {
  try {
    const now = Date.now();
    const expiryTime = now + sessionDuration * 1000; // Convert to milliseconds
    
    sessionStorage.setItem("sessionDuration", sessionDuration.toString());
    sessionStorage.setItem("sessionExpiry", expiryTime.toString());
    
    console.log("[SessionManager] Session duration stored:", {
      duration: sessionDuration,
      expiresAt: new Date(expiryTime).toISOString(),
    });
  } catch (error) {
    console.error("[SessionManager] Failed to store session duration:", error);
  }
}

// Get session expiry time
export function getSessionExpiry(): number | null {
  try {
    const expiry = sessionStorage.getItem("sessionExpiry");
    return expiry ? parseInt(expiry, 10) : null;
  } catch (error) {
    console.error("[SessionManager] Failed to get session expiry:", error);
    return null;
  }
}

// Check if session is about to expire (within threshold)
export function isSessionExpiring(thresholdMinutes: number = 5): boolean {
  try {
    const expiry = getSessionExpiry();
    if (!expiry) return false;
    
    const now = Date.now();
    const timeUntilExpiry = expiry - now;
    const thresholdMs = thresholdMinutes * 60 * 1000;
    
    return timeUntilExpiry <= thresholdMs && timeUntilExpiry > 0;
  } catch (error) {
    console.error("[SessionManager] Failed to check session expiry:", error);
    return false;
  }
}

// Check if session has expired
export function isSessionExpired(): boolean {
  try {
    const expiry = getSessionExpiry();
    if (!expiry) return false;
    
    const now = Date.now();
    return now >= expiry;
  } catch (error) {
    console.error("[SessionManager] Failed to check if session expired:", error);
    return false;
  }
}

// Clear session data
export function clearSessionData(): void {
  try {
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("sessionDuration");
    sessionStorage.removeItem("sessionExpiry");
    console.log("[SessionManager] Session data cleared");
  } catch (error) {
    console.error("[SessionManager] Failed to clear session data:", error);
  }
}

// Refresh session using stored email
export async function refreshSession(): Promise<boolean> {
  try {
    const email = getUserEmail();
    if (!email) {
      console.error("[SessionManager] No stored email found for refresh");
      return false;
    }

    console.log("[SessionManager] Attempting to refresh session...");

    const response = await fetch("/api/auth/guest-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: email }),
    });

    if (!response.ok) {
      console.error("[SessionManager] Session refresh failed:", response.status);
      return false;
    }

    const data = await response.json();
    console.log("[SessionManager] Session refresh response:", data);

    // Extract and store session duration from response
    if (data.data?.sessionDuration) {
      storeSessionDuration(data.data.sessionDuration);
    }

    console.log("[SessionManager] Session refreshed successfully");
    return true;
  } catch (error) {
    console.error("[SessionManager] Failed to refresh session:", error);
    return false;
  }
}

// Get time until session expires (in minutes)
export function getTimeUntilExpiry(): number {
  try {
    const expiry = getSessionExpiry();
    if (!expiry) return 0;
    
    const now = Date.now();
    const timeUntilExpiry = expiry - now;
    
    return Math.max(0, Math.floor(timeUntilExpiry / (60 * 1000)));
  } catch (error) {
    console.error("[SessionManager] Failed to get time until expiry:", error);
    return 0;
  }
}

