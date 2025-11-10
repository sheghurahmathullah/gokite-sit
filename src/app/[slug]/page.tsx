"use client";
import { useEffect, useState } from "react";
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
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { initialAuthCheckDone } = usePageContext();

  useEffect(() => {
    // Wait for authentication check to complete before fetching page data
    if (!initialAuthCheckDone) {
      console.log("[DynamicPage] Waiting for authentication to complete...");
      return;
    }

    async function fetchPageData() {
      try {
        console.log("[DynamicPage] Fetching page data for slug:", slug);
        const response = await fetch("/api/cms/pages");
        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }
        
        const data = await response.json();
        const page = data.data?.find((p: any) => p.slug === slug);
        
        if (!page) {
          console.warn("[DynamicPage] Page not found for slug:", slug);
          setPageData(null);
        } else {
          console.log("[DynamicPage] Page data loaded successfully");
          setPageData(page);
          
          // Store page slug in sessionStorage for nested routing
          if (typeof window !== 'undefined') {
            try {
              window.sessionStorage.setItem("currentPageSlug", slug);
            } catch (e) {
              console.error("Failed to store page slug:", e);
            }
          }
          
          // Update document title and meta tags
          if (typeof window !== 'undefined') {
            document.title = page.title || page.seoMeta?.metaTitle;
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', page.seoMeta?.metaDescription || '');
            }
            
            // Update meta keywords
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords && page.seoMeta?.metaKeywords) {
              metaKeywords.setAttribute('content', page.seoMeta.metaKeywords.join(', '));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, [slug, initialAuthCheckDone]);

  if (loading) {
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

