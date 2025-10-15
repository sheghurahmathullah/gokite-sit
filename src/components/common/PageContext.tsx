"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [pages, setPages] = useState<Page[]>([]);
  const [pageIds, setPageIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt fetching pages; if unauthorized (401), retry with capped exponential backoff
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    let attempt = 0;
    const maxAttempts = 8; // ~ up to ~2 minutes with exponential backoff

    const tryFetch = async () => {
      try {
        await fetchPages();
      } catch (err: any) {
        const message = String(err && err.message ? err.message : err);
        if (message === "UNAUTHORIZED_401" && attempt < maxAttempts) {
          attempt += 1;
          setLoading(true);
          const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // 1s,2s,4s,... capped at 30s
          retryTimeout = setTimeout(tryFetch, delayMs);
        }
      }
    };
    tryFetch();
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cms/pages");

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("UNAUTHORIZED_401");
        }
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched pages:", data);

      setPages(data.data || []);

      // Create a mapping of page names/types to IDs
      const pageMapping: Record<string, string> = {};
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((page) => {
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
      if (message === "UNAUTHORIZED_401") {
        // Keep loading; caller effect will retry
        throw err;
      }
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

  const value = {
    pages,
    pageIds,
    loading,
    error,
    getPageId,
    getPageIdWithFallback,
    getPageInfo,
    getAvailablePageTypes,
    refetchPages: fetchPages,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
