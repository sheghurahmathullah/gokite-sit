import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { usePageContext } from "../common/PageContext";
import { useRouter } from "next/navigation";

export interface VisaCountry {
  id: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
  flagImageUrl?: string;
  subtitle?: string;
}

interface VisaCardProps {
  visa: VisaCountry;
  type?: "popular" | "trending";
  subtitle?: string; // For showing custom subtitle like in trending
  hasVisaTag?: boolean; // For "VISA" tag in trending
  onClick?: () => void; // Add onClick handler
}

const VisaCard = ({
  visa,
  type = "popular",
  subtitle,
  hasVisaTag,
  onClick,
}: VisaCardProps) => {
  // Access flag by countryCode (uppercase)
  const FlagComponent =
    Flags[visa.countryCode.toUpperCase() as keyof typeof Flags];

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer min-w-[260px] flex-shrink-0"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div
          className={
            type === "trending"
              ? "flex items-center justify-between mb-1"
              : "mb-1"
          }
        >
          {visa.flagImageUrl ? (
            <img
              src={visa.flagImageUrl}
              alt={`${visa.country} flag`}
              className="w-12 h-12 rounded object-cover"
              onError={(e) => {
                // Fallback to component flag on error
                e.currentTarget.style.display = "none";
                const nextSibling = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = "block";
              }}
            />
          ) : null}
          {FlagComponent && (
            <FlagComponent
              className="w-12 h-12 rounded"
              style={{ display: visa.flagImageUrl ? "none" : "block" }}
            />
          )}
          {hasVisaTag && (
            <img
              src="/visa/visa-icon.png"
              alt="Visa"
              className="w-8 h-6 ml-auto"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-0.5">
            {visa.country}
          </h3>
          {type === "popular" ? (
            <p className="text-xs text-gray-500 mb-3">{visa.visaType}</p>
          ) : (
            subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-gray-900">
              {visa.currency}
              {visa.price.toLocaleString()}
            </span>
            {visa.perAdult && (
              <span className="text-xs text-gray-500">per adult</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

interface CountrySliderProps {
  title: string;
  type?: "popular" | "trending";
  sectionTitle: string; // New prop to identify section
}

// Helper function to get flag component
const getFlagComponent = (countryCode: string) => {
  try {
    return Flags[countryCode.toUpperCase() as keyof typeof Flags];
  } catch {
    return Flags.US; // Fallback to US flag
  }
};

const CountrySlider = ({
  title,
  type = "popular",
  sectionTitle,
}: CountrySliderProps) => {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Fetch visa cards data
  const fetchVisaCardsData = async (sectionId: string) => {
    try {
      const response = await fetch("/api/cms/sections-visa-cards", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pageSectionId: sectionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visa cards data");
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err: any) {
      console.error("Error fetching visa cards:", err);
      throw err;
    }
  };

  // Transform API data to component format
  const transformVisaData = (apiData: any[]): VisaCountry[] => {
    return apiData.map((item) => {
      // Try to get country code from multiple possible sources
      const countryCode =
        item.visaCardJson?.countryCode ||
        item.visaCardCountryId ||
        item.countryCode ||
        "US";

      console.log(`Country: ${item.visaCardTitle}, Code: ${countryCode}`, item);

      return {
        id: item.visaCardCountryId || item.id,
        country: item.visaCardTitle || item.country,
        countryCode: countryCode,
        price: parseFloat(item.newPrice || item.price || "0"),
        currency: item.currency || "₹",
        visaType: item.visaCardJson?.subTitle || "Tourist Visa",
        visaTime: item.visaCardJson?.visaTime || "",
        image: item.visaCardJson?.image || "",
        perAdult: item.visaCardJson?.perAdult || true,
        eVisa: item.visaCardJson?.eVisa || false,
        flagImageUrl:
          getFlagImageUrl(item.visaCardJson?.flagImage) || undefined,
        subtitle: item.subtitle || "Get your Visa by 24 hours",
      };
    });
  };

  // Load data on component mount
  useEffect(() => {
    if (pageLoading) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sections
        const sections = await fetchSectionsData();

        // Find section based on title and type
        const section = sections.find(
          (s: any) => s.title === sectionTitle && s.contentType === "VISA"
        );

        if (!section) {
          throw new Error(`Section not found: ${sectionTitle}`);
        }

        // Fetch visa cards for this section
        const visaCardsData = await fetchVisaCardsData(section.pageSectionId);

        // Transform data
        const transformedData = transformVisaData(visaCardsData);

        setCountries(transformedData);
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message);

        // Fallback data
        setCountries([
          {
            id: "US",
            country: "United States",
            countryCode: "US",
            price: 160500,
            currency: "₹",
            visaType: "Tourist Visa",
            visaTime: "30 days",
            image: "",
            perAdult: true,
            eVisa: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading, sectionTitle]);

  // Handle card click - store countryId and navigate
  const handleCardClick = (visa: VisaCountry) => {
    try {
      if (typeof window !== "undefined") {
        // Store both countryId and countryCode for the apply-visa page
        window.sessionStorage.setItem("applyVisaCountryId", visa.id);
        window.sessionStorage.setItem("applyVisaCountryCode", visa.countryCode);
      }
    } catch (e) {
      console.error("Error saving to sessionStorage:", e);
    }
    // Navigate to apply-visa page
    router.push("/apply-visa");
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <section className="w-full px-6 py-6">
        <div>Loading {title}...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-6">
        <div>
          Error loading {title}: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-6">
      <div className="max-w-[85rem] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
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

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {countries.map((visa) => (
            <VisaCard
              key={visa.id}
              visa={visa}
              type={type}
              subtitle={
                type === "trending" ? "Get your Visa by 24hours" : undefined
              }
              hasVisaTag={
                type === "trending" &&
                (visa.eVisa || visa.visaType.toLowerCase().includes("e-visa"))
              }
              onClick={() => handleCardClick(visa)}
            />
          ))}
        </div>
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default CountrySlider;
