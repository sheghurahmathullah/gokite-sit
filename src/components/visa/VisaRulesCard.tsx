"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { usePageContext } from "../common/PageContext";
import { useRouter, useParams } from "next/navigation";
import VisaRulesCarousel, {
  VisaRulesCarouselRef,
  VisaRuleAnnouncement as ImportedVisaRuleAnnouncement,
} from "./VisaRulesCarousel";

interface VisaRuleAnnouncement {
  id: string;
  country: string;
  countryCode: string;
  title?: string;
  description: string;
  date?: string;
  logoImage?: string;
  cardImage?: string;
  flagImageUrl?: string;
  uniqueId?: string;
}

interface VisaRulesCardProps {
  visaRulesData?: VisaRuleAnnouncement[]; // Optional - if provided, skip API calls
  sectionTitle?: string; // Optional - section title from API, defaults to "Visa Rules & Announcements"
}

const VisaRulesCard: React.FC<VisaRulesCardProps> = ({
  visaRulesData: visaRulesDataProp,
  sectionTitle: sectionTitleProp,
}) => {
  const [visaRulesData, setVisaRulesData] = useState<VisaRuleAnnouncement[]>(
    visaRulesDataProp || []
  );
  const [sectionTitle, setSectionTitle] = useState<string>(
    sectionTitleProp || "Visa Rules & Announcements"
  );
  const [loading, setLoading] = useState(!visaRulesDataProp);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<VisaRulesCarouselRef>(null);
  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();
  const router = useRouter();
  const params = useParams();
  const currentSlug = (params.slug as string) || "visa-landing-page";
  const dataFetchedRef = useRef(false);

  // Read cookie helper
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : "";
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getCookie("accesstoken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Fetch flag image URL
  const getFlagImageUrl = (imageName: string) => {
    if (!imageName) return null;
    return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
  };

  // Fetch sections data
  const fetchSectionsData = async () => {
    const PAGE_ID = getPageIdWithFallback("visa-landing-page");

    try {
      const sectionsResponse = await fetch("/api/cms/pages-sections", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pageId: PAGE_ID }),
      });

      if (!sectionsResponse.ok) {
        throw new Error("Failed to fetch sections data");
      }

      const sectionsData = await sectionsResponse.json();
      return sectionsData.data || [];
    } catch (err: any) {
      console.error("Error fetching sections:", err);
      throw err;
    }
  };

  // Fetch visa rules data
  const fetchVisaRulesData = async (sectionId: string) => {
    try {
      const response = await fetch("/api/cms/sections-visa-cards-rules", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pageSectionId: sectionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visa rules data");
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      console.error("Error fetching visa rules:", err);
      throw err;
    }
  };

  // Transform API data
  const transformVisaRulesData = (apiData: any[]): VisaRuleAnnouncement[] => {
    return apiData.map((item) => {
      const countryCode =
        item.visaCardCountryId || item.visaCardJson?.countryCode || item.countryCode || "US";

      return {
        id: item.sectionVisaCardUniqueId || item.id,
        country: item.visaCardTitle || "Unknown Country",
        countryCode: countryCode,
        title: item.title || item.visaCardJson?.title,
        description: item.visaCardJson?.description || "",
        cardImage: item.visaCardJson?.cardImage || "",
        flagImageUrl:
          getFlagImageUrl(item.visaCardJson?.flagImage) || undefined,
        uniqueId: item.sectionVisaCardUniqueId,
      };
    });
  };

  // Update visa rules and section title when props change
  useEffect(() => {
    if (visaRulesDataProp) {
      console.log(
        "[VisaRulesCard] Using visa rules from props, skipping API calls"
      );
      setVisaRulesData(visaRulesDataProp);
      setLoading(false);
    }
    if (sectionTitleProp) {
      setSectionTitle(sectionTitleProp);
    }
  }, [visaRulesDataProp, sectionTitleProp]);

  // Load data - only if rules not provided via props
  useEffect(() => {
    // If data provided via props, skip API calls
    if (visaRulesDataProp) {
      console.log("[VisaRulesCard] Skipping API calls - using prop data");
      return;
    }

    if (pageLoading) {
      console.log("[VisaRulesCard] Skipping - page context still loading");
      return;
    }

    // Early exit if data already fetched
    if (dataFetchedRef.current) {
      console.log("[VisaRulesCard] Skipping - data already fetched");
      return;
    }

    // Mark as fetching
    dataFetchedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("[VisaRulesCard] Fetching data via API (fallback)");

        const sections = await fetchSectionsData();

        const visaRulesSection = sections.find(
          (s: any) =>
            (s.title === "Visa Rules Announcement" ||
              s.title?.toLowerCase().includes("visa rules") ||
              s.title?.toLowerCase().includes("rules & announcements")) &&
            s.contentType === "VISA"
        );

        if (!visaRulesSection) {
          throw new Error("Visa Rules section not found");
        }

        // Update section title from API
        if (visaRulesSection.title) {
          setSectionTitle(visaRulesSection.title);
        }

        const visaRulesApiData = await fetchVisaRulesData(
          visaRulesSection.pageSectionId
        );
        const transformedData = transformVisaRulesData(visaRulesApiData);
        setVisaRulesData(transformedData);
      } catch (err: any) {
        console.error("Error loading visa rules:", err);
        setError(err.message);
        dataFetchedRef.current = false; // Reset on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading, visaRulesDataProp]);

  if (loading) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionTitle}
          </h2>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-gray-600">Loading visa rules...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionTitle}
          </h2>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Error Loading Data
            </h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (visaRulesData.length === 0) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {sectionTitle}
          </h2>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Announcements Available
            </h3>
            <p className="text-sm text-gray-600">
              No visa rules announcements available at the moment. Please check
              back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      direction === "left"
        ? carouselRef.current.scrollPrev()
        : carouselRef.current.scrollNext();
    }
  };

  // Handle card click - validate visa availability before navigation
  const handleCardClick = async (rule: VisaRuleAnnouncement) => {
    try {
      // Validate country has visa data before redirecting
      const visaResponse = await fetch("/api/cms/visa-country-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: rule.countryCode }),
      });

      if (!visaResponse.ok) {
        const { toast } = await import("react-toastify");
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const visaData = await visaResponse.json();

      if (!visaData.success || !visaData.data || visaData.data.length === 0) {
        const { toast } = await import("react-toastify");
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Store country code and visa details, then navigate
      try {
        if (typeof window !== "undefined") {
          // Store country code (prioritize this over ID)
          window.sessionStorage.setItem(
            "applyVisaCountryCode",
            rule.countryCode
          );
          // Store country ID as fallback (use countryCode if id is not reliable)
          window.sessionStorage.setItem("applyVisaCountryId", rule.countryCode);
          
          // Cache the visa details from API response (like CountrySlider does)
          if (visaData.data && visaData.data.length > 0) {
            window.sessionStorage.setItem(
              "applyVisaDetails",
              JSON.stringify(visaData.data[0])
            );
            // Also cache the search data for immediate use
            window.sessionStorage.setItem(
              "cachedVisaSearchData",
              JSON.stringify(visaData.data)
            );
            window.sessionStorage.setItem(
              "cachedVisaSearchTimestamp",
              Date.now().toString()
            );
          }
        }
      } catch (e) {
        console.error("Error saving to sessionStorage:", e);
      }

      // Navigate to apply-visa page with nested routing
      // Use the current slug from URL params instead of sessionStorage
      // Also store it in sessionStorage as a fallback for other components
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("currentPageSlug", currentSlug);
        } catch (_) {}
      }

      router.push(`/${currentSlug}/apply-visa`);
    } catch (e) {
      console.error("Failed to validate visa:", e);
      const { toast } = await import("react-toastify");
      toast.error("Failed to validate visa availability. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <section className="w-full px-6 py-1 lg:pb-12">
      <div className="max-w-[85rem] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{sectionTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <VisaRulesCarousel
          ref={carouselRef}
          rules={visaRulesData}
          onCardClick={handleCardClick}
        />
      </div>
    </section>
  );
};

export default VisaRulesCard;
export type { VisaRuleAnnouncement };
