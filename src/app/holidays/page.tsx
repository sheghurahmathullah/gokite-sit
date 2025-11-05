"use client";
import TopNav from "@/components/common/IconNav";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import HolidayHeroBanner from "@/components/holidayspage/HolidayHeroBanner";
import SectionHeader from "@/components/common/SectionHeader";
import DestinationCard from "@/components/common/DestinationCard";
import HolidayCarousel, {
  HolidayCarouselRef,
} from "@/components/landingpage/HolidayCarousel";
import { honeymoonSpecials, moreDestinations } from "@/data/holidaysData";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePageContext } from "@/components/common/PageContext";

const HolidaysPage = () => {
  const router = useRouter();
  const categoryCarouselRef = useRef<HolidayCarouselRef>(null);
  const honeymoonCarouselRef = useRef<HolidayCarouselRef>(null);
  const additionalCarouselRef = useRef<HolidayCarouselRef>(null);
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

  // CMS-driven sections: Honeymoon Freebies Special and Additional Destinations
  const { getPageIdWithFallback } = usePageContext();
  const [honeymoonCards, setHoneymoonCards] = useState<DestinationShape[]>([]);
  const [additionalCards, setAdditionalCards] = useState<DestinationShape[]>(
    []
  );
  const [isSectionsLoading, setIsSectionsLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSectionCards() {
      setIsSectionsLoading(true);
      try {
        const pageId = getPageIdWithFallback("holidays");
        if (!pageId) throw new Error("Missing holidays pageId");

        // 1) Get sections for the holidays page
        const sectionsRes = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId }),
        });
        if (!sectionsRes.ok) throw new Error("Failed to load pages-sections");
        const sectionsJson = await sectionsRes.json();
        const sectionsArr = Array.isArray(sectionsJson?.data)
          ? sectionsJson.data
          : [];

        // 2) Find the HOLIDAY section titled "Honeymoon Freebies Special"
        const targetSection = sectionsArr.find(
          (s: any) =>
            (s?.title || "").toLowerCase() === "honeymoon freebies special" &&
            (s?.contentType || "").toUpperCase() === "HOLIDAY"
        );
        const pageSectionId = targetSection?.pageSectionId;
        if (!pageSectionId)
          throw new Error("Missing pageSectionId for target section");

        // 3) Fetch holiday cards for that section
        const cardsRes = await fetch("/api/cms/sections-holiday-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageSectionId, limitValue: 10 }),
        });
        if (!cardsRes.ok)
          throw new Error("Failed to load sections-holiday-cards");
        const cardsJson = await cardsRes.json();
        const items: CardApiItem[] = Array.isArray(cardsJson?.data)
          ? cardsJson.data
          : [];

        // Map to DestinationCard shape
        const mapped: DestinationShape[] = items.map((item) => {
          const days = Number(item.noOfDays ?? item.cardJson?.days ?? 0) || 0;
          const nights =
            Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
          const ratingRaw =
            item.packageRating ?? item.cardJson?.packageRating ?? 0;
          const rating =
            typeof ratingRaw === "string"
              ? Number(ratingRaw) || 0
              : ratingRaw || 0;
          const currency = item.currency || "";
          const originalPrice =
            Number((item.oldPrice || "0").replace(/[, ]/g, "")) || 0;
          const finalPrice =
            Number((item.newPrice || "0").replace(/[, ]/g, "")) || 0;

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

        // Split equally between two sections
        const half = Math.ceil(mapped.length / 2);
        const firstHalf = mapped.slice(0, half);
        const secondHalf = mapped.slice(half);

        if (!cancelled) {
          setHoneymoonCards(firstHalf);
          setAdditionalCards(secondHalf);
        }
      } catch (_) {
        if (!cancelled) {
          setHoneymoonCards([]);
          setAdditionalCards([]);
        }
      } finally {
        if (!cancelled) setIsSectionsLoading(false);
      }
    }

    loadSectionCards();
    return () => {
      cancelled = true;
    };
  }, [getPageIdWithFallback]);

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
        const upstream = json?.data; // proxy wraps upstream at data
        const items: CardApiItem[] = upstream?.data ?? [];

        const mapped: DestinationShape[] = (items || []).map((item) => {
          // numbers and fallbacks
          const days = Number(item.noOfDays ?? item.cardJson?.days ?? 0) || 0;
          const nights =
            Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
          const ratingRaw =
            item.packageRating ?? item.cardJson?.packageRating ?? 0;
          const rating =
            typeof ratingRaw === "string"
              ? Number(ratingRaw) || 0
              : ratingRaw || 0;
          const currency = item.currency || "";
          const originalPrice =
            Number((item.oldPrice || "0").replace(/[, ]/g, "")) || 0;
          const finalPrice =
            Number((item.newPrice || "0").replace(/[, ]/g, "")) || 0;

          // attempt to parse counts from itineraryIcons text like "2 Flights"
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

        if (!isCancelled) setDestinations(mapped);
      } catch (_) {
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
        <HolidayHeroBanner />

        {/* Trip Packages Section */}
        <section className="mt-16 max-w-8xl mx-auto">
          {/* Background Container - extends to cover half of the cards */}
          <div className="relative">
            <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/40 rounded-3xl overflow-hidden relative">
              {/* Background Image - extends 200px to cover half of cards */}
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
                {/* Header */}
                <div className="mb-8">
                  <p className="text-white/90 text-sm mb-4">Trip Packages</p>
                  <div className="flex items-start justify-between gap-8">
                    <h2 className="text-4xl font-bold text-white max-w-md flex-shrink-0">
                      Best Recommendation Destination For You
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed flex-1">
                      Discover your next adventure with our curated list of the
                      best recommendation destinations that offer unforgettable
                      trip experiences. Whether you fancy touring around or
                      immerse yourself in the beauty of exploration, let us
                      guide you to unforgettable destinations that will create
                      lasting memories
                    </p>
                  </div>
                </div>

                {/* Category Tabs */}
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

                {/* Section Title and View All Button */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-white">
                      {categories.find((c) => c.id === selectedCategoryId)
                        ?.label || "Beaches"}
                    </h3>
                    <button
                      className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
                      onClick={() => router.push("/holiday-grid")}
                    >
                      View All
                    </button>
                  </div>
                </div>

                {/* Spacer to increase banner height */}
                <div className="h-28"></div>
              </div>
            </div>

            {/* Destination Cards - Positioned to overlap with banner */}
            <div className="relative -mt-32 px-6 lg:px-8 pb-6">
              <div className="bg-white rounded-2xl p-4">
                {isLoading ? (
                  <div className="text-center text-gray-600 text-sm bg-gray-50 rounded-2xl p-12">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="font-medium">Loading packages...</p>
                  </div>
                ) : destinations.length === 0 ? (
                  <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Data Available
                    </h3>
                    <p className="text-sm text-gray-600">
                      No packages found for{" "}
                      {categories.find((c) => c.id === selectedCategoryId)
                        ?.label || "this category"}
                      . Please try another category.
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

        {/* Honeymoon Freebies Special Section */}
        <section className="mt-4 max-w-8xl mx-auto">
          <div className="mb-6">
            <SectionHeader
              title="Honeymoon Freebies Special"
              showPagination
              totalDots={2}
              activeIndex={0}
            />
          </div>

          {isSectionsLoading ? (
            <div className="text-center text-gray-600 text-sm bg-gray-50 rounded-2xl p-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Loading packages...</p>
            </div>
          ) : honeymoonCards.length === 0 ? (
            <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Data Available
              </h3>
              <p className="text-sm text-gray-600">
                No honeymoon packages available at the moment.
              </p>
            </div>
          ) : (
            <HolidayCarousel
              ref={honeymoonCarouselRef}
              destinations={honeymoonCards}
            />
          )}
        </section>

        {/* Additional Destinations Section */}
        <section className="mt-4 max-w-8xl mx-auto">
          <div className="mb-6">
            <SectionHeader
              title=""
              showPagination
              totalDots={2}
              activeIndex={1}
            />
          </div>

          {isSectionsLoading ? (
            <div className="text-center text-gray-600 text-sm bg-gray-50 rounded-2xl p-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Loading packages...</p>
            </div>
          ) : additionalCards.length === 0 ? (
            <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Data Available
              </h3>
              <p className="text-sm text-gray-600">
                No additional packages available at the moment.
              </p>
            </div>
          ) : (
            <HolidayCarousel
              ref={additionalCarouselRef}
              destinations={additionalCards}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HolidaysPage;
