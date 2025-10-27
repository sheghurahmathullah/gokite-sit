"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopNav from "@/components/common/TopNav";
import HeroBanner from "@/components/landingpage/HeroBanner";
import DestinationCard from "@/components/common/DestinationCard";
import VisaCard from "@/components/landingpage/VisaCard";
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
  const [holidayDestinations, setHolidayDestinations] = useState<any[]>([]);
  const [visaDestinations, setVisaDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [holidayStartIndex, setHolidayStartIndex] = useState(0);
  const [visaStartIndex, setVisaStartIndex] = useState(0);

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
        rating: parseFloat(item.packageRating || "0"),
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

  // Calculate cards per view based on viewport
  useEffect(() => {
    const calculateCardsPerView = () => {
      if (typeof window === "undefined") return;
      
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(4); // lg and above
      } else if (width >= 768) {
        setCardsPerView(2); // md
      } else {
        setCardsPerView(1); // sm
      }
    };

    calculateCardsPerView();
    window.addEventListener("resize", calculateCardsPerView);
    return () => window.removeEventListener("resize", calculateCardsPerView);
  }, []);

  // Reset indices when cardsPerView changes
  useEffect(() => {
    setHolidayStartIndex(0);
    setVisaStartIndex(0);
  }, [cardsPerView]);

  // Navigation handlers - move one card at a time
  const handleHolidayPrev = () => {
    setHolidayStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleHolidayNext = () => {
    setHolidayStartIndex((prev) => 
      Math.min(prev + 1, holidayDestinations.length - cardsPerView)
    );
  };

  const handleVisaPrev = () => {
    setVisaStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleVisaNext = () => {
    setVisaStartIndex((prev) => 
      Math.min(prev + 1, visaDestinations.length - cardsPerView)
    );
  };

  // Get visible cards
  const visibleHolidayCards = holidayDestinations.slice(
    holidayStartIndex,
    holidayStartIndex + cardsPerView
  );

  const visibleVisaCards = visaDestinations.slice(
    visaStartIndex,
    visaStartIndex + cardsPerView
  );

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

        // Find holiday destinations section
        const holidaySection = sections.find(
          (section) =>
            section.title === "Popular Holiday Destination" &&
            section.contentType === "HOLIDAY"
        );

        // Find visa destinations section
        const visaSection =
          sections.find(
            (section) =>
              section.title === "home-Visa-section" &&
              section.contentType === "VISA"
          ) || sections.find((section) => section.contentType === "VISA");
        console.log("Visa section:", visaSection);

        // Fetch and transform holiday cards
        if (holidaySection) {
          const holidayCardsData = await fetchHolidayCardsData(
            holidaySection.pageSectionId
          );
          const transformedHolidayDestinations =
            transformHolidayData(holidayCardsData);
          setHolidayDestinations(transformedHolidayDestinations);
          setHolidayStartIndex(0);
        }

        // Fetch and transform visa cards
        if (visaSection) {
          const visaCardsData = await fetchVisaCardsData(
            visaSection.pageSectionId
          );
          console.log("Visa cards data:", visaCardsData);
          const transformedVisaDestinations = transformVisaData(visaCardsData);
          console.log(
            "Transformed visa destinations:",
            transformedVisaDestinations
          );
          setVisaDestinations(transformedVisaDestinations);
          setVisaStartIndex(0);
        }
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading, getPageIdWithFallback]);

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

        {/* Popular Holiday Destinations */}
        <section className="px-6 lg:px-12 mt-5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Popular Holiday Destinations
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
                onClick={handleHolidayPrev}
                disabled={holidayStartIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                onClick={handleHolidayNext}
                disabled={holidayStartIndex + cardsPerView >= holidayDestinations.length}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleHolidayCards.map((destination) => (
              <div 
                key={`${destination.id}-${holidayStartIndex}`} 
                className="h-full transition-all duration-500 ease-out opacity-100"
              >
                <DestinationCard destination={destination} />
              </div>
            ))}
          </div>
        </section>

        {/* Top Visa Destination */}
        <section className="px-6 lg:px-12 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Top Visa Destination
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground bg-[#f2f0f0]"
              >
                View All
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                onClick={handleVisaPrev}
                disabled={visaStartIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                onClick={handleVisaNext}
                disabled={visaStartIndex + cardsPerView >= visaDestinations.length}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleVisaCards.map((destination) => (
              <div 
                key={`${destination.id}-${visaStartIndex}`} 
                className="h-full transition-all duration-500 ease-out opacity-100"
              >
                <VisaCard destination={destination} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
