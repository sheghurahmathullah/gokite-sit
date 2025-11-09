/**
 * Route Utilities
 * Helper functions for nested routing
 */

/**
 * Get the current parent slug from the URL
 * Returns the page slug (e.g., "holiday-home-page", "visa-landing-page", "master-landing-page")
 */
export function getCurrentPageSlug(): string | null {
  if (typeof window === "undefined") return null;
  
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  
  // Check if we're on a known static page (not dynamic slug pages)
  const staticPages = ["holidays", "visa", "holiday-grid", "holiday-list", "sign-in", "terms"];
  if (segments.length > 0 && staticPages.includes(segments[0])) {
    return segments[0];
  }
  
  // Otherwise, assume first segment is the page slug
  return segments[0] || null;
}

/**
 * Get page slug from sessionStorage (cached from PageContext)
 */
export function getStoredPageSlug(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    return window.sessionStorage.getItem("currentPageSlug");
  } catch (e) {
    return null;
  }
}

/**
 * Store page slug in sessionStorage
 */
export function storePageSlug(slug: string): void {
  if (typeof window === "undefined") return;
  
  try {
    window.sessionStorage.setItem("currentPageSlug", slug);
  } catch (e) {
    console.error("Failed to store page slug:", e);
  }
}

/**
 * Build nested route path
 * @param parentSlug - The parent page slug (e.g., "holiday-home-page")
 * @param childPath - The child route path (e.g., "tour-details", "apply-visa")
 * @param params - Optional parameters for the child route
 */
export function buildNestedRoute(
  parentSlug: string | null,
  childPath: string,
  params?: string
): string {
  if (!parentSlug) {
    // Fallback to flat route if no parent slug
    return params ? `/${childPath}/${params}` : `/${childPath}`;
  }
  
  // Build nested route
  const basePath = `/${parentSlug}/${childPath}`;
  return params ? `${basePath}/${params}` : basePath;
}

/**
 * Get the appropriate tour-details route based on current page
 */
export function getTourDetailsRoute(tourSlug: string): string {
  const pageSlug = getStoredPageSlug() || getCurrentPageSlug();
  return buildNestedRoute(pageSlug, "tour-details", tourSlug);
}

/**
 * Get the appropriate apply-visa route based on current page
 */
export function getApplyVisaRoute(): string {
  const pageSlug = getStoredPageSlug() || getCurrentPageSlug();
  return buildNestedRoute(pageSlug, "apply-visa");
}

/**
 * Determine page type from slug
 */
export function getPageTypeFromSlug(slug: string | null): "landing" | "holidays" | "visa" | null {
  if (!slug) return null;
  
  if (slug.includes("landing")) return "landing";
  if (slug.includes("holiday")) return "holidays";
  if (slug.includes("visa")) return "visa";
  
  return null;
}

