"use client";
import { Helmet } from "react-helmet-async";
import { SEOProps } from "@/lib/seo/types";
import {
  generateProductSchema,
  generateOfferSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateLocalBusinessSchema,
} from "@/lib/seo/schema";
import { SEO_CONFIG, getCanonicalUrl } from "@/lib/seo/config";

interface SEOHeadProps extends SEOProps {
  // Optional: Override default site name
  siteName?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  pageName,
  robots = "index, follow",
  canonical,
  geo,
  hreflang,
  openGraph,
  twitter,
  schema,
  additionalMeta = [],
  siteName = SEO_CONFIG.siteName,
}: SEOHeadProps) {
  // Format keywords
  const keywordsString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords || "";

  // Get canonical URL
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : getCanonicalUrl(canonical)
    : typeof window !== "undefined"
    ? window.location.href
    : "";

  // Default Open Graph values
  const ogTitle = openGraph?.title || title;
  const ogDescription = openGraph?.description || description;
  const ogImage = openGraph?.image
    ? openGraph.image.startsWith("http")
      ? openGraph.image
      : getCanonicalUrl(openGraph.image)
    : getCanonicalUrl(SEO_CONFIG.defaultOgImage);
  const ogUrl = openGraph?.url
    ? openGraph.url.startsWith("http")
      ? openGraph.url
      : getCanonicalUrl(openGraph.url)
    : canonicalUrl;
  const ogType = openGraph?.type || "website";

  // Default Twitter values
  const twitterTitle = twitter?.title || title;
  const twitterDescription = twitter?.description || description;
  const twitterImage = twitter?.image
    ? twitter.image.startsWith("http")
      ? twitter.image
      : getCanonicalUrl(twitter.image)
    : ogImage;
  const twitterCard = twitter?.card || "summary_large_image";

  // Use geo from props or default
  const geoMeta = geo || SEO_CONFIG.defaultGeo;

  // Generate schema JSON-LD
  const schemaScripts: Array<{ type: string; id?: string; json: object }> = [];

  if (schema) {
    if (schema.product) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "product-schema",
        json: generateProductSchema(schema.product, schema.offer),
      });
    }

    if (schema.offer && !schema.product) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "offer-schema",
        json: generateOfferSchema(schema.offer),
      });
    }

    if (schema.breadcrumb && schema.breadcrumb.length > 0) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "breadcrumb-schema",
        json: generateBreadcrumbSchema(schema.breadcrumb),
      });
    }

    if (schema.faq && schema.faq.length > 0) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "faq-schema",
        json: generateFAQSchema(schema.faq),
      });
    }

    if (schema.article) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "article-schema",
        json: generateArticleSchema(schema.article),
      });
    }

    if (schema.localBusiness) {
      schemaScripts.push({
        type: "application/ld+json",
        id: "local-business-schema",
        json: generateLocalBusinessSchema(schema.localBusiness),
      });
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      {pageName && <meta name="page-name" content={pageName} />}

      {/* Robots Meta Tag */}
      <meta name="robots" content={robots} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Geo Meta Tags */}
      <meta name="geo.region" content={geoMeta.region} />
      <meta name="geo.placename" content={geoMeta.placename} />
      <meta name="geo.position" content={geoMeta.position} />
      <meta name="ICBM" content={geoMeta.icbm} />

      {/* Hreflang Tags */}
      {hreflang &&
        hreflang.map((link, index) => (
          <link
            key={`hreflang-${index}`}
            rel="alternate"
            href={link.href}
            hrefLang={link.hreflang}
          />
        ))}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      {openGraph?.locale && (
        <meta property="og:locale" content={openGraph.locale} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && (
        <meta name="twitter:creator" content={twitter.creator} />
      )}

      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => {
        if (meta.name) {
          return (
            <meta
              key={`meta-${index}`}
              name={meta.name}
              content={meta.content}
            />
          );
        }
        if (meta.property) {
          return (
            <meta
              key={`meta-${index}`}
              property={meta.property}
              content={meta.content}
            />
          );
        }
        return null;
      })}

      {/* Schema Markup (JSON-LD) */}
      {schemaScripts.map((script, index) => (
        <script
          key={`schema-${script.id || index}`}
          type={script.type}
          id={script.id}
        >
          {JSON.stringify(script.json)}
        </script>
      ))}
    </Helmet>
  );
}
