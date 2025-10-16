"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { usePageContext } from "../common/PageContext";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();

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
      <section className="px-20 py-8 lg:py-12">
        <p>Loading visa rules...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-20 py-8 lg:py-12">
        <p>Error loading visa rules: {error}</p>
      </section>
    );
  }

  if (visaRulesData.length === 0) {
    return (
      <section className="px-20 py-8 lg:py-12">
        <p>No visa rules announcements available at the moment.</p>
      </section>
    );
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-20 py-8 lg:py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Visa Rules & Announcements
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full w-9 h-9 bg-gray-700 text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full w-9 h-9 bg-gray-700 text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {visaRulesData.map((rule) => (
          <div key={rule.uniqueId || rule.id} className="flex-shrink-0">
            <VisaRuleCard rule={rule} />
          </div>
        ))}
      </div>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// Individual card component
const VisaRuleCard = ({ rule }: { rule: VisaRuleAnnouncement }) => {
  const FlagComponent =
    Flags[rule.countryCode.toUpperCase() as keyof typeof Flags] || Flags.US;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative w-full max-w-sm">
      {/* Flag and Country Name */}
      <div className="flex flex-col items-start gap-2 px-6 pt-6 pb-4">
        <span className="block w-10 h-7 rounded overflow-hidden shadow-sm">
          {rule.flagImageUrl ? (
            <img
              src={rule.flagImageUrl}
              alt={`${rule.country} flag`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const nextSibling = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <FlagComponent
            className="w-full h-full object-cover"
            style={{ display: rule.flagImageUrl ? "none" : "block" }}
          />
        </span>
        <h3 className="font-bold text-2xl text-gray-900">{rule.country}</h3>
      </div>

      {/* Card/Document Image - Top Right */}
      <div className="absolute -top-2 right-6">
        <img
          src="/visa/visa-card.png"
          alt="Digital Card"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16 pt-2">
        <p className="text-gray-700 text-[15px] leading-relaxed">
          {rule.description}
        </p>
      </div>

      {/* Logo - Bottom Right */}
      <div className="absolute bottom-5 right-6">
        <img src="/logo.svg" alt="Logo" className="h-6 w-auto object-contain" />
      </div>
    </div>
  );
};

export default VisaRulesCard;
export type { VisaRuleAnnouncement };
