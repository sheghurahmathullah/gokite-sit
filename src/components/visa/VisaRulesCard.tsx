"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { usePageContext } from "../common/PageContext";
import { useRouter } from "next/navigation";
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

const VisaRulesCard = () => {
  const [visaRulesData, setVisaRulesData] = useState<VisaRuleAnnouncement[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<VisaRulesCarouselRef>(null);
  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();
  const router = useRouter();

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
        item.visaCardJson?.countryCode ||
        item.visaCardCountryId ||
        item.countryCode ||
        "US";

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

  // Load data
  useEffect(() => {
    if (pageLoading) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const sections = await fetchSectionsData();

        const visaRulesSection = sections.find(
          (s: any) =>
            s.title === "Visa Rules Announcement" && s.contentType === "VISA"
        );

        if (!visaRulesSection) {
          throw new Error("Visa Rules section not found");
        }

        const visaRulesApiData = await fetchVisaRulesData(
          visaRulesSection.pageSectionId
        );
        const transformedData = transformVisaRulesData(visaRulesApiData);
        setVisaRulesData(transformedData);
      } catch (err: any) {
        console.error("Error loading visa rules:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading]);

  if (loading) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <p>Loading visa rules...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <p>Error loading visa rules: {error}</p>
        </div>
      </section>
    );
  }

  if (visaRulesData.length === 0) {
    return (
      <section className="w-full px-6 py-8 lg:py-12">
        <div className="max-w-[85rem] mx-auto">
          <p>No visa rules announcements available at the moment.</p>
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

  // Handle card click - store countryId and navigate
  const handleCardClick = (rule: VisaRuleAnnouncement) => {
    try {
      if (typeof window !== "undefined") {
        // Store both countryId and countryCode for the apply-visa page
        window.sessionStorage.setItem("applyVisaCountryId", rule.id);
        window.sessionStorage.setItem("applyVisaCountryCode", rule.countryCode);
      }
    } catch (e) {
      console.error("Error saving to sessionStorage:", e);
    }
    // Navigate to apply-visa page
    router.push("/apply-visa");
  };

  return (
    <section className="w-full px-6 py-1 lg:pb-12">
      <div className="max-w-[85rem] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Visa Rules & Announcements
          </h2>
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
