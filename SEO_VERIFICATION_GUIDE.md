# SEO Verification Guide

## Why SEO Content is "Visible"

SEO meta tags are **supposed to be in the HTML source code** - they're not visible on the page itself, but they're in the `<head>` section of the HTML. This is normal and correct behavior. Search engines and social media platforms read these tags from the HTML source.

## How to Verify SEO is Working

### Method 1: View Page Source (Easiest)

1. **Open any page** in your browser (e.g., `http://localhost:3000/about-us`)
2. **Right-click** on the page → **View Page Source** (or press `Ctrl+U` / `Cmd+U`)
3. **Look for** these tags in the `<head>` section:
   ```html
   <title>About Us - GoKite | Your Trusted Travel Partner</title>
   <meta name="description" content="Learn about GoKite..." />
   <meta name="keywords" content="..." />
   <link rel="canonical" href="..." />
   <meta property="og:title" content="..." />
   <meta name="twitter:card" content="..." />
   <script type="application/ld+json">
     ...
   </script>
   ```

### Method 2: Browser Developer Tools (Recommended)

1. **Open any page** in your browser
2. **Press F12** (or Right-click → Inspect)
3. **Go to Elements/Inspector tab**
4. **Expand the `<head>` tag**
5. **Look for**:
   - `<title>` tag
   - `<meta>` tags (description, keywords, robots, og:_, twitter:_)
   - `<link rel="canonical">` tag
   - `<script type="application/ld+json">` tags (for schema)

### Method 3: Console Command (Quick Check)

1. **Open Browser Console** (F12 → Console tab)
2. **Run these commands**:

```javascript
// Check title
console.log(document.title);

// Check meta description
console.log(document.querySelector('meta[name="description"]')?.content);

// Check canonical URL
console.log(document.querySelector('link[rel="canonical"]')?.href);

// Check Open Graph title
console.log(document.querySelector('meta[property="og:title"]')?.content);

// Check all meta tags
console.log(
  Array.from(document.querySelectorAll("meta")).map((m) => ({
    name: m.getAttribute("name") || m.getAttribute("property"),
    content: m.getAttribute("content"),
  }))
);
```

### Method 4: Online SEO Testing Tools

#### A. Google Rich Results Test

- **URL**: https://search.google.com/test/rich-results
- **Enter your page URL**
- **Check**: Schema markup validation

#### B. Facebook Sharing Debugger

- **URL**: https://developers.facebook.com/tools/debug/
- **Enter your page URL**
- **Check**: Open Graph tags

#### C. Twitter Card Validator

- **URL**: https://cards-dev.twitter.com/validator
- **Enter your page URL**
- **Check**: Twitter Card tags

#### D. Schema Markup Validator

- **URL**: https://validator.schema.org/
- **Paste your page HTML** or enter URL
- **Check**: JSON-LD schema validation

#### E. SEO Site Checkup

- **URL**: https://seositecheckup.com/seo-audit
- **Enter your page URL**
- **Check**: All meta tags, canonical URLs, etc.

### Method 5: Check Specific Pages

#### Static Pages to Test:

- `/about-us` - Should have "About Us - GoKite" title
- `/flights` - Should have "Flight Booking - GoKite" title
- `/hotels` - Should have "Hotel Booking - GoKite" title
- `/privacy-policy` - Should have "Privacy Policy - GoKite" title

#### Dynamic Pages to Test:

- `/master-landing-page` - Should use API data or fallback
- `/visa-landing-page` - Should have visa-related SEO
- `/holiday-home-page` - Should have holiday-related SEO

## What to Look For

### ✅ Correct Implementation Should Show:

1. **Title Tag** (`<title>`)

   ```html
   <title>Page Title - GoKite</title>
   ```

2. **Meta Description**

   ```html
   <meta name="description" content="Page description here" />
   ```

3. **Meta Keywords**

   ```html
   <meta name="keywords" content="keyword1, keyword2" />
   ```

4. **Canonical URL**

   ```html
   <link rel="canonical" href="https://www.gokite.com/page-slug" />
   ```

