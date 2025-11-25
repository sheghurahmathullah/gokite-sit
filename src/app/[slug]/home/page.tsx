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
import { HomePageSkeleton } from "@/components/common/SkeletonLoader";

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
  visaCardCountryId?: string;
  visaCardJson: {
    image?: string;
    processing_days?: string;
    processing_time?: string;
  };
  form_fee: string;
  processing_fee: string;
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

interface BannerSection {
  pageSectionId: string;
  title: string;
  contentType: string;
}

const FALLBACK_IMAGE = "/landingpage/hero.png";

const Index = () => {
  const router = useRouter();
  const [holidaySections, setHolidaySections] = useState<SectionWithData[]>([]);
  const [visaSections, setVisaSections] = useState<SectionWithData[]>([]);
  const [bannerSection, setBannerSection] = useState<BannerSection | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false); // Track if data has been fetched
  const holidayCarouselRefs = useRef<Map<string, HolidayCarouselRef>>(
    new Map()
  );
  const visaCarouselRefs = useRef<Map<string, VisaCarouselRef>>(new Map());

  const {
    getPageIdWithFallback,
    getPageInfo,
    loading: pageLoading,
    isAuthenticated,
    initialAuthCheckDone,
  } = usePageContext();

  // Set page title dynamically and store page slug
  useEffect(() => {
    const pageInfo = getPageInfo("landing");
    if (pageInfo?.title) {
      document.title = pageInfo.title;
    }

    // Store page slug for nested routing
    if (pageInfo?.slug && typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("currentPageSlug", pageInfo.slug);
      } catch (e) {
        console.error("Failed to store page slug:", e);
      }
    }
  }, [getPageInfo]);

  // Fetch sections data
  const fetchSectionsData = async (): Promise<Section[]> => {
    try {
      console.log("[API Call] Fetching /api/cms/pages-sections");
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
      console.log("[API Call] Received pages-sections data");
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
      console.log(
        `[API Call] Fetching /api/cms/sections-holiday-cards for section: ${sectionId}`
      );
      const response = await fetch("/api/cms/sections-holiday-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageSectionId: sectionId,
          limitValue: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch holiday cards data");
      }

      const data = await response.json();
      console.log(
        `[API Call] Received holiday cards for section: ${sectionId}`
      );
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
      console.log(
        `[API Call] Fetching /api/cms/sections-visa-cards for section: ${sectionId}`
      );
      const response = await fetch("/api/cms/sections-visa-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageSectionId: sectionId,
          limitValue: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visa cards data");
      }

      const data = await response.json();
      console.log(`[API Call] Received visa cards for section: ${sectionId}`);
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      console.error("Error fetching visa cards:", err);
      throw err;
    }
  };

  // Transform holiday card data
  const transformHolidayData = (apiData: HolidayCardItem[]) => {
    // Deduplicate by holidayCardId to ensure each card appears only once
    const uniqueCards = Array.from(
      new Map(apiData.map((item) => [item.holidayCardId, item])).values()
    );

    return uniqueCards.map((item) => {
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
    // Deduplicate by visaCardId to ensure each card appears only once
    const uniqueCards = Array.from(
      new Map(apiData.map((item) => [item.visaCardId, item])).values()
    );

    return uniqueCards.map((item) => {
      // Generate image URL using the proxy endpoint
      const getImageUrl = (imageName?: string) => {
        if (!imageName) return FALLBACK_IMAGE;
        return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
      };

      // Simply map values from API response
      const formFee = parseFloat(item.form_fee || "0");
      const processingFee = parseFloat(item.processing_fee || "0");

      // Use newPrice from backend, if empty string then keep it as empty string
      const newPrice = item.newPrice?.trim() || "";
      // If newPrice exists and is not empty, use it; otherwise use empty string for price
      const priceValue =
        newPrice === ""
          ? ""
          : isNaN(parseFloat(newPrice))
          ? ""
          : parseFloat(newPrice);

      return {
        id: item.visaCardId,
        image: getImageUrl(item?.visaCardJson?.image),
        country: item.visaCardTitle,
        countryCode: item.visaCardCountryId, // Extract country code from API response
        processing_days: item.visaCardJson?.processing_days,
        processing_time: item.visaCardJson?.processing_time,
        fastTrack: item.visaCardTitle, // Simple string mapping
        priceRange: {
          currency: item.currency || "₹",
          min: formFee,
          max: processingFee,
        },
        price: priceValue,
        newPrice: newPrice, // Store the original newPrice string
        currency: item.currency,
        expiryDate: item.expiryDate,
        departureDate: "Upcoming",
        departureTime: "Flexible",
      };
    });
  };

  // Load data on component mount - only once and only if authenticated
  useEffect(() => {
    console.log(
      `[HomePage useEffect] Called - isAuthenticated: ${isAuthenticated}, pageLoading: ${pageLoading}, dataFetched: ${dataFetchedRef.current}`
    );

    // Early exit if data already fetched or still loading context
    if (dataFetchedRef.current) {
      console.log("[HomePage useEffect] Skipping - data already fetched");
      return;
    }

    if (pageLoading) {
      console.log("[HomePage useEffect] Skipping - page context still loading");
      return;
    }

    // If not authenticated, reset state and wait
    if (!isAuthenticated) {
      console.log("[HomePage useEffect] Skipping - user not authenticated");
      setHolidaySections([]);
      setVisaSections([]);
      setBannerSection(null);
      setLoading(false);
      return;
    }

    // Mark as fetching immediately to prevent race conditions
    console.log("[HomePage useEffect] Proceeding with data fetch");
    dataFetchedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Starting data fetch - this should only happen once");

        // Fetch sections first
        const sections = await fetchSectionsData();
        console.log("Fetched sections:", sections);

        // Find banner section
        const bannerFiltered = sections.find(
          (section) => section.contentType === "BANNER"
        );
        if (bannerFiltered) {
          console.log("Banner section found:", bannerFiltered);
          setBannerSection({
            pageSectionId: bannerFiltered.pageSectionId,
            title: bannerFiltered.title,
            contentType: bannerFiltered.contentType,
          });
        }

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

        // Fetch and transform holiday cards from all holiday sections in parallel
        const holidayPromises = holidayFiltered.map(async (section) => {
          const cardsData = await fetchHolidayCardsData(section.pageSectionId);
          const transformedData = transformHolidayData(cardsData);
          return {
            pageSectionId: section.pageSectionId,
            title: section.title,
            contentType: section.contentType,
            data: transformedData,
          };
        });

        // Fetch and transform visa cards from all visa sections in parallel
        const visaPromises = visaFiltered.map(async (section) => {
          const cardsData = await fetchVisaCardsData(section.pageSectionId);
          const transformedData = transformVisaData(cardsData);
          return {
            pageSectionId: section.pageSectionId,
            title: section.title,
            contentType: section.contentType,
            data: transformedData,
          };
        });

        // Execute all holiday and visa fetches in parallel
        const [holidaySectionsWithData, visaSectionsWithData] =
          await Promise.all([
            Promise.all(holidayPromises),
            Promise.all(visaPromises),
          ]);

        console.log("Holiday sections with data:", holidaySectionsWithData);
        console.log("Visa sections with data:", visaSectionsWithData);

        // Update state once with all data
        setHolidaySections(holidaySectionsWithData);
        setVisaSections(visaSectionsWithData);

        console.log("Data fetch completed successfully");
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : String(err));
        // Reset the flag on error so user can retry
        dataFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, pageLoading]); // Dependencies in stable order

  // Determine if we should show loading
  const shouldShowLoading =
    !initialAuthCheckDone || // Auth check not complete
    pageLoading || // Page context is loading
    loading; // Component is fetching data

  // Show loading state
  if (shouldShowLoading) {
    return <HomePageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-red-600 bg-red-50 rounded-2xl p-12 max-w-md">
            <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt only if we've confirmed user is not authenticated
  if (initialAuthCheckDone && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-blue-50 rounded-2xl p-12 max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Please Sign In
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Loading your holiday and visa packages...
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main>
        {/* Hero Section */}
        <HeroBanner bannerSection={bannerSection} />

        {/* Holiday Sections - Dynamic */}
        {holidaySections.length === 0 ? (
          <section className="px-6 lg:px-12 mt-5">
            <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Holiday Packages Available
              </h3>
              <p className="text-sm text-gray-600">
                No holiday destinations found at the moment. Please check back
                later.
              </p>
            </div>
          </section>
        ) : (
          holidaySections.map((section, index) => (
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
                    onClick={() => {
                      const currentPageSlug =
                        typeof window !== "undefined"
                          ? window.sessionStorage.getItem("currentPageSlug")
                          : "master-landing-page";
                      router.push(`/${currentPageSlug}/holiday-grid`);
                    }}
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

              {section.data.length === 0 ? (
                <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    No packages available for {section.title} at the moment.
                  </p>
                </div>
              ) : (
                <HolidayCarousel
                  ref={(ref) => {
                    if (ref) {
                      holidayCarouselRefs.current.set(
                        section.pageSectionId,
                        ref
                      );
                    }
                  }}
                  destinations={section.data}
                />
              )}
            </section>
          ))
        )}

        {/* Visa Sections - Dynamic */}
        {visaSections.length === 0 ? (
          <section className="px-6 lg:px-12 mt-4">
            <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Visa Packages Available
              </h3>
              <p className="text-sm text-gray-600">
                No visa destinations found at the moment. Please check back
                later.
              </p>
            </div>
          </section>
        ) : (
          visaSections.map((section) => (
            <section key={section.pageSectionId} className="px-6 lg:px-12 mt-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                  {section.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground bg-[#f2f0f0]"
                    onClick={() => {
                      const currentPageSlug =
                        typeof window !== "undefined"
                          ? window.sessionStorage.getItem("currentPageSlug")
                          : "master-landing-page";
                      router.push(`/${currentPageSlug}/visa`);
                    }}
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

              {section.data.length === 0 ? (
                <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    No packages available for {section.title} at the moment.
                  </p>
                </div>
              ) : (
                <VisaCarousel
                  ref={(ref) => {
                    if (ref) {
                      visaCarouselRefs.current.set(section.pageSectionId, ref);
                    }
                  }}
                  destinations={section.data}
                />
              )}
            </section>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
