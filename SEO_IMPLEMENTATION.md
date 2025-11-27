# SEO Implementation Guide

This document outlines the comprehensive on-page SEO implementation for the GoKite Next.js application using `react-helmet-async`.

## Overview

All pages now include comprehensive SEO metadata including:
- Basic Meta Tags (Title, Description, Keywords)
- Robots Meta Tags
- Canonical URLs
- Geo Meta Tags
- Hreflang Tags (Multi-country support)
- Open Graph Tags
- Twitter Card Tags
- Schema Markup (JSON-LD)

## File Structure

```
src/
├── components/
│   └── seo/
│       ├── SEOHead.tsx          # Main SEO component
│       └── HelmetProvider.tsx   # HelmetProvider wrapper
├── lib/
│   └── seo/
│       ├── types.ts             # TypeScript interfaces
│       ├── config.ts            # SEO configuration
│       └── schema.ts            # Schema markup generators
└── app/
    └── layout.tsx                # Root layout with HelmetProvider
```

## Configuration

### Update Domain Settings

Edit `src/lib/seo/config.ts` to update:
- `baseDomain`: Your main domain (default: "https://www.gokite.com")
- `countryDomains`: Country-specific domains for hreflang
- `defaultGeo`: Default geo-location settings
- `localBusiness`: Local business schema data for each office location

### Environment Variables

Set these environment variables in your `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://www.gokite.com
NEXT_PUBLIC_UAE_URL=https://uae.gokite.com
NEXT_PUBLIC_INDIA_URL=https://india.gokite.com
NEXT_PUBLIC_OMAN_URL=https://oman.gokite.com
```

## Usage

### Basic Usage

```tsx
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG, getCanonicalUrl } from "@/lib/seo/config";

export default function MyPage() {
  return (
    <>
      <SEOHead
        title="Page Title - GoKite"
        description="Page description for SEO"
        keywords={["keyword1", "keyword2"]}
        canonical="/page-slug"
      />
      {/* Your page content */}
    </>
  );
}
```

### Advanced Usage with Schema

```tsx
<SEOHead
  title="Tour Package Name - GoKite"
  description="Tour description"
  keywords={["tour", "package", "holiday"]}
  canonical="/tour-slug"
  openGraph={{
    title: "Tour Package Name",
    description: "Tour description",
    image: "/images/tour-image.jpg",
    url: "https://www.gokite.com/tour-slug",
    type: "product",
  }}
  schema={{
    product: {
      name: "Tour Package Name",
      description: "Tour description",
      image: "/images/tour-image.jpg",
      brand: "GoKite",
      offers: {
        price: "5000",
        priceCurrency: "AED",
        availability: "InStock",
        url: "https://www.gokite.com/tour-slug",
      },
    },
    breadcrumb: [
      { name: "Home", url: "https://www.gokite.com" },
      { name: "Tours", url: "https://www.gokite.com/tours" },
      { name: "Tour Name", url: "https://www.gokite.com/tour-slug" },
    ],
    faq: [
      { question: "Question 1?", answer: "Answer 1" },
      { question: "Question 2?", answer: "Answer 2" },
    ],
  }}
/>
```

## Implemented Pages

### Static Pages
- ✅ `/about-us` - About Us page
- ✅ `/activities` - Activities page
- ✅ `/flights` - Flights page
- ✅ `/hotels` - Hotels page
- ✅ `/more` - More services page
- ✅ `/privacy-policy` - Privacy Policy page
- ✅ `/terms` - Terms & Conditions page

### Dynamic Pages
- ✅ `/[slug]` - Main dynamic page router
- ✅ `/[slug]/home` - Landing page
- ✅ `/[slug]/visa` - Visa landing page
- ✅ `/[slug]/holidays` - Holidays page
- ✅ `/[slug]/apply-visa` - Apply Visa page
- ✅ `/[slug]/holiday-grid` - Holiday grid page
- ✅ `/[slug]/holiday-list` - Holiday list page
- ✅ `/[slug]/tour-details/[tourSlug]` - Tour details page (with Product + Offer + Breadcrumb + FAQ schema)

## Schema Types Implemented

1. **Product Schema** - For tour packages
2. **Offer Schema** - For pricing information
3. **Breadcrumb Schema** - For navigation structure
4. **FAQPage Schema** - For FAQ sections
5. **Article Schema** - For blog posts (ready to use)
6. **LocalBusiness Schema** - For office locations (configured in config.ts)

## Features

### 1. Basic Meta Data
- Meta Title
- Meta Description
- Meta Keywords
- Page Name

### 2. Robots Meta Tag
- Default: `index, follow`
- Configurable per page

### 3. Canonical Tags
- Automatically generated from page path
- Supports custom canonical URLs

### 4. Geo Meta Tags
- `geo.region` (e.g., "AE")
- `geo.placename` (e.g., "Dubai, Abu Dhabi, Sharjah")
- `geo.position` (latitude;longitude)
- `ICBM` (latitude, longitude)

### 5. Hreflang Tags
- Supports multi-country websites
- Configured for: en-ae, en-in, en-om
- Automatically added to all pages

### 6. Open Graph Tags
- og:title
- og:description
- og:image (1200x630px recommended)
- og:url
- og:type
- og:site_name
- og:locale

### 7. Twitter Card Tags
- twitter:card (summary_large_image)
- twitter:title
- twitter:description
- twitter:image
- twitter:site
- twitter:creator

### 8. Schema Markup (JSON-LD)
- Product schema for tour packages
- Offer schema for pricing
- Breadcrumb schema for navigation
- FAQPage schema for FAQs
- Article schema (ready for blogs)
- LocalBusiness schema (configured)

## Image SEO Recommendations

1. **Use WebP format** for better compression
2. **Optimize images** before uploading (recommended size: 1200x630px for OG images)
3. **Add alt text** with keywords and geo relevance
4. **Ensure Open Graph images** are set (1200x630px)

## Next Steps

1. **Update Configuration**: Edit `src/lib/seo/config.ts` with your actual domain and geo-location data
2. **Add Open Graph Images**: Create optimized OG images (1200x630px) for each page type
3. **XML Sitemaps**: Implement XML sitemaps per country website (recommended)
4. **Breadcrumb Navigation**: Ensure breadcrumb navigation is visible on pages
5. **Mobile Optimization**: Verify all pages are mobile-optimized
6. **301 Redirects**: Add redirects for any moved pages

## Testing

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Schema Markup Validator**: https://validator.schema.org/

## Notes

- All SEO metadata is managed through the `SEOHead` component
- Schema markup is automatically generated as JSON-LD
- Hreflang tags are automatically added based on country domains in config
- Geo tags use default UAE location - update in config.ts for other regions
- Canonical URLs are automatically generated from page paths

