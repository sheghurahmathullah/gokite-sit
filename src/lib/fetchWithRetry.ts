/**
 * Fetch Wrapper with Automatic Retry Logic
 * Handles 401 and 400 errors by refreshing session and retrying
 */

import { refreshSession } from "./sessionManager";

interface FetchWithRetryOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number;
}

// Store the native fetch in a global variable that survives HMR/hot reloads
// This ensures we always have access to the real native fetch
declare global {
  interface Window {
    __NATIVE_FETCH__?: typeof fetch;
    __FETCH_RETRY_INITIALIZED__?: boolean;
  }
}

// Get the native fetch - either from our global storage or capture it now
function getNativeFetch(): typeof fetch {
  if (typeof window === 'undefined') {
    return fetch;
  }
  
  // If we've already stored the native fetch, use it
  if (window.__NATIVE_FETCH__) {
    return window.__NATIVE_FETCH__;
  }
  
  // Otherwise, capture it now (should only happen on first load)
  // Make absolutely sure we're getting the REAL native fetch
  const currentFetch = window.fetch;
  
  // Check if current fetch has our marker - if so, it's already wrapped
  if ((currentFetch as any).__fetchWithRetryWrapper) {
    console.error('[fetchWithRetry] window.fetch is already wrapped! Using fallback.');
    // Last resort: use the global fetch from the global scope
    window.__NATIVE_FETCH__ = fetch;
    return fetch;
  }
  
  // Store and return the native fetch
  window.__NATIVE_FETCH__ = currentFetch.bind(window);
  return window.__NATIVE_FETCH__;
}

// Get reference to the native fetch
const nativeFetch = getNativeFetch();

/**
 * Enhanced fetch that automatically retries on 401/400 errors
 * @param url - The URL to fetch
 * @param options - Fetch options with additional retry configuration
 * @returns Promise<Response>
 */
export async function fetchWithRetry(
  url: string | URL | Request,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const { maxRetries = 3, retryDelay = 500, ...fetchOptions } = options;
  
  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`[fetchWithRetry] Attempt ${attempt + 1}/${maxRetries} for ${url}`);
      
      // Use the native fetch to avoid infinite recursion
      const response = await nativeFetch(url, fetchOptions);
      
      // If successful, return immediately
      if (response.ok) {
        console.log(`[fetchWithRetry] Success on attempt ${attempt + 1} for ${url}`);
        return response;
      }
      
      // Check if we should retry based on status code
      const shouldRetry = response.status === 401 || response.status === 400;
      
      if (shouldRetry && attempt < maxRetries - 1) {
        console.log(
          `[fetchWithRetry] Got ${response.status} error on attempt ${attempt + 1}, refreshing session and retrying...`
        );
        
        // Store the failed response
        lastResponse = response;
        
        // Refresh the session to get a new access token
        const refreshed = await refreshSession();
        
        if (refreshed) {
          console.log(`[fetchWithRetry] Session refreshed successfully, waiting ${retryDelay}ms before retry`);
          // Wait before retrying to allow cookie to be set
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue; // Retry the request
        } else {
          console.error(`[fetchWithRetry] Session refresh failed on attempt ${attempt + 1}`);
          // Even if refresh failed, we'll try again in case the cookie was already set
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      
      // If we shouldn't retry or it's the last attempt, return the response
      console.log(
        `[fetchWithRetry] ${shouldRetry ? 'Final attempt' : 'Non-retryable status'} ${response.status} for ${url}`
      );
      return response;
      
    } catch (error) {
      console.error(`[fetchWithRetry] Network error on attempt ${attempt + 1}:`, error);
      lastError = error as Error;
      
      // On network error, retry if not the last attempt
      if (attempt < maxRetries - 1) {
        console.log(`[fetchWithRetry] Retrying after network error, waiting ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
    }
  }
  
  // If we exhausted all retries and have a response, return it
  if (lastResponse) {
    console.error(`[fetchWithRetry] All ${maxRetries} attempts failed, returning last response`);
    return lastResponse;
  }
  
  // If we have a network error and no response, throw it
  if (lastError) {
    console.error(`[fetchWithRetry] All ${maxRetries} attempts failed with network error`);
    throw lastError;
  }
  
  // This shouldn't happen, but just in case
  throw new Error(`[fetchWithRetry] Failed to fetch ${url} after ${maxRetries} attempts`);
}

/**
 * Check if a URL is an internal API route
 */
function isInternalApiRoute(input: string | URL | Request): boolean {
  try {
    const url = typeof input === 'string' 
      ? input 
      : input instanceof Request 
        ? input.url 
        : input.toString();
    
    // Check for relative paths starting with /api
    if (url.startsWith('/api/') || url.startsWith('/api')) {
      return true;
    }
    
    // Check for absolute URLs that are same origin and point to /api
    if (typeof window !== 'undefined' && (url.startsWith('http://') || url.startsWith('https://'))) {
      const urlObj = new URL(url);
      const currentOrigin = window.location.origin;
      return urlObj.origin === currentOrigin && urlObj.pathname.startsWith('/api');
    }
    
    return false;
  } catch (e) {
    // If URL parsing fails, don't apply retry
    return false;
  }
}

/**
 * Patches the global fetch function to use fetchWithRetry
 * Call this once at app initialization
 */
export function enableGlobalFetchRetry() {
  if (typeof window === 'undefined') {
    console.warn('[fetchWithRetry] Cannot enable on server side');
    return;
  }
  
  // Use global flag to prevent multiple initializations across HMR
  if (window.__FETCH_RETRY_INITIALIZED__) {
    console.log('[fetchWithRetry] Already initialized (global flag set), skipping');
    return;
  }
  
  // Make sure we have the native fetch stored
  if (!window.__NATIVE_FETCH__) {
    window.__NATIVE_FETCH__ = getNativeFetch();
  }
  
  // Override window.fetch with a marked function
  const wrappedFetch = function(
    input: string | URL | Request,
    init?: RequestInit
  ): Promise<Response> {
    // Only apply retry logic to internal API routes
    if (isInternalApiRoute(input)) {
      return fetchWithRetry(input, init);
    }
    
    // For external URLs, use native fetch from global storage
    return window.__NATIVE_FETCH__!(input, init);
  } as typeof fetch;
  
  // Add a marker to identify our wrapped fetch
  (wrappedFetch as any).__fetchWithRetryWrapper = true;
  
  window.fetch = wrappedFetch;
  window.__FETCH_RETRY_INITIALIZED__ = true;
  
  console.log('[fetchWithRetry] Global fetch retry enabled for internal API routes');
  console.log('[fetchWithRetry] Native fetch stored at window.__NATIVE_FETCH__');
}

