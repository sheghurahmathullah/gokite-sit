"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
  const [pages, setPages] = useState<Page[]>([]);
  const [pageIds, setPageIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const isAuthenticatedRef = useRef(false); // Ref to track auth status for event handlers
  const hasFetchedRef = useRef(false); // Ref to prevent duplicate fetches

  // Sync ref with state
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Check if current page is sign-in page
  const isSignInPage = pathname === "/sign-in";

  // Check authentication status and fetch pages only if authenticated
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
        await fetchPages();
        if (mounted) {
          console.log("[PageContext] Setting authenticated to true");
          setIsAuthenticated(true);
          setInitialAuthCheckDone(true);
        }
      } catch (err) {
        // Reset flag on error so we can retry
        hasFetchedRef.current = false;
        
        if (mounted) {
          // Fetch failed, user is not authenticated
          console.log("[PageContext] Setting authenticated to false");
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

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[PageContext] Fetching /api/cms/pages");
      const response = await fetch("/api/cms/pages");

      if (!response.ok) {
        if (response.status === 401) {
          // User is no longer authenticated
          console.log("[PageContext] Unauthorized - user not authenticated");
          setIsAuthenticated(false);
          throw new Error("UNAUTHORIZED_401");
        }
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      const data = await response.json();
      console.log("[PageContext] Successfully fetched pages:", data);

      setPages(data.data || []);

      // Create a mapping of page names/types to IDs
      const pageMapping: Record<string, string> = {};
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((page: Page) => {
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
    } catch (err: any) {
      console.error("Error fetching pages:", err);
      const message = String(err && err.message ? err.message : err);
      setError(message);
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
