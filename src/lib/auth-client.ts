"use client";

const SESSION_USERNAME_KEY = "gokite.username";
const SESSION_TOKEN_ISSUED_AT_KEY = "gokite.tokenIssuedAt";
const SESSION_DURATION_KEY = "gokite.sessionDuration";

// Default token validity (fallback if sessionDuration not provided)
const DEFAULT_TOKEN_VALIDITY_MS = 60 * 60 * 1000; // 60 minutes
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SESSION_USERNAME_KEY);
  } catch {
    return null;
  }
}

export function setStoredUsername(username: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_USERNAME_KEY, username);
  } catch {}
}

export function getTokenIssuedAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_TOKEN_ISSUED_AT_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setTokenIssuedNow(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_TOKEN_ISSUED_AT_KEY, String(Date.now()));
  } catch {}
}

export function getStoredSessionDuration(): number | null {
  if (typeof window === "undefined") return null;
  try {
    // First try to get from sessionStorage (for backward compatibility)
    const sessionStorageValue = sessionStorage.getItem(SESSION_DURATION_KEY);
    if (sessionStorageValue) {
      return Number(sessionStorageValue);
    }
    
    // Then try to get from cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'sessionDuration') {
        const durationMs = Number(value) * 1000; // Convert seconds to milliseconds
        if (!isNaN(durationMs) && durationMs > 0) {
          return durationMs;
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export function setStoredSessionDuration(durationMs: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_DURATION_KEY, String(durationMs));
  } catch {}
}

function isNearExpiry(issuedAtMs: number | null): boolean {
  if (!issuedAtMs) return true; // unknown -> refresh to be safe
  const now = Date.now();
  const elapsed = now - issuedAtMs;
  const sessionDuration = getStoredSessionDuration() || DEFAULT_TOKEN_VALIDITY_MS;
  const remaining = sessionDuration - elapsed;
  return remaining <= REFRESH_THRESHOLD_MS;
}

let ongoingRefresh: Promise<void> | null = null;

async function refreshTokenIfNeededInternal(): Promise<void> {
  const username = getStoredUsername();
  if (!username) return; // nothing we can do

  const issuedAt = getTokenIssuedAt();
  if (!isNearExpiry(issuedAt)) return;

  // Call proxy to refresh cookies. Use a header to bypass our fetch wrapper.
  const res = await fetch("/api/auth/guest-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-skip-auth": "true",
    },
    body: JSON.stringify({ userName: username }),
    cache: "no-store",
  });

  if (!res.ok) {
    // Keep existing cookies; will try again on next call
    return;
  }

  // Extract sessionDuration from response headers
  const sessionDurationHeader = res.headers.get("x-session-duration");
  if (sessionDurationHeader) {
    const durationMs = Number(sessionDurationHeader) * 1000; // Convert seconds to milliseconds
    if (!isNaN(durationMs) && durationMs > 0) {
      setStoredSessionDuration(durationMs);
    }
  }

  // Also check if sessionDuration cookie was set and store it
  const sessionDurationFromCookie = getStoredSessionDuration();
  if (sessionDurationFromCookie) {
    setStoredSessionDuration(sessionDurationFromCookie);
  }

  // On success, mark new issue time
  setTokenIssuedNow();
}

export async function ensureFreshToken(): Promise<void> {
  if (ongoingRefresh) return ongoingRefresh;
  ongoingRefresh = refreshTokenIfNeededInternal()
    .catch(() => {})
    .finally(() => {
      ongoingRefresh = null;
    });
  return ongoingRefresh;
}

export const AuthClientStorage = {
  getStoredUsername,
  setStoredUsername,
  getTokenIssuedAt,
  setTokenIssuedNow,
  getStoredSessionDuration,
  setStoredSessionDuration,
};


