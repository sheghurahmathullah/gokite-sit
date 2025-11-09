"use client";
import TopNav from "@/components/common/IconNav";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import HolidayHeroBanner from "@/components/holidayspage/HolidayHeroBanner";
import SectionHeader from "@/components/common/SectionHeader";
import HolidayCarousel, {
  HolidayCarouselRef,
} from "@/components/landingpage/HolidayCarousel";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePageContext } from "@/components/common/PageContext";
import { CarouselSkeleton } from "@/components/common/SkeletonLoader";

const HolidaysPage = () => {
  const router = useRouter();
  const categoryCarouselRef = useRef<HolidayCarouselRef>(null);
  const categories = useMemo(
    () => [
      { id: 1, icon: "/holidaygrid/beach.png", label: "Beaches" },
      { id: 2, icon: "/holidaygrid/adventure.png", label: "Adventure" },
      { id: 3, icon: "/holidaygrid/world wonder.png", label: "World Wonder" },
      { id: 4, icon: "/holidaygrid/iconic city.png", label: "Iconic City" },
      { id: 5, icon: "/holidaygrid/country side.png", label: "CountrySide" },
      {
        id: 6,
        icon: "/holidaygrid/kids wonderland.png",
        label: "Kids Wonderland",
      },
      { id: 7, icon: "/holidaygrid/skiing.png", label: "Skiing" },
      { id: 8, icon: "/holidaygrid/wildlife.png", label: "Wildlife" },
    ],
    []
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const stored = window.sessionStorage.getItem("selectedPackageCategoryId");
    return stored ? Number(stored) || 1 : 1;
  });

  type CardApiItem = {
    holidayId: string;
    title?: string;
    currency?: string;
    oldPrice?: string;
    newPrice?: string;
    noOfDays?: string;
    noOfNights?: string;
    packageRating?: string | number;
    cardJson?: {
      days?: number;
      nights?: number;
      heroImage?: string;
      inclusions?: string[];
      packageName?: string;
      priceContent?: string;
      packageRating?: number;
      itineraryIcons?: { text?: string; image?: string }[];
    };
  };

  type DestinationShape = {
    id?: string;
    name: string;
    image: string;
    rating: number;
    days: number;
    nights: number;
    flights: number;
    hotels: number;
    transfers: number;
    activities: number;
    features?: string[];
    currency: string;
    originalPrice: number;
    finalPrice: number;
    priceContent?: string;
    itineraryIcons?: { text?: string; image?: string }[];
  };

  const [destinations, setDestinations] = useState<DestinationShape[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CMS-driven sections: Dynamic Holiday Sections
  const { getPageIdWithFallback, getPageInfo, loading: pageLoading, isAuthenticated } = usePageContext();

  // Set page title dynamically and store page slug
  useEffect(() => {
    const pageInfo = getPageInfo("holidays");
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

  // New structure for dynamic sections
  interface SectionWithData {
    pageSectionId: string;
    title: string;
    contentType: string;
    data: DestinationShape[];
  }

  interface BannerSection {
    pageSectionId: string;
    title: string;
    contentType: string;
  }

  const [dynamicSections, setDynamicSections] = useState<SectionWithData[]>([]);
  const [bannerSection, setBannerSection] = useState<BannerSection | null>(null);
  const [isSectionsLoading, setIsSectionsLoading] = useState<boolean>(false);
  const dataFetchedRef = useRef(false);
  const dynamicCarouselRefs = useRef<Map<string, HolidayCarouselRef>>(
    new Map()
  );

  useEffect(() => {
    let cancelled = false;
    
    async function loadSectionCards() {
      if (pageLoading || dataFetchedRef.current) return;
      if (!isAuthenticated) {
        setDynamicSections([]);
        setBannerSection(null);
        setIsSectionsLoading(false);
        return;
      }
      
      dataFetchedRef.current = true;
      setIsSectionsLoading(true);
      
      try {
        const pageId = getPageIdWithFallback("holidays");
        if (!pageId) throw new Error("Missing holidays pageId");

        const sectionsRes = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId }),
        });
        if (!sectionsRes.ok) throw new Error("Failed to load pages-sections");
        const sectionsJson = await sectionsRes.json();
        const sectionsArr = Array.isArray(sectionsJson?.data) ? sectionsJson.data : [];

        const bannerFiltered = sectionsArr.find((section: any) => section.contentType === "BANNER");
        if (bannerFiltered) {
          setBannerSection({
            pageSectionId: bannerFiltered.pageSectionId,
            title: bannerFiltered.title,
            contentType: bannerFiltered.contentType,
          });
        }

        const holidaySections = sectionsArr.filter((section: any) => section.contentType === "HOLIDAY");

        if (holidaySections.length > 0) {
          const sectionsPromises = holidaySections.map(async (section: any) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 30000);
              
              const cardsRes = await fetch("/api/cms/sections-holiday-cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  pageSectionId: section.pageSectionId,
                  limitValue: 10,
                }),
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              if (!cardsRes.ok) {
                return {
                  pageSectionId: section.pageSectionId,
                  title: section.title,
                  contentType: section.contentType,
                  data: [],
                };
              }

              const cardsJson = await cardsRes.json();
              const items: CardApiItem[] = Array.isArray(cardsJson?.data) ? cardsJson.data : [];

              const mapped: DestinationShape[] = items.map((item) => {
                const days = Number(item.noOfDays ?? item.cardJson?.days ?? 0) || 0;
                const nights = Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
                const ratingRaw = item.cardJson?.packageRating ?? item.packageRating ?? 0;
                const rating = typeof ratingRaw === "string" ? Number(ratingRaw) || 0 : ratingRaw || 0;
                const currency = item.currency || "";
                const originalPrice = Number((item.oldPrice || "0").replace(/[, ]/g, "")) || 0;
                const finalPrice = Number((item.newPrice || "0").replace(/[, ]/g, "")) || 0;

                const getCount = (label: string) => {
                  const match = (item.cardJson?.itineraryIcons || []).find(
                    (i) => (i.text || "").toLowerCase().includes(label)
                  );
                  const m = match?.text?.match(/(\d+)/);
                  return m ? Number(m[1]) : 0;
                };

                const flights = getCount("flight");
                const hotels = getCount("accomodation") || getCount("hotel");
                const transfers = getCount("car") || getCount("transfer");
                const activities = getCount("activit");

                const imageName = item.cardJson?.heroImage || "";
                const image = imageName
                  ? `/api/cms/file-download?image=${encodeURIComponent(imageName)}`
                  : "/images/holidays/hero-sunset.jpg";

                return {
                  id: item.holidayId,
                  name: item.title || item.cardJson?.packageName || "",
                  image,
                  rating,
                  days,
                  nights,
                  flights,
                  hotels,
                  transfers,
                  activities,
                  features: item.cardJson?.inclusions || [],
                  currency,
                  originalPrice,
                  finalPrice,
                  priceContent: item.cardJson?.priceContent,
                  itineraryIcons: item.cardJson?.itineraryIcons || [],
                };
              });

              return {
                pageSectionId: section.pageSectionId,
                title: section.title,
                contentType: section.contentType,
                data: mapped,
              };
            } catch (error: any) {
              return {
                pageSectionId: section.pageSectionId,
                title: section.title,
                contentType: section.contentType,
                data: [],
              };
            }
          });

          const results = await Promise.allSettled(sectionsPromises);
          const sectionsWithData = results
            .filter((result) => result.status === 'fulfilled')
            .map((result: any) => result.value);

          setDynamicSections(sectionsWithData);
        }
      } catch (err) {
        dataFetchedRef.current = false;
        setDynamicSections([]);
        setBannerSection(null);
      } finally {
        setIsSectionsLoading(false);
      }
    }

    loadSectionCards();
    return () => {
      cancelled = true;
    };
  }, [pageLoading, isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(
          "selectedPackageCategoryId",
          String(selectedCategoryId)
        );
      } catch (_) {}
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchCategory() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cms/holiday-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageCategoryId: selectedCategoryId }),
        });
        const json = await res.json();

        let items: CardApiItem[] = [];
        if (Array.isArray(json?.data?.data)) {
          items = json.data.data;
        } else if (Array.isArray(json?.data)) {
          items = json.data;
        } else if (Array.isArray(json)) {
          items = json;
        }

        const mapped: DestinationShape[] = (items || []).map((item) => {
          const days = Number(item.noOfDays ?? item.cardJson?.days ?? 0) || 0;
          const nights = Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
          const ratingRaw = item.cardJson?.packageRating ?? item.packageRating ?? 0;
          const rating = typeof ratingRaw === "string" ? Number(ratingRaw) || 0 : ratingRaw || 0;
          const currency = item.currency || "";
          const originalPrice = Number((item.oldPrice || "0").replace(/[, ]/g, "")) || 0;
          const finalPrice = Number((item.newPrice || "0").replace(/[, ]/g, "")) || 0;

          const getCount = (label: string) => {
            const match = (item.cardJson?.itineraryIcons || []).find((i) =>
              (i.text || "").toLowerCase().includes(label)
            );
            const m = match?.text?.match(/(\d+)/);
            return m ? Number(m[1]) : 0;
          };

          const flights = getCount("flight");
          const hotels = getCount("accomodation") || getCount("hotel");
          const transfers = getCount("car") || getCount("transfer");
          const activities = getCount("activit");

          const imageName = item.cardJson?.heroImage || "";
          const image = imageName
            ? `/api/cms/file-download?image=${encodeURIComponent(imageName)}`
            : "/images/holidays/hero-sunset.jpg";

          return {
            id: item.holidayId,
            name: item.title || item.cardJson?.packageName || "",
            image,
            rating,
            days,
            nights,
            flights,
            hotels,
            transfers,
            activities,
            features: item.cardJson?.inclusions || [],
            currency,
            originalPrice,
            finalPrice,
            priceContent: item.cardJson?.priceContent,
            itineraryIcons: item.cardJson?.itineraryIcons || [],
          };
        });

        if (!isCancelled) {
          setDestinations(mapped);
        }
      } catch (error) {
        console.error("Error fetching holiday categories:", error);
        if (!isCancelled) setDestinations([]);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    fetchCategory();
    return () => {
      isCancelled = true;
    };
  }, [selectedCategoryId]);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero Section */}
      <main className="px-6 lg:px-12 py-8">
        <HolidayHeroBanner bannerSection={bannerSection} />

        {/* Trip Packages Section */}
        <section className="mt-16 max-w-8xl mx-auto">
          <div className="relative">
            <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/40 rounded-3xl overflow-hidden relative">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop)",
                  backgroundBlendMode: "overlay",
                  height: "calc(100% + 400px)",
                }}
              />

              <div className="relative z-10 p-6 lg:p-8">
                <div className="mb-8">
                  <p className="text-white/90 text-sm mb-4">Trip Packages</p>
                  <div className="flex items-start justify-between gap-8">
                    <h2 className="text-4xl font-bold text-white max-w-md flex-shrink-0">
                      Best Recommendation Destination For You
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed flex-1">
                      Discover your next adventure with our curated list of the
                      best recommendation destinations that offer unforgettable
                      trip experiences.
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-3 sm:py-4 mb-8 border border-white/20">
                  <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => {
                      const isActive = category.id === selectedCategoryId;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(category.id)}
                          className={`group flex-1 flex flex-col items-center justify-center px-1.5 sm:px-2 md:px-3 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 min-w-0 flex-shrink-0 ${
                            isActive
                              ? "text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 sm:gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 flex items-center justify-center">
                              <img
                                src={category.icon}
                                alt={category.label}
                                className="w-full h-full object-contain filter brightness-0 invert"
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap text-center">
                              {category.label}
                            </span>
                          </div>
                          {isActive && (
                            <div className="mt-1 sm:mt-2 w-5 sm:w-6 md:w-8 h-0.5 sm:h-1 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-white">
                      {categories.find((c) => c.id === selectedCategoryId)?.label || "Beaches"}
                    </h3>
                    <button
                      className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
                      onClick={() => {
                        const currentPageSlug = typeof window !== "undefined" 
                          ? window.sessionStorage.getItem("currentPageSlug") 
                          : "holiday-home-page";
                        router.push(`/${currentPageSlug}/holiday-grid`);
                      }}
                    >
                      View All
                    </button>
                  </div>
                </div>

                <div className="h-28"></div>
              </div>
            </div>

            <div className="relative -mt-32 px-6 lg:px-8 pb-6">
              <div className="bg-white rounded-2xl p-4">
                {isLoading ? (
                  <CarouselSkeleton />
                ) : destinations.length === 0 ? (
                  <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Data Available
                    </h3>
                    <p className="text-sm text-gray-600">
                      No packages found for this category.
                    </p>
                  </div>
                ) : (
                  <HolidayCarousel
                    ref={categoryCarouselRef}
                    destinations={destinations}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Holiday Sections */}
        {isSectionsLoading ? (
          <CarouselSkeleton />
        ) : dynamicSections.length === 0 ? (
          <section className="mt-4 px-6 lg:px-12">
            <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Additional Sections Available
              </h3>
              <p className="text-sm text-gray-600">
                No additional holiday sections found at the moment.
              </p>
            </div>
          </section>
        ) : (
          dynamicSections.map((section, index) => (
            <section
              key={section.pageSectionId}
              className="mt-4 max-w-8xl mx-auto"
            >
              <div className="mb-6">
                <SectionHeader
                  title={section.title}
                  showPagination={dynamicSections.length > 1}
                  totalDots={dynamicSections.length}
                  activeIndex={index}
                  onPrevious={() =>
                    dynamicCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollPrev()
                  }
                  onNext={() =>
                    dynamicCarouselRefs.current
                      .get(section.pageSectionId)
                      ?.scrollNext()
                  }
                />
              </div>

              {section.data.length === 0 ? (
                <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Data Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    No packages available for this section at the moment.
                  </p>
                </div>
              ) : (
                <HolidayCarousel
                  ref={(ref) => {
                    if (ref) {
                      dynamicCarouselRefs.current.set(
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
      </main>

      <Footer />
    </div>
  );
};

export default HolidaysPage;

