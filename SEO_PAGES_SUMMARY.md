# SEO Meta Title & Description Summary

This document lists all pages in the application with their meta titles and descriptions.

## Static Pages

### 1. About Us (`/about-us`)
- **Meta Title**: "About Us - GoKite | Your Trusted Travel Partner"
- **Meta Description**: "Learn about GoKite, your trusted travel partner offering holidays, flights, hotels, visas, and activities. Discover our mission to make travel accessible and enjoyable for everyone."

### 2. Activities (`/activities`)
- **Meta Title**: "Activities & Experiences - GoKite | Book Exciting Travel Activities"
- **Meta Description**: "Discover and book exciting activities and experiences for your next trip. From adventure sports to cultural tours, find the perfect activities to make your journey memorable with GoKite."

### 3. Flights (`/flights`)
- **Meta Title**: "Flight Booking - GoKite | Book Cheap Flights Online"
- **Meta Description**: "Book cheap flights online with GoKite. Compare prices, find the best deals on domestic and international flights. Get instant confirmation and best prices guaranteed."

### 4. Hotels (`/hotels`)
- **Meta Title**: "Hotel Booking - GoKite | Book Hotels Online at Best Prices"
- **Meta Description**: "Book hotels online with GoKite. Find the best hotel deals worldwide. Compare prices, read reviews, and get instant confirmation. Best price guarantee on hotel bookings."

### 5. More Services (`/more`)
- **Meta Title**: "More Services - GoKite | Additional Travel Services"
- **Meta Description**: "Explore more travel services from GoKite. Discover additional services to enhance your travel experience including travel insurance, car rentals, and more."

### 6. Privacy Policy (`/privacy-policy`)
- **Meta Title**: "Privacy Policy - GoKite | Your Data Protection & Privacy"
- **Meta Description**: "Read GoKite's privacy policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and our commitment to data protection."

### 7. Terms & Conditions (`/terms`)
- **Meta Title**: "Terms & Conditions - GoKite | Terms of Use & Policies"
- **Meta Description**: "Read GoKite's terms and conditions, privacy policy, cookie policy, and best price guarantee. Understand our terms of use and policies for booking travel services."

### 8. Sign In (`/sign-in`)
- **Meta Title**: "Sign In - GoKite | Login to Your Account"
- **Meta Description**: "Sign in to your GoKite account to access your bookings, manage your travel plans, and enjoy exclusive member benefits."
- **Robots**: `noindex, nofollow` (since it redirects)

## Dynamic Pages

### 9. Dynamic Page Router (`/[slug]`)
- **Meta Title**: Uses `pageData.seoMeta.metaTitle` or `pageData.title` or fallback: "GoKite - Book Your Entire Trip in One Place"
- **Meta Description**: Uses `pageData.seoMeta.metaDescription` or generates from `pageData.title` or fallback: "Book your entire trip in one place with GoKite. Discover amazing holiday packages, visa services, flights, hotels, and activities all in one platform."

### 10. Home/Landing Page (`/[slug]/home` or `/[slug]` with slug="master-landing-page")
- **Meta Title**: Uses `pageInfo.seoMeta.metaTitle` or `pageInfo.title` or fallback: "GoKite - Book Your Entire Trip in One Place"
- **Meta Description**: Uses `pageInfo.seoMeta.metaDescription` or fallback: "Book your entire trip in one place with GoKite. Discover amazing holiday packages, visa services, flights, hotels, and activities all in one platform."

### 11. Visa Landing Page (`/[slug]/visa` or `/[slug]` with slug="visa-landing-page")
- **Meta Title**: Uses `pageInfo.seoMeta.metaTitle` or `pageInfo.title` or fallback: "Visa Services - GoKite | Apply for Visa Online"
- **Meta Description**: Uses `pageInfo.seoMeta.metaDescription` or fallback: "Apply for visa online with GoKite. Fast and easy visa application process for multiple countries. Get your visa approved quickly with our expert visa services."
- **Schema**: Includes FAQPage schema from visa rules data