5. **Open Graph Tags**

   ```html
   <meta property="og:title" content="Page Title" />
   <meta property="og:description" content="Description" />
   <meta property="og:image" content="https://..." />
   <meta property="og:url" content="https://..." />
   ```

6. **Twitter Card Tags**

   ```html
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="Page Title" />
   <meta name="twitter:description" content="Description" />
   ```

7. **Geo Tags**

   ```html
   <meta name="geo.region" content="AE" />
   <meta name="geo.placename" content="Dubai, Abu Dhabi" />
   ```

8. **Hreflang Tags**

   ```html
   <link rel="alternate" hreflang="en-ae" href="..." />
   <link rel="alternate" hreflang="en-in" href="..." />
   ```

9. **Schema Markup (JSON-LD)**
   ```html
   <script type="application/ld+json">
     {
       "@context": "https://schema.org",
       "@type": "BreadcrumbList",
       ...
     }
   </script>
   ```

## Quick Verification Checklist

Run this in browser console to verify all SEO tags:

```javascript
const seoCheck = {
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.content,
  keywords: document.querySelector('meta[name="keywords"]')?.content,
  canonical: document.querySelector('link[rel="canonical"]')?.href,
  ogTitle: document.querySelector('meta[property="og:title"]')?.content,
  ogDescription: document.querySelector('meta[property="og:description"]')
    ?.content,
  ogImage: document.querySelector('meta[property="og:image"]')?.content,
  twitterCard: document.querySelector('meta[name="twitter:card"]')?.content,
  robots: document.querySelector('meta[name="robots"]')?.content,
  schemaScripts: document.querySelectorAll('script[type="application/ld+json"]')
    .length,
};

console.table(seoCheck);
```

## Common Issues & Solutions

### Issue 1: Meta tags not showing in View Source

**Solution**:

- Make sure `react-helmet-async` is properly installed
- Check that `HelmetProvider` wraps your app in `layout.tsx`
- Verify `SEOHead` component is imported and used in the page

### Issue 2: Title shows default Next.js title

**Solution**:

- Check that `SEOHead` component is rendered before page content
- Verify the `title` prop is being passed correctly

### Issue 3: Schema markup not appearing

**Solution**:

- Check browser console for JSON parsing errors
- Verify schema object structure matches expected format
- Ensure schema is passed to `SEOHead` component

### Issue 4: Open Graph tags missing

**Solution**:

- Verify `openGraph` prop is passed to `SEOHead`
- Check that image URLs are absolute (not relative)

## Testing in Development

1. **Start your dev server**: `npm run dev`
2. **Open**: `http://localhost:3000/about-us`
3. **View Source**: Right-click → View Page Source
4. **Search for**: `<title>` or `<meta name="description">`
5. **Verify**: Tags are present with correct content

## Testing in Production

1. **Build your app**: `npm run build`
2. **Start production server**: `npm start`
3. **Test with online tools** (see Method 4 above)
4. **Use browser dev tools** to inspect rendered HTML

## Files to Check for SEO Implementation

### Core SEO Files:

- ✅ `src/components/seo/SEOHead.tsx` - Main SEO component
- ✅ `src/components/seo/HelmetProvider.tsx` - Provider wrapper
- ✅ `src/lib/seo/types.ts` - TypeScript types
- ✅ `src/lib/seo/config.ts` - Configuration
- ✅ `src/lib/seo/schema.ts` - Schema generators

### Pages with SEO:

- ✅ All pages in `src/app/` directory
- ✅ Check each `page.tsx` file for `SEOHead` import and usage

## Example: Verifying About Us Page

1. Navigate to: `http://localhost:3000/about-us`
2. View Source (Ctrl+U)
3. Search for: "About Us - GoKite"
4. Should find:
   ```html
   <title>About Us - GoKite | Your Trusted Travel Partner</title>
   <meta
     name="description"
     content="Learn about GoKite, your trusted travel partner..."
   />
   ```

## Need Help?

If SEO tags are not appearing:

1. Check browser console for errors
2. Verify `HelmetProvider` is in `layout.tsx`
3. Ensure `SEOHead` is imported and used in each page
4. Check that props are being passed correctly
