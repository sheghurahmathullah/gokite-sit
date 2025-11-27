"use client";
import { useEffect, useMemo, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { HomePageSkeleton } from "@/components/common/SkeletonLoader";
import { usePageContext } from "@/components/common/PageContext";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG, getCanonicalUrl } from "@/lib/seo/config";
import { formatSEOTitle, formatSEODescription } from "@/lib/seo/utils";

// Import all page components
import HomePage from "@/app/[slug]/home/page";
import HolidaysPage from "@/app/[slug]/holidays/HolidaysPage";
import ApplyVisaPage from "@/app/[slug]/apply-visa/page";
import HolidayGridPage from "@/app/[slug]/holiday-grid/page";
import HolidayListPage from "@/app/[slug]/holiday-list/page";
import VisaPage from "@/app/[slug]/visa/page";

// Mapping of slugs to page components
const PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  "master-landing-page": HomePage,
  "holiday-home-page": HolidaysPage,
  "visa-landing-page": VisaPage,
  "apply-visa": ApplyVisaPage,
  "holiday-grid": HolidayGridPage,
  "holiday-list": HolidayListPage,
  "visa": VisaPage,
};

interface PageData {
  id: string;
  slug: string;
  title: string;
  seoMeta: {
    metaTitle: string;
    metaKeywords: string[];
    metaDescription: string;
  };
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const {
    pages,
    loading: pagesLoading,
    initialAuthCheckDone,
    refetchPages,
  } = usePageContext();
  const refetchRequestedRef = useRef(false);

  const pageData = useMemo<PageData | null>(() => {
    if (!pages || pages.length === 0) {
      return null;
    }
    return (pages.find((p: any) => p.slug === slug) as PageData) || null;
  }, [pages, slug]);

  useEffect(() => {
    if (!initialAuthCheckDone) {
      return;
    }

    if (pagesLoading) {
      return;
    }

    if (!pages || pages.length === 0) {
      if (refetchRequestedRef.current) {
        return;
      }
      refetchRequestedRef.current = true;
      console.warn("[DynamicPage] Pages list is empty, attempting refetch");
      refetchPages().catch((error) =>
        console.error("[DynamicPage] Failed to refetch pages:", error)
      );
    } else {
      refetchRequestedRef.current = false;
    }
  }, [pages, pagesLoading, refetchPages, initialAuthCheckDone]);

  useEffect(() => {
    if (!pageData && typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("currentPageSlug", slug);
      } catch (e) {
        console.error("Failed to store page slug:", e);
      }
    }
  }, [pageData, slug]);

  if (!initialAuthCheckDone || pagesLoading || (!pageData && (!pages || pages.length === 0))) {
    return <HomePageSkeleton />;
  }

  // If page not found in API, return 404
  if (!pageData) {
    notFound();
  }

  // Get the corresponding page component
  const PageComponent = PAGE_COMPONENTS[slug];

  if (!PageComponent) {
    notFound();
  }

  // Prepare SEO data - Ensure we always have descriptive title and description
  const seoTitle = formatSEOTitle(
    pageData?.seoMeta?.metaTitle || pageData?.title,
    "GoKite - Book Your Entire Trip in One Place"
  );
  const seoDescription = formatSEODescription(
    pageData?.seoMeta?.metaDescription,
    pageData?.title 
      ? `Discover ${pageData.title} with GoKite. Book your entire trip in one place - holidays, flights, hotels, visas, and activities.`
      : "Book your entire trip in one place with GoKite. Discover amazing holiday packages, visa services, flights, hotels, and activities all in one platform."
  );
  const seoKeywords = pageData?.seoMeta?.metaKeywords || [];
  const canonicalPath = `/${slug}`;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        pageName={pageData?.title || slug}
        canonical={canonicalPath}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          image: getCanonicalUrl("/images/og-default.jpg"),
          url: getCanonicalUrl(canonicalPath),
          type: "website",
        }}
        twitter={{
          title: seoTitle,
          description: seoDescription,
          image: getCanonicalUrl("/images/og-default.jpg"),
        }}
        hreflang={[
          { href: `${SEO_CONFIG.countryDomains["en-ae"]}${canonicalPath}`, hreflang: "en-ae" },
          { href: `${SEO_CONFIG.countryDomains["en-in"]}${canonicalPath}`, hreflang: "en-in" },
          { href: `${SEO_CONFIG.countryDomains["en-om"]}${canonicalPath}`, hreflang: "en-om" },
        ]}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: pageData?.title || slug, url: getCanonicalUrl(canonicalPath) },
          ],
        }}
      />
      <PageComponent />
    </>
  );
}

