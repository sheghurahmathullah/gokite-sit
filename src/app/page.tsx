"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopNav from "@/components/common/TopNav";
import HeroBanner from "@/components/landingpage/HeroBanner";
import HolidayCarousel, {
  HolidayCarouselRef,
} from "@/components/landingpage/HolidayCarousel";
import VisaCarousel, {
  VisaCarouselRef,
} from "@/components/landingpage/VisaCarousel";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { usePageContext } from "@/components/common/PageContext";

// Define types for API responses
interface HolidayCardItem {
  holidayCardId: string;
  title: string;
  cardJson: {
    heroImage?: string;
    inclusions?: string[];
    priceContent?: string;
    packageRating?: number;
  };
  packageRating: string;
  noOfDays: string;
  noOfNights: string;
  oldPrice: string;
  newPrice: string;
  currency: string;
}

interface VisaCardItem {
  visaCardId: string;
  visaCardTitle: string;
  visaCardJson: {
    image?: string;
    processing_days?: string;
  };
  oldPrice: string;
  newPrice: string;
  currency: string;
  expiryDate?: string;
}

interface Section {
  pageSectionId: string;
  title: string;
  contentType: string;
}

interface SectionWithData {
  pageSectionId: string;
  title: string;
  contentType: string;
  data: any[];
}

// Helper to read cookie on client
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

const FALLBACK_IMAGE = "/landingpage/hero.png";

