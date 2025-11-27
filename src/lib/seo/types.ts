export interface GeoMeta {
  region: string; // e.g., "AE"
  placename: string; // e.g., "Dubai, Abu Dhabi, Sharjah"
  position: string; // e.g., "25.276987;55.296249"
  icbm: string; // e.g., "25.276987, 55.296249"
}

export interface HreflangLink {
  href: string;
  hreflang: string; // e.g., "en-ae", "en-in", "en-om"
}

export interface OpenGraphMeta {
  title: string;
  description: string;
  image: string; // 1200x630px recommended
  url: string;
  type?: "website" | "article" | "product" | "profile";
  siteName?: string;
  locale?: string;
}

export interface TwitterCardMeta {
  card?: "summary" | "summary_large_image" | "app" | "player";
  title: string;
  description: string;
  image: string;
  site?: string;
  creator?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductOffer {
  price: string;
  priceCurrency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
  validFrom?: string;
  validThrough?: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  image?: string | string[];
  brand?: string;
  offers?: ProductOffer;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  publisher?: {
    name: string;
    logo?: string;
  };
}

export interface LocalBusinessSchema {
  name: string;
  image?: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  url?: string;
  priceRange?: string;
  openingHours?: string[];
}

export interface SEOProps {
  // Basic Meta Data
  title: string;
  description: string;
  keywords?: string | string[];
  pageName?: string;
  
  // Robots
  robots?: string; // e.g., "index, follow" or "noindex, nofollow"
  
  // Canonical URL
  canonical?: string;
  
  // Geo Meta Tags
  geo?: GeoMeta;
  
  // Hreflang Tags
  hreflang?: HreflangLink[];
  
  // Open Graph
  openGraph?: OpenGraphMeta;
  
  // Twitter Cards
  twitter?: TwitterCardMeta;
  
  // Schema Markup
  schema?: {
    product?: ProductSchema;
    offer?: ProductOffer;
    breadcrumb?: BreadcrumbItem[];
    faq?: FAQItem[];
    article?: ArticleSchema;
    localBusiness?: LocalBusinessSchema;
  };
  
  // Additional meta tags
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