### 12. Holidays Page (`/[slug]/holidays` or `/[slug]` with slug="holiday-home-page")
- **Meta Title**: Uses `pageInfo.seoMeta.metaTitle` or `pageInfo.title` or fallback: "Holiday Packages - GoKite | Book Your Dream Vacation"
- **Meta Description**: Uses `pageInfo.seoMeta.metaDescription` or fallback: "Discover amazing holiday packages with GoKite. Browse through beach holidays, adventure trips, city breaks, and more. Book your dream vacation today with best prices guaranteed."

### 13. Apply Visa Page (`/[slug]/apply-visa`)
- **Meta Title**: "Apply for {Country} Visa Online - GoKite" (dynamically generated from visa details)
- **Meta Description**: "Apply for {Country} visa online with GoKite. Fast and easy visa application process. Get your visa approved quickly with our expert visa services."
- **Schema**: Includes FAQPage schema from visa FAQ data

### 14. Holiday Grid Page (`/[slug]/holiday-grid`)
- **Meta Title**: "Holiday Packages - {SelectedCategory} | GoKite" (dynamically updated based on selected category)
- **Meta Description**: "Browse {selectedCategory} holiday packages with GoKite. Find the perfect vacation package for your next trip. Compare prices and book your dream holiday today."

### 15. Holiday List Page (`/[slug]/holiday-list`)
- **Meta Title**: "Holiday Packages List - GoKite | Browse All Vacation Packages"
- **Meta Description**: "Browse all holiday packages with GoKite. Find the perfect vacation package for your next trip. Compare prices, read reviews, and book your dream holiday today."

### 16. Tour Details Page (`/[slug]/tour-details/[tourSlug]`)
- **Meta Title**: "{Tour Title} - GoKite | Holiday Package Details" (dynamically generated from tour data)
- **Meta Description**: Uses tour description from API or generates: "Discover {Tour Title} - Book your perfect holiday package with GoKite."
- **Schema**: 
  - Product schema with offer details
  - Breadcrumb schema
  - FAQPage schema (if FAQs available)

## SEO Features on All Pages

Every page includes:
- ✅ Meta Title (`<title>` tag)
- ✅ Meta Description (`<meta name="description">`)
- ✅ Meta Keywords (`<meta name="keywords">`)
- ✅ Robots Meta Tag (`<meta name="robots">`)
- ✅ Canonical URL (`<link rel="canonical">`)
- ✅ Geo Meta Tags (geo.region, geo.placename, geo.position, ICBM)
- ✅ Hreflang Tags (en-ae, en-in, en-om)
- ✅ Open Graph Tags (og:title, og:description, og:image, og:url, og:type)
- ✅ Twitter Card Tags (twitter:card, twitter:title, twitter:description, twitter:image)
- ✅ Schema Markup (JSON-LD) - varies by page type

## Notes

1. **Dynamic Content**: Pages that fetch data from APIs use the API data for SEO when available, with sensible fallbacks.

2. **Fallback Values**: All pages have fallback titles and descriptions to ensure SEO metadata is always present.

3. **Schema Markup**: 
   - Product pages (tour details) include Product + Offer + Breadcrumb + FAQ schemas
   - Visa pages include FAQPage schema
   - All pages include Breadcrumb schema

4. **Canonical URLs**: All pages have canonical URLs to prevent duplicate content issues.

5. **Multi-country Support**: All pages include hreflang tags for UAE, India, and Oman variants.

6. **Image SEO**: Open Graph images are set for all pages (1200x630px recommended).

## Verification Checklist

- [x] All pages have meta title
- [x] All pages have meta description
- [x] All pages have canonical URLs
- [x] All pages have Open Graph tags
- [x] All pages have Twitter Card tags
- [x] All pages have geo meta tags
- [x] All pages have hreflang tags
- [x] Dynamic pages have fallback values
- [x] Product pages have Product schema
- [x] FAQ pages have FAQPage schema
- [x] All pages have Breadcrumb schema

