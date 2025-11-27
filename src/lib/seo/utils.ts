/**
 * SEO Utility Functions
 * Helper functions for generating SEO-friendly titles and descriptions
 */

/**
 * Ensures title is descriptive and properly formatted
 * Format: "Page Name - GoKite | Description"
 * 
 * @param title - Base title from API or page
 * @param fallback - Fallback title if title is too short
 * @param siteName - Site name (default: "GoKite")
 * @returns Formatted descriptive title
 */
export function formatSEOTitle(
  title: string | undefined | null,
  fallback: string,
  siteName: string = "GoKite"
): string {
  // If no title provided, use fallback
  if (!title || title.trim().length === 0) {
    return fallback;
  }

  const trimmedTitle = title.trim();

  // If title already includes site name and is descriptive (>40 chars), use as-is
  if (trimmedTitle.includes(siteName) && trimmedTitle.length > 40) {
    return trimmedTitle;
  }

  // If title is too short (<30 chars), make it descriptive
  if (trimmedTitle.length < 30) {
    // Check if it's a common short title that needs expansion
    const shortTitleMap: Record<string, string> = {
      "Holiday": "Holiday Packages",
      "Holidays": "Holiday Packages",
      "Visa": "Visa Services",
      "Visas": "Visa Services",
      "Flight": "Flight Booking",
      "Flights": "Flight Booking",
      "Hotel": "Hotel Booking",
      "Hotels": "Hotel Booking",
      "Activity": "Activities & Experiences",
      "Activities": "Activities & Experiences",
      "GoKite": "GoKite - Book Your Entire Trip in One Place",
    };

    const expandedTitle = shortTitleMap[trimmedTitle] || trimmedTitle;
    
    // Format: "Page Name - GoKite | Description"
    return `${expandedTitle} - ${siteName} | ${getTitleSuffix(expandedTitle)}`;
  }

  // If title doesn't include site name, add it
  if (!trimmedTitle.includes(siteName)) {
    return `${trimmedTitle} - ${siteName}`;
  }

  return trimmedTitle;
}

/**
 * Get appropriate title suffix based on page type
 */
function getTitleSuffix(pageTitle: string): string {
  const lowerTitle = pageTitle.toLowerCase();
  
  if (lowerTitle.includes("holiday") || lowerTitle.includes("package")) {
    return "Book Your Dream Vacation";
  }
  if (lowerTitle.includes("visa")) {
    return "Apply for Visa Online";
  }
  if (lowerTitle.includes("flight")) {
    return "Book Cheap Flights Online";
  }
  if (lowerTitle.includes("hotel")) {
    return "Book Hotels Online at Best Prices";
  }
  if (lowerTitle.includes("activity") || lowerTitle.includes("experience")) {
    return "Book Exciting Travel Activities";
  }
  if (lowerTitle.includes("about")) {
    return "Your Trusted Travel Partner";
  }
  
  return "Book Your Entire Trip in One Place";
}

/**
 * Ensures description is SEO-friendly (between 120-160 characters)
 * 
 * @param description - Description from API or page
 * @param fallback - Fallback description
 * @returns Formatted description
 */
export function formatSEODescription(
  description: string | undefined | null,
  fallback: string
): string {
  if (!description || description.trim().length === 0) {
    return fallback;
  }

  const trimmed = description.trim();
  
  // If description is too short (<100 chars), enhance it
  if (trimmed.length < 100) {
    return `${trimmed} Book your entire trip in one place with GoKite.`;
  }
  
  // If description is too long (>160 chars), truncate it
  if (trimmed.length > 160) {
    return trimmed.substring(0, 157) + "...";
  }
  
  return trimmed;
}

/**
 * Validates SEO title length
 * Optimal: 50-60 characters
 * Maximum: 60 characters (for browser tabs)
 */
export function validateTitleLength(title: string): {
  isValid: boolean;
  length: number;
  recommendation?: string;
} {
  const length = title.length;
  
  if (length === 0) {
    return {
      isValid: false,
      length: 0,
      recommendation: "Title is required",
    };
  }
  
  if (length > 60) {
    return {
      isValid: false,
      length,
      recommendation: `Title is too long (${length} chars). Should be ≤60 characters for optimal display in browser tabs.`,
    };
  }
  
  if (length < 30) {
    return {
      isValid: true,
      length,
      recommendation: `Title is short (${length} chars). Consider making it more descriptive (30-60 chars optimal).`,
    };
  }
  
  return {
    isValid: true,
    length,
  };
}

