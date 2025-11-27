// SEO Configuration
// Update these values based on your actual domain and country settings

export const SEO_CONFIG = {
  // Base domain - update this to your actual domain
  baseDomain: process.env.NEXT_PUBLIC_BASE_URL || "https://www.gokite.com",
  
  // Country-specific domains (for hreflang)
  countryDomains: {
    "en-ae": process.env.NEXT_PUBLIC_UAE_URL || "https://uae.gokite.com",
    "en-in": process.env.NEXT_PUBLIC_INDIA_URL || "https://india.gokite.com",
    "en-om": process.env.NEXT_PUBLIC_OMAN_URL || "https://oman.gokite.com",
  },
  
  // Default site name
  siteName: "GoKite",
  
  // Default Twitter handle
  twitterHandle: "@gokite",
  
  // Default geo settings (UAE - update as needed)
  defaultGeo: {
    region: "AE",
    placename: "Dubai, Abu Dhabi, Sharjah",
    position: "25.276987;55.296249",
    icbm: "25.276987, 55.296249",
  },
  
  // Default Open Graph image (1200x630px)
  defaultOgImage: "/images/og-default.jpg",
  
  // Local Business locations
  localBusiness: {
    uae: {
      name: "GoKite UAE",
      address: {
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      geo: {
        latitude: 25.276987,
        longitude: 55.296249,
      },
    },
    india: {
      name: "GoKite India",
      address: {
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      geo: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
    oman: {
      name: "GoKite Oman",
      address: {
        addressLocality: "Muscat",
        addressRegion: "Muscat",
        addressCountry: "OM",
      },
      geo: {
        latitude: 23.5859,
        longitude: 58.4059,
      },
    },
  },
};

// Helper function to get full URL
export function getFullUrl(path: string, baseDomain?: string): string {
  const base = baseDomain || SEO_CONFIG.baseDomain;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

// Helper function to get canonical URL
export function getCanonicalUrl(path: string): string {
  return getFullUrl(path);
}

