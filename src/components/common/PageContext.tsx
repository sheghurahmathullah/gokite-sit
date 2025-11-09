"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionMonitor } from "@/hooks/useSessionMonitor";
import { toast } from "react-toastify";

// Define types for better type safety
interface Page {
  id: string;
  title?: string;
  slug?: string;
  [key: string]: any;
}

interface PageContextType {
  pages: Page[];
  pageIds: Record<string, string>;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initialAuthCheckDone: boolean;
  getPageId: (pageType: string) => string | null;
  getPageIdWithFallback: (
    pageType: string,
    fallbackId?: string | null
  ) => string | null;
  getPageInfo: (pageType: string) => Page | null;
  getAvailablePageTypes: () => string[];
  refetchPages: () => Promise<void>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};

interface PageProviderProps {
  children: React.ReactNode;
}

export const PageProvider: React.FC<PageProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [pageIds, setPageIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const isAuthenticatedRef = useRef(false); // Ref to track auth status for event handlers
  const hasFetchedRef = useRef(false); // Ref to prevent duplicate fetches
  const sessionRefreshedRef = useRef(false); // Track if we've already shown refresh notification

  // Sync ref with state
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Sign-in page is now disabled (auto-authentication is used)
  const isSignInPage = false;

  // Session monitoring - only when authenticated
  useSessionMonitor({
    enabled: isAuthenticated && !isSignInPage,
    checkInterval: 60000, // Check every minute
    refreshThreshold: 5, // Refresh 5 minutes before expiry
    onSessionExpired: () => {
      console.log("[PageContext] Session expired, redirecting to sign-in");
      setIsAuthenticated(false);
      setPages([]);
      setPageIds({});
      
      // Show notification
      if (typeof window !== "undefined") {
        toast.info("Your session has expired. Please sign in again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
      
      // Auto-authenticate instead of redirecting to sign-in
      console.log("[PageContext] Session expired - auto-authenticating...");
      // The auto-authentication will happen automatically on next API call
    },
    onSessionRefreshed: () => {
      console.log("[PageContext] Session refreshed automatically");
      
      // Show notification only once per session refresh
      if (!sessionRefreshedRef.current && typeof window !== "undefined") {
        toast.success("Session renewed automatically", {
          position: "top-right",
          autoClose: 3000,
        });
        sessionRefreshedRef.current = true;
        
        // Reset the flag after 5 minutes
        setTimeout(() => {
          sessionRefreshedRef.current = false;
        }, 5 * 60 * 1000);
      }
      
      // Add a small delay before refetching to ensure cookie is updated
      setTimeout(() => {
        console.log("[PageContext] Refetching pages after session refresh");
        hasFetchedRef.current = false;
        fetchPages(true); // Pass true to indicate this is after a refresh
      }, 500); // 500ms delay to allow cookie to be set
    },
    onRefreshFailed: () => {
      console.error("[PageContext] Session refresh failed");
      
      // Show warning but don't force logout immediately
      if (typeof window !== "undefined") {
        toast.warning("Unable to refresh session. Please sign in again soon.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    },
  });

  // Auto-authenticate with hardcoded email if no token
  const autoAuthenticate = async () => {
    try {
      console.log("[PageContext] Auto-authenticating with hardcoded email...");
      
      const response = await fetch("/api/auth/guest-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: "codetezteam@gmail.com" }),
      });

      if (!response.ok) {
        console.error("[PageContext] Auto-authentication failed:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("[PageContext] Auto-authentication successful");
      
      // Store email and session duration
      const { storeUserEmail, storeSessionDuration } = await import("@/lib/sessionManager");
      storeUserEmail("codetezteam@gmail.com");
      
      if (data.data?.sessionDuration) {
        storeSessionDuration(data.data.sessionDuration);
      }
      
      return true;
    } catch (error) {
      console.error("[PageContext] Auto-authentication error:", error);
      return false;
    }
  };

  // Check authentication status and fetch pages
  useEffect(() => {
    let mounted = true;

    const checkAuthAndFetch = async () => {
      console.log("[PageContext] checkAuthAndFetch called, hasFetched:", hasFetchedRef.current, "isSignInPage:", isSignInPage);
      
      // Skip API call if on sign-in page
      if (isSignInPage) {
        console.log("[PageContext] On sign-in page - skipping API call");
        if (mounted) {
          setLoading(false);
          setInitialAuthCheckDone(true);
        }
        return;
      }
      
      // If already fetched successfully, skip
      if (hasFetchedRef.current) {
        console.log("[PageContext] Skipping - pages already fetched");
        return;
      }
      
      try {
        // Mark as attempting to fetch
        hasFetchedRef.current = true;
        
        // Just try to fetch pages - if it works, user is authenticated
        const result = await fetchPages();
        
        // Check if result indicates unauthorized
        if (result && (result as any).unauthorized) {
          console.log("[PageContext] 401 on initial load - attempting auto-authentication...");
          
          // Try auto-authentication with hardcoded email
          const authSuccess = await autoAuthenticate();
          
          if (authSuccess && mounted) {
            console.log("[PageContext] Auto-authentication successful, retrying fetch");
            // Wait for cookie to be set
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Retry fetching pages
            hasFetchedRef.current = false;
            const retryResult = await fetchPages();
            
            if (retryResult && (retryResult as any).unauthorized) {
              // Still unauthorized after auto-auth
              console.error("[PageContext] Still unauthorized after auto-authentication");
              setIsAuthenticated(false);
              setInitialAuthCheckDone(true);
              setPages([]);
              setPageIds({});
            } else {
              // Success!
              console.log("[PageContext] Successfully authenticated after auto-auth");
              setIsAuthenticated(true);
              setInitialAuthCheckDone(true);
            }
          } else {
            // Auto-auth failed
            console.error("[PageContext] Auto-authentication failed");
            if (mounted) {
              setIsAuthenticated(false);
              setInitialAuthCheckDone(true);
              setPages([]);
              setPageIds({});
            }
          }
          
          // Reset flag so we can retry later
          hasFetchedRef.current = false;
        } else if (mounted) {
          console.log("[PageContext] Setting authenticated to true");
          setIsAuthenticated(true);
          setInitialAuthCheckDone(true);
        }
      } catch (err: any) {
        // Reset flag on error so we can retry
        hasFetchedRef.current = false;
        
        if (mounted) {
          // Only log unexpected errors
          if (err?.message !== "UNAUTHORIZED_401") {
            console.error("[PageContext] Unexpected error during auth check:", err);
          } else {
            console.log("[PageContext] User not authenticated (expected)");
          }
          
          setIsAuthenticated(false);
          setInitialAuthCheckDone(true);
          setLoading(false);
          setPages([]);
          setPageIds({});
        }
      }
    };

    // Initial check
    console.log("[PageContext] Initial mount - calling checkAuthAndFetch");
    checkAuthAndFetch();

    // Also check when window gains focus (user returns from another tab/window)
    const handleFocus = () => {
      console.log("[PageContext] Window focused, isAuthenticated:", isAuthenticatedRef.current, "hasFetched:", hasFetchedRef.current, "isSignInPage:", isSignInPage);
      // Skip if on sign-in page
      if (isSignInPage) {
        console.log("[PageContext] On sign-in page - skipping focus recheck");
        return;
      }
      // Only recheck if not authenticated AND haven't successfully fetched yet
      // This is for sign-in detection, not for regular navigation
      if (!isAuthenticatedRef.current && !hasFetchedRef.current) {
        console.log("[PageContext] Not authenticated and not fetched, rechecking...");
        setInitialAuthCheckDone(false);
        checkAuthAndFetch();
      } else {
        console.log("[PageContext] Already authenticated or fetched, skipping focus recheck");
      }
    };

    // Check when page becomes visible (useful for tab switching)
    const handleVisibilityChange = () => {
      console.log("[PageContext] Visibility changed, state:", document.visibilityState, "isAuthenticated:", isAuthenticatedRef.current, "hasFetched:", hasFetchedRef.current, "isSignInPage:", isSignInPage);
      // Skip if on sign-in page
      if (isSignInPage) {
        console.log("[PageContext] On sign-in page - skipping visibility recheck");
        return;
      }
      // Only recheck if page is visible, not authenticated, AND haven't successfully fetched yet
      // This is for sign-in detection, not for regular navigation
      if (document.visibilityState === 'visible' && !isAuthenticatedRef.current && !hasFetchedRef.current) {
        console.log("[PageContext] Page visible, not authenticated and not fetched, rechecking...");
        setInitialAuthCheckDone(false);
        checkAuthAndFetch();
      } else {
        console.log("[PageContext] Already authenticated or fetched, skipping visibility recheck");
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSignInPage]); // Re-run when pathname changes (sign-in -> other page)

  // Helper function to update page mapping
  const updatePageMapping = (pagesData: Page[]) => {
    const pageMapping: Record<string, string> = {};
    if (pagesData && Array.isArray(pagesData)) {
      pagesData.forEach((page: Page) => {
        // Map based on title and slug from the actual API response
        const pageTitle = page.title?.toLowerCase() || "";
        const pageSlug = page.slug?.toLowerCase() || "";

        // Map specific pages based on actual API response
        if (
          pageTitle.includes("landing page") &&
          !pageTitle.includes("visa")
        ) {
          pageMapping.landing = page.id;
        } else if (
          pageTitle.includes("visa landing page") ||
          pageSlug.includes("visa-landing")
        ) {
          pageMapping.visa = page.id;
          pageMapping.visaLanding = page.id;
        } else if (
          pageTitle.includes("holiday home page") ||
          pageSlug.includes("holiday-home")
        ) {
          pageMapping.holidays = page.id;
          pageMapping.holidayHome = page.id;
        } else if (
          pageTitle.includes("dubai") ||
          pageSlug.includes("dubai")
        ) {
          pageMapping.dubai = page.id;
          pageMapping.dubaiHolidays = page.id;
        }

        // Also store by exact title and slug for flexibility
        pageMapping[pageTitle.replace(/\s+/g, "")] = page.id; // Remove spaces
        pageMapping[pageSlug] = page.id;

        // Store by ID as well for direct access
        pageMapping[`id_${page.id}`] = page.id;
      });
    }

    setPageIds(pageMapping);
    console.log("Page ID mapping:", pageMapping);
    console.log(
      "Available page types:",
      Object.keys(pageMapping).filter((key) => !key.startsWith("id_"))
    );
  };

  const fetchPages = async (isRefetchAfterRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log("[PageContext] Fetching /api/cms/pages", isRefetchAfterRefresh ? "(after session refresh)" : "");
      const response = await fetch("/api/cms/pages", {
        cache: "no-store", // Don't cache to get fresh data with new token
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User is no longer authenticated
          console.log("[PageContext] 401 Response - user not authenticated");
          // Only set isAuthenticated to false if this is not a refetch after refresh
          // Give the session refresh some grace time
          if (!isRefetchAfterRefresh) {
            setIsAuthenticated(false);
            setLoading(false);
            // Return a special object instead of throwing to indicate auth failure
            return { unauthorized: true };
          } else {
            console.log("[PageContext] 401 during refetch after refresh - retrying in 1s");
            // Retry once more after a delay
            setTimeout(async () => {
              try {
                const retryResponse = await fetch("/api/cms/pages", { cache: "no-store" });
                if (retryResponse.ok) {
                  const data = await retryResponse.json();
                  setPages(data.data || []);
                  updatePageMapping(data.data);
                  setIsAuthenticated(true);
                  console.log("[PageContext] Retry successful after session refresh");
                } else {
                  console.error("[PageContext] Retry failed, setting authenticated to false");
                  setIsAuthenticated(false);
                }
              } catch (err) {
                console.error("[PageContext] Retry error:", err);
                setIsAuthenticated(false);
              } finally {
                setLoading(false);
              }
            }, 1000);
            return; // Exit early, retry will handle the rest
          }
        }
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      const data = await response.json();
      console.log("[PageContext] Successfully fetched pages:", data);

      setPages(data.data || []);
      updatePageMapping(data.data);
    } catch (err: any) {
      // Don't log error for expected auth failures
      if (err?.message !== "UNAUTHORIZED_401") {
        console.error("[PageContext] Error fetching pages:", err);
        const message = String(err && err.message ? err.message : err);
        setError(message);
      } else {
        console.log("[PageContext] User not authenticated (expected during initial check)");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get page ID by page type
  const getPageId = (pageType: string) => {
    return pageIds[pageType] || null;
  };

  // Helper function to get page ID with fallback
  const getPageIdWithFallback = (
    pageType: string,
    fallbackId: string | null = null
  ) => {
    return pageIds[pageType] || fallbackId;
  };

  // Helper function to get full page information by type
  const getPageInfo = (pageType: string) => {
    const pageId = pageIds[pageType];
    if (!pageId) return null;

    return pages.find((page) => page.id === pageId) || null;
  };

  // Helper function to get all available page types
  const getAvailablePageTypes = () => {
    return Object.keys(pageIds).filter((key) => !key.startsWith("id_"));
  };

  // Wrapper for manual refetch - resets the flag to allow refetching
  const refetchPages = async () => {
    console.log("[PageContext] Manual refetch requested");
    hasFetchedRef.current = false;
    await fetchPages();
    hasFetchedRef.current = true;
  };

  const value = {
    pages,
    pageIds,
    loading,
    error,
    isAuthenticated,
    initialAuthCheckDone,
    getPageId,
    getPageIdWithFallback,
    getPageInfo,
    getAvailablePageTypes,
    refetchPages,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
