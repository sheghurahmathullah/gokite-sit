/**
 * SEO Verification Utility
 * 
 * Use this in browser console to verify SEO implementation
 * Copy and paste into browser console on any page
 */

export const verifySEO = () => {
  const results: Record<string, any> = {};

  // Check Title
  results.title = document.title || "❌ Missing";
  results.titleLength = document.title?.length || 0;
  results.titleStatus = document.title && document.title.length > 0 && document.title.length <= 60 
    ? "✅ Good" 
    : document.title?.length > 60 
    ? "⚠️ Too long (should be ≤60 chars)" 
    : "❌ Missing";

  // Check Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  results.description = metaDesc?.getAttribute('content') || "❌ Missing";
  results.descriptionLength = metaDesc?.getAttribute('content')?.length || 0;
  const descLength = metaDesc?.getAttribute('content')?.length || 0;
  results.descriptionStatus = descLength > 0 && descLength <= 160 
    ? "✅ Good" 
    : descLength > 160 
    ? "⚠️ Too long (should be ≤160 chars)" 
    : "❌ Missing";

  // Check Meta Keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  results.keywords = metaKeywords?.getAttribute('content') || "❌ Missing";
  results.keywordsStatus = metaKeywords ? "✅ Present" : "⚠️ Optional";

  // Check Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  results.canonical = canonical?.getAttribute('href') || "❌ Missing";
  results.canonicalStatus = canonical ? "✅ Present" : "❌ Missing";

  // Check Robots Meta
  const robots = document.querySelector('meta[name="robots"]');
  results.robots = robots?.getAttribute('content') || "❌ Missing";
  results.robotsStatus = robots ? "✅ Present" : "⚠️ Using default";

  // Check Open Graph Tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogType = document.querySelector('meta[property="og:type"]');
  
  results.openGraph = {
    title: ogTitle?.getAttribute('content') || "❌ Missing",
    description: ogDesc?.getAttribute('content') || "❌ Missing",
    image: ogImage?.getAttribute('content') || "❌ Missing",
    url: ogUrl?.getAttribute('content') || "❌ Missing",
    type: ogType?.getAttribute('content') || "❌ Missing",
  };
  results.openGraphStatus = ogTitle && ogDesc && ogImage && ogUrl && ogType 
    ? "✅ Complete" 
    : "⚠️ Incomplete";

  // Check Twitter Card Tags
  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  
  results.twitterCard = {
    card: twitterCard?.getAttribute('content') || "❌ Missing",
    title: twitterTitle?.getAttribute('content') || "❌ Missing",
    description: twitterDesc?.getAttribute('content') || "❌ Missing",
    image: twitterImage?.getAttribute('content') || "❌ Missing",
  };
  results.twitterCardStatus = twitterCard && twitterTitle && twitterDesc && twitterImage 
    ? "✅ Complete" 
    : "⚠️ Incomplete";

  // Check Geo Tags
  const geoRegion = document.querySelector('meta[name="geo.region"]');
  const geoPlacename = document.querySelector('meta[name="geo.placename"]');
  results.geo = {
    region: geoRegion?.getAttribute('content') || "❌ Missing",
    placename: geoPlacename?.getAttribute('content') || "❌ Missing",
  };
  results.geoStatus = geoRegion && geoPlacename ? "✅ Present" : "⚠️ Missing";

  // Check Hreflang Tags
  const hreflangTags = document.querySelectorAll('link[rel="alternate"][hrefLang]');
  results.hreflang = Array.from(hreflangTags).map(tag => ({
    hreflang: tag.getAttribute('hrefLang'),
    href: tag.getAttribute('href'),
  }));
  results.hreflangStatus = hreflangTags.length > 0 
    ? `✅ ${hreflangTags.length} tags found` 
    : "⚠️ Missing";

  // Check Schema Markup
  const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
  results.schemaCount = schemaScripts.length;
  results.schemaTypes = Array.from(schemaScripts).map((script, index) => {
    try {
      const json = JSON.parse(script.textContent || '{}');
      return json['@type'] || `Schema ${index + 1}`;
    } catch {
      return `Invalid JSON ${index + 1}`;
    }
  });
  results.schemaStatus = schemaScripts.length > 0 
    ? `✅ ${schemaScripts.length} schema(s) found` 
    : "⚠️ No schema markup";

  // Overall Status
  const criticalChecks = [
    results.titleStatus.includes('✅'),
    results.descriptionStatus.includes('✅'),
    results.canonicalStatus.includes('✅'),
    results.openGraphStatus.includes('✅'),
  ];
  
  results.overallStatus = criticalChecks.every(check => check) 
    ? "✅ SEO Implementation Complete" 
    : "⚠️ Some SEO elements missing";

  return results;
};

// Browser console helper
if (typeof window !== 'undefined') {
  (window as any).verifySEO = verifySEO;
  console.log('✅ SEO Verification Tool Loaded!');
  console.log('Run verifySEO() in console to check SEO implementation');
}

