import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { usePageContext } from "../common/PageContext";
import { useRouter } from "next/navigation";
import VisaCountryCarousel, {
  VisaCountryCarouselRef,
} from "./VisaCountryCarousel";

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
  priceContent?: string;
}

interface CountrySliderProps {
  title: string;
  type?: "popular" | "trending";
  sectionTitle: string; // New prop to identify section
  countries?: VisaCountry[]; // Optional - if provided, skip API calls
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
  countries: countriesProp,
}: CountrySliderProps) => {
  const [countries, setCountries] = useState<VisaCountry[]>(countriesProp || []);
  const [loading, setLoading] = useState(!countriesProp);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<VisaCountryCarouselRef>(null);
  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();
  const router = useRouter();
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
        priceContent: item.visaCardJson?.priceContent || undefined,
      };
    });
  };

  // Update countries when prop changes
  useEffect(() => {
    if (countriesProp) {
      console.log(`[CountrySlider ${sectionTitle}] Using countries from props, skipping API calls`);
      setCountries(countriesProp);
      setLoading(false);
    }
  }, [countriesProp, sectionTitle]);

  // Load data on component mount - only if countries not provided via props
  useEffect(() => {
    // If countries provided via props, skip API calls
    if (countriesProp) {
      console.log(`[CountrySlider ${sectionTitle}] Skipping API calls - using prop data`);
      return;
    }

    if (pageLoading) {
      console.log(`[CountrySlider ${sectionTitle}] Skipping - page context still loading`);
      return;
    }

    // Early exit if data already fetched
    if (dataFetchedRef.current) {
      console.log(`[CountrySlider ${sectionTitle}] Skipping - data already fetched`);
      return;
    }

    // Mark as fetching
    dataFetchedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`[CountrySlider ${sectionTitle}] Fetching data via API (fallback)`);

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
        setCountries([]);
        dataFetchedRef.current = false; // Reset on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading, sectionTitle, countriesProp]);

  // Handle card click - validate visa availability before navigation
  const handleCardClick = async (visa: VisaCountry) => {
    try {
      // Validate country has visa data before redirecting
      const visaResponse = await fetch("/api/cms/visa-country-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: visa.id }),
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

      // Store country ID and navigate
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("applyVisaCountryId", visa.id);
          window.sessionStorage.setItem("applyVisaCountryCode", visa.countryCode);
        }
      } catch (e) {
        console.error("Error saving to sessionStorage:", e);
      }

      // Navigate to apply-visa page
      router.push("/apply-visa");
    } catch (e) {
      console.error("Failed to validate visa:", e);
      const { toast } = await import("react-toastify");
      toast.error("Failed to validate visa availability. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      direction === "left"
        ? carouselRef.current.scrollPrev()
        : carouselRef.current.scrollNext();
    }
  };

  if (loading) {
    return (
      <section className="w-full px-6 py-6">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-gray-600">Loading {title}...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 py-1">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
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

  if (countries.length === 0) {
    return (
      <section className="w-full px-6 py-1">
        <div className="max-w-[85rem] mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Destinations Available
            </h3>
            <p className="text-sm text-gray-600">
              No visa destinations available for this section at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 py-1">
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

        <VisaCountryCarousel
          ref={carouselRef}
          countries={countries}
          type={type}
          onCardClick={handleCardClick}
        />
      </div>
    </section>
  );
};

export default CountrySlider;