const Index = () => {
  const router = useRouter();
  const [holidaySections, setHolidaySections] = useState<SectionWithData[]>([]);
  const [visaSections, setVisaSections] = useState<SectionWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const holidayCarouselRefs = useRef<Map<string, HolidayCarouselRef>>(new Map());
  const visaCarouselRefs = useRef<Map<string, VisaCarouselRef>>(new Map());

  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();

  const getAuthHeaders = () => {
    const token = getCookie("accesstoken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Fetch sections data
  const fetchSectionsData = async (): Promise<Section[]> => {
    try {
      const sectionsResponse = await fetch("/api/cms/pages-sections", {
        method: "POST",
        body: JSON.stringify({
          pageId: getPageIdWithFallback("landing"),
        }),
      });

      if (!sectionsResponse.ok) {
        throw new Error("Failed to fetch sections data");
      }

      const sectionsData = await sectionsResponse.json();
      return sectionsData.data || [];
    } catch (err) {
      console.error("Error fetching sections:", err);
      throw err;
    }
  };

  // Fetch holiday cards data
  const fetchHolidayCardsData = async (
    sectionId: string
  ): Promise<HolidayCardItem[]> => {
    try {
      const response = await fetch("/api/cms/sections-holiday-cards", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pageSectionId: sectionId,
          limitValue: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch holiday cards data");
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("Error fetching holiday cards:", err);
      throw err;
    }
  };

  // Fetch visa cards data
  const fetchVisaCardsData = async (
    sectionId: string
  ): Promise<VisaCardItem[]> => {
    try {
      const response = await fetch("/api/cms/sections-visa-cards", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pageSectionId: sectionId,
          limitValue: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visa cards data");
      }

      const data = await response.json();
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("Error fetching visa cards:", err);
      throw err;
    }
  };

  // Transform holiday card data
  const transformHolidayData = (apiData: HolidayCardItem[]) => {
    return apiData.map((item) => {
      const getImageUrl = (imageName?: string) => {
        if (!imageName) return FALLBACK_IMAGE;
        return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
      };

      return {
        id: item.holidayCardId,
        name: item.title,
        image: getImageUrl(item?.cardJson?.heroImage),
        rating: item.cardJson?.packageRating 
          ? parseFloat(String(item.cardJson.packageRating)) 
          : parseFloat(item.packageRating || "0"),
        days: parseInt(item.noOfDays || "0"),
        nights: parseInt(item.noOfNights || "0"),
        flights: 2,
        hotels: 1,
        transfers: 2,
        activities: 4,
        features: item.cardJson?.inclusions || [],
        originalPrice: parseFloat(item.oldPrice || "0"),
        finalPrice: parseFloat(item.newPrice || "0"),
        currency: item.currency || "₹",
        priceContent: item.cardJson?.priceContent,
      };
    });
  };

  // Transform visa card data
  const transformVisaData = (apiData: VisaCardItem[]) => {
    const EXTRA_CHARGES = 8500; // Fixed extra charges

    return apiData.map((item) => {
      // Calculate get on date based on processing days
      const getOnDate = new Date();
      getOnDate.setDate(
        getOnDate.getDate() +
          parseInt(item.visaCardJson.processing_days || "10")
      );

      // Calculate total price
      const basePrice = parseFloat(item.newPrice);
      const oldPrice = parseFloat(item.oldPrice);
      const totalPrice = basePrice + EXTRA_CHARGES;

      // Generate image URL using the proxy endpoint
      const getImageUrl = (imageName?: string) => {
        if (!imageName) return FALLBACK_IMAGE;
        return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
      };

      return {
        id: item.visaCardId,
        image: getImageUrl(item?.visaCardJson?.image),
        country: item.visaCardTitle,
        fastTrack: {
          originalPrice: `₹${Math.round(oldPrice)}`, // Remove decimal places
          extraCharges: `₹${EXTRA_CHARGES}`,
          totalPrice: `₹${Math.round(totalPrice)}`, // Remove decimal places
          date: getOnDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        getOn: {
          date: getOnDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: `₹${Math.round(basePrice)}`, // Remove decimal places
        },
        currency: item.currency,
        expiryDate: item.expiryDate,
        priceRange: {
          currency: item.currency || "₹",
          min: parseFloat(item.oldPrice || "0"),
          max: parseFloat(item.newPrice || "0"),
        },
        price: parseFloat(item.newPrice || "0"),
        departureDate: "Upcoming",
        departureTime: "Flexible",
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

        // Fetch sections first
        const sections = await fetchSectionsData();
        console.log("Fetched sections:", sections);

        // Find all holiday destinations sections
        const holidayFiltered = sections.filter(
          (section) => section.contentType === "HOLIDAY"
        );

        // Find all visa destinations sections
        const visaFiltered = sections.filter(
          (section) => section.contentType === "VISA"
        );
        console.log("Holiday sections:", holidayFiltered);
        console.log("Visa sections:", visaFiltered);

        // Fetch and transform holiday cards from all holiday sections
        if (holidayFiltered.length > 0) {
          const holidaySectionsWithData = await Promise.all(
            holidayFiltered.map(async (section) => {
              const cardsData = await fetchHolidayCardsData(section.pageSectionId);
              const transformedData = transformHolidayData(cardsData);
              return {
                pageSectionId: section.pageSectionId,
                title: section.title,
                contentType: section.contentType,
                data: transformedData,
              };
            })
          );
          setHolidaySections(holidaySectionsWithData);
        }

        // Fetch and transform visa cards from all visa sections
        if (visaFiltered.length > 0) {
          const visaSectionsWithData = await Promise.all(
            visaFiltered.map(async (section) => {
              const cardsData = await fetchVisaCardsData(section.pageSectionId);
              const transformedData = transformVisaData(cardsData);
              return {
                pageSectionId: section.pageSectionId,
                title: section.title,
                contentType: section.contentType,
                data: transformedData,
              };
            })
          );
          console.log("Visa sections with data:", visaSectionsWithData);
          setVisaSections(visaSectionsWithData);
        }
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main>
        {/* Hero Section */}
        <HeroBanner />

        {/* Holiday Sections - Dynamic */}
        {holidaySections.map((section, index) => (
          <section
            key={section.pageSectionId}
            className={`px-6 lg:px-12 ${index === 0 ? "mt-5" : "mt-4"}`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {section.title}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground bg-[#f2f0f0]"
                  onClick={() => router.push("/holiday-grid")}
                >
                  View All
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  onClick={() =>
                    holidayCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollPrev()
                  }
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  onClick={() =>
                    holidayCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollNext()
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <HolidayCarousel
              ref={(ref) => {
                if (ref) {
                  holidayCarouselRefs.current.set(section.pageSectionId, ref);
                }
              }}
              destinations={section.data}
            />
          </section>
        ))}

        {/* Visa Sections - Dynamic */}
        {visaSections.map((section) => (
          <section
            key={section.pageSectionId}
            className="px-6 lg:px-12 mt-4"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {section.title}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground bg-[#f2f0f0]"
                  onClick={() => router.push("/visa")}
                >
                  View All
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  onClick={() =>
                    visaCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollPrev()
                  }
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                  onClick={() =>
                    visaCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollNext()
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <VisaCarousel
              ref={(ref) => {
                if (ref) {
                  visaCarouselRefs.current.set(section.pageSectionId, ref);
                }
              }}
              destinations={section.data}
            />
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
