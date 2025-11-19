"use client";
import { useEffect, useMemo, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { HomePageSkeleton } from "@/components/common/SkeletonLoader";
import { usePageContext } from "@/components/common/PageContext";

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
    if (!pageData) {
      return;
    }

    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("currentPageSlug", slug);
      } catch (e) {
        console.error("Failed to store page slug:", e);
      }

      document.title = pageData.title || pageData.seoMeta?.metaTitle;

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          pageData.seoMeta?.metaDescription || ""
        );
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && pageData.seoMeta?.metaKeywords) {
        metaKeywords.setAttribute(
          "content",
          pageData.seoMeta.metaKeywords.join(", ")
        );
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

  return <PageComponent />;
}

