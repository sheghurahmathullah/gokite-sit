"use client";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HolidayHeroBanner from "@/components/holidayspage/HolidayHeroBanner";
import SectionHeader from "@/components/common/SectionHeader";
import DestinationCard from "@/components/common/DestinationCard";
import {
  honeymoonSpecials,
  moreDestinations,
} from "@/data/holidaysData";
import { useEffect, useMemo, useState } from "react";
import { usePageContext } from "@/components/common/PageContext";

const HolidaysPage = () => {
  const categories = useMemo(
    () => [
      { id: 1, icon: "🏖️", label: "Beaches" },
      { id: 2, icon: "🎯", label: "Adventure" },
      { id: 3, icon: "🌍", label: "World Wonder" },
      { id: 4, icon: "🏛️", label: "Iconic city" },
      { id: 5, icon: "🌄", label: "Countryside" },
      { id: 6, icon: "👨‍👩‍👧", label: "Kids Wonderland" },
      { id: 7, icon: "⛷️", label: "Skiing" },
      { id: 8, icon: "🦁", label: "Wildlife" },
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
  };

  const [destinations, setDestinations] = useState<DestinationShape[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CMS-driven sections: Honeymoon Freebies Special and Additional Destinations
  const { getPageIdWithFallback } = usePageContext();
  const [honeymoonCards, setHoneymoonCards] = useState<DestinationShape[]>([]);
  const [additionalCards, setAdditionalCards] = useState<DestinationShape[]>([]);
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
        const sectionsArr = Array.isArray(sectionsJson?.data) ? sectionsJson.data : [];

        // 2) Find the HOLIDAY section titled "Honeymoon Freebies Special"
        const targetSection = sectionsArr.find(
          (s: any) =>
            (s?.title || "").toLowerCase() === "honeymoon freebies special" &&
            (s?.contentType || "").toUpperCase() === "HOLIDAY"
        );
        const pageSectionId = targetSection?.pageSectionId;
        if (!pageSectionId) throw new Error("Missing pageSectionId for target section");

        // 3) Fetch holiday cards for that section
        const cardsRes = await fetch("/api/cms/sections-holiday-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageSectionId, limitValue: 10 }),
        });
        if (!cardsRes.ok) throw new Error("Failed to load sections-holiday-cards");
        const cardsJson = await cardsRes.json();
        const items: CardApiItem[] = Array.isArray(cardsJson?.data) ? cardsJson.data : [];

        // Map to DestinationCard shape
        const mapped: DestinationShape[] = items.map((item) => {
          const days = Number(item.noOfDays ?? item.cardJson?.days ?? 0) || 0;
          const nights = Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
          const ratingRaw = item.packageRating ?? item.cardJson?.packageRating ?? 0;
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
          const nights = Number(item.noOfNights ?? item.cardJson?.nights ?? 0) || 0;
          const ratingRaw = item.packageRating ?? item.cardJson?.packageRating ?? 0;
          const rating = typeof ratingRaw === "string" ? Number(ratingRaw) || 0 : ratingRaw || 0;
          const currency = item.currency || "";
          const originalPrice = Number((item.oldPrice || "0").replace(/[, ]/g, "")) || 0;
          const finalPrice = Number((item.newPrice || "0").replace(/[, ]/g, "")) || 0;

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
          <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/40 rounded-3xl overflow-hidden relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop)",
                backgroundBlendMode: "overlay",
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
                    immerse yourself in the beauty of exploration, let us guide
                    you to unforgettable destinations that will create lasting
                    memories
                  </p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8">
                <div className="flex gap-4 overflow-x-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`flex flex-col items-center gap-2 min-w-fit px-3 py-2 rounded-lg transition-all duration-200 ${
                        category.id === selectedCategoryId
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-xs whitespace-nowrap font-medium">
                        {category.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beaches Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {categories.find((c) => c.id === selectedCategoryId)?.label || "Beaches"}
                  </h3>
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
                    View All
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Destination Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {(isLoading ? [] : destinations).map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                  ))}
                  {isLoading && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                      Loading...
                    </div>
                  )}
                  {!isLoading && destinations.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                      No packages found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Honeymoon Freebies Special Section */}
        <section className="mt-20 max-w-8xl mx-auto">
          <SectionHeader
            title="Honeymoon Freebies Special"
            showPagination
            totalDots={2}
            activeIndex={0}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isSectionsLoading ? [] : honeymoonCards).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
            {isSectionsLoading && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                Loading...
              </div>
            )}
            {!isSectionsLoading && honeymoonCards.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                No packages found.
              </div>
            )}
          </div>
        </section>

        {/* Additional Destinations Section */}
        <section className="mt-20 max-w-8xl mx-auto">
          <SectionHeader
            title=""
            showPagination
            totalDots={2}
            activeIndex={1}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isSectionsLoading ? [] : additionalCards).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
            {isSectionsLoading && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                Loading...
              </div>
            )}
            {!isSectionsLoading && additionalCards.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-white/80 text-sm">
                No packages found.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HolidaysPage;
