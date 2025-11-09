"use client";
import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import FilterSidebar, { FilterCriteria } from "@/components/holiday-grid/FilterSidebar";
import DestinationCard from "@/components/common/DestinationCard";
import { Skeleton } from "@/components/common/SkeletonLoader";

// Fallback images if API does not provide an image
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=250&fit=crop",
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=400&h=250&fit=crop",
];

// Mapping between category names and packageCategoryId
const CATEGORY_ID_MAP: Record<string, number> = {
  Beaches: 1,
  Adventure: 2,
  "World Wonder": 3,
  "Iconic city": 4,
  Countryside: 5,
  "Kids Wonderland": 6,
  Skiing: 7,
  Wildlife: 8,
};

const HolidayGridPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Beaches");
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any[]>([]);

  // Transform holiday card data to match DestinationCard interface
  const transformHolidayData = (apiData: any[]) => {
    return apiData.map((item, index) => {
      const oldPrice = parseFloat(item.oldPrice || "0");
      const newPrice = parseFloat(item.newPrice || "0");

      // Parse itinerary icons
      const itineraryIcons = item?.cardJson?.itineraryIcons || [];
      const getIconValue = (keyword: string, fallback: number) => {
        const icon = itineraryIcons.find((icon: any) =>
          icon.text?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (icon?.text) {
          const match = icon.text.match(/(\d+)/);
          return match ? parseInt(match[1]) : fallback;
        }
        return fallback;
      };

      // Use holidayId as the primary ID for navigation
      const holidayId = item.holidayId || String(item.id);

      // Get image from API or use fallback
      const getImageUrl = (imageName?: string) => {
        if (!imageName) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
        return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
      };

      const heroImage = item?.cardJson?.heroImage;
      const imageUrl = getImageUrl(heroImage);

      return {
        id: holidayId, // This will be used as slug and stored in sessionStorage
        name: item.title || item?.cardJson?.packageName || "Holiday Package",
        image: imageUrl,
        rating: parseFloat(item?.cardJson?.packageRating || item.packageRating || "0"),
        days: parseInt(item.noOfDays || item?.cardJson?.days || "3"),
        nights: parseInt(item.noOfNights || item?.cardJson?.nights || "4"),
        flights: getIconValue("flight", 2),
        hotels: getIconValue("hotel", 1) || getIconValue("accomodation", 1),
        transfers: getIconValue("transfer", 2) || getIconValue("car", 2),
        activities: getIconValue("activit", 4),
        features: item?.cardJson?.inclusions?.slice(0, 3) || [
          "Tour combo with return airport transfer",
          "City Tour",
          "Sightseeing",
        ],
        currency: item.currency || "₹",
        originalPrice: oldPrice,
        finalPrice: newPrice,
        priceContent: item?.cardJson?.priceContent || "Per person",
        itineraryIcons: itineraryIcons,
      };
    });
  };

  // Fetch holiday cards data by category
  const fetchHolidayCardsByCategory = async (packageCategoryId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cms/holiday-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageCategoryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch holiday cards data");
      }

      const data = await response.json();
      const upstream = data?.data;
      const list = Array.isArray(upstream?.data)
        ? upstream.data
        : Array.isArray(upstream)
        ? upstream
        : [];

      setRawApiData(list);
      const transformedDestinations = transformHolidayData(list);
      console.log("transformedDestinations", transformedDestinations);
      setAllDestinations(transformedDestinations);
      setDestinations(transformedDestinations);
    } catch (err) {
      console.error("Error fetching holiday cards:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Set empty array on error
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when category changes
  useEffect(() => {
    const categoryId = CATEGORY_ID_MAP[selectedCategory] || 1;
    fetchHolidayCardsByCategory(categoryId);
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Extract unique cities and categories
  const uniqueCities = Array.from(new Set(rawApiData.map(item => item.cityName).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(rawApiData.map(item => item.categoryName).filter(Boolean)));

  // Filter handler - memoized to prevent infinite loop
  const handleFilterChange = useCallback((filters: FilterCriteria) => {
    const filteredRaw = rawApiData.filter((item) => {
      if (filters.cityName !== "All" && item.cityName !== filters.cityName) return false;
      if (filters.categoryName !== "All" && item.categoryName !== filters.categoryName) return false;
      const noOfGuests = parseInt(item.noOfGuests || "0");
      if (noOfGuests > 0 && noOfGuests < filters.minGuests) return false;
      const price = parseFloat(item.newPrice || "0");
      if (price < filters.minPrice || price > filters.maxPrice) return false;
      const rating = parseFloat(item.packageRating || item.cardJson?.packageRating || "0");
      if (rating < filters.minRating) return false;
      if (filters.pickupRequired !== null) {
        const hasPickup = item.pickupRequired === "1";
        if (filters.pickupRequired && !hasPickup) return false;
        if (!filters.pickupRequired && hasPickup) return false;
      }
      return true;
    });
    setDestinations(transformHolidayData(filteredRaw));
  }, [rawApiData]); // Only recreate when rawApiData changes

  const categories = [
    { id: 1, icon: "/holidaygrid/beach.png", label: "Beaches" },
    { id: 2, icon: "/holidaygrid/adventure.png", label: "Adventure" },
    { id: 3, icon: "/holidaygrid/world wonder.png", label: "World Wonder" },
    { id: 4, icon: "/holidaygrid/iconic city.png", label: "Iconic city" },
    { id: 5, icon: "/holidaygrid/country side.png", label: "Countryside" },
    { id: 6, icon: "/holidaygrid/kids wonderland.png", label: "Kids Wonderland" },
    { id: 7, icon: "/holidaygrid/skiing.png", label: "Skiing" },
    { id: 8, icon: "/holidaygrid/wildlife.png", label: "Wildlife" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero Section */}
      <main className="px-6 lg:px-12 py-8">
        {/* Trip Packages Section */}
        <section className="mt-8 max-w-8xl mx-auto">
          {/* Background Container - extends to cover half of the cards */}
          <div className="relative">
            <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/40 rounded-3xl overflow-hidden relative">
              {/* Background Image - extends to cover half of cards */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{
                  backgroundImage: "url('/holidaygrid/banner.jpg')",
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
                      const isActive = category.label === selectedCategory;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.label)}
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

                {/* Section Title */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-white">
                      {selectedCategory}
                    </h3>
                  </div>
                </div>

                {/* Spacer to increase banner height */}
                <div className="h-28"></div>
              </div>
            </div>

            {/* Content Container - Positioned to overlap with banner */}
            <div className="relative -mt-32 px-6 lg:px-8 pb-6">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Tour Cards Grid - 70% width */}
                <div className="w-full lg:w-[70%]">
                  {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl overflow-hidden">
                          <Skeleton className="h-64 w-full" />
                          <div className="p-4 bg-gray-50">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <p className="text-red-500 mb-2">
                          Error loading destinations
                        </p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                    </div>
                  ) : destinations.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          No destinations found for {selectedCategory}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {destinations.map((destination, index) => (
                        <DestinationCard
                          key={`${destination.id}-${index}`}
                          destination={destination}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter Sidebar - 30% width */}
                <div className="w-full lg:w-[30%]">
                  <FilterSidebar 
                    cities={uniqueCities}
                    categories={uniqueCategories}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HolidayGridPage;

