"use client";
import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HeroBanner from "@/components/holiday-grid/HeroBanner";
import FilterSidebar, {
  FilterCriteria,
} from "@/components/holiday-grid/FilterSidebar";
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

const HolidayListPage = () => {
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawApiData, setRawApiData] = useState<any[]>([]);
  const [filterResetSignal, setFilterResetSignal] = useState(0);

  // Get currency directly from API response - no conversion
  const getCurrencySymbol = (currency: string) => {
    // Return currency as-is from API, or empty string if not provided
    return currency || "";
  };

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

      // Get image URL from API or use fallback
      const getImageUrl = (imageName?: string) => {
        if (!imageName) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
        return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
      };

      // Get days and nights from cardJson first, then fall back to top-level fields
      const days = item?.cardJson?.days || parseInt(item.noOfDays) || 3;
      const nights = item?.cardJson?.nights || parseInt(item.noOfNights) || 4;

      // Get rating from cardJson first, then fall back to top-level field
      const rating = parseFloat(
        item?.cardJson?.packageRating || item.packageRating || "4.5"
      );

      return {
        id: holidayId, // This will be used as slug and stored in sessionStorage
        name: item?.cardJson?.packageName || item.title || "Holiday Package",
        image: getImageUrl(item?.cardJson?.heroImage),
        rating: rating,
        days: days,
        nights: nights,
        flights: getIconValue("flight", 2),
        hotels: getIconValue("hotel", 1) || getIconValue("accomodation", 1),
        transfers: getIconValue("transfer", 2) || getIconValue("car", 2),
        activities: getIconValue("activit", 4),
        features: (() => {
          // Get inclusions from API - ensure we're reading the correct path
          const rawInclusions = item?.cardJson?.inclusions;
          const inclusions = Array.isArray(rawInclusions) ? rawInclusions : [];

          // Always log to verify data is being read correctly - especially for cards with 4+ inclusions
          const cardName =
            item?.cardJson?.packageName || item.title || "Unknown";

          if (inclusions.length >= 4) {
            console.warn(
              `[HolidayList] ⚠️ Card "${cardName}" has ${inclusions.length} inclusions - ALL should be displayed:`,
              inclusions
            );
          } else {
            console.log(
              `[HolidayList] Card "${cardName}" has ${inclusions.length} inclusions:`,
              inclusions
            );
          }

          // Return ALL inclusions - NO SLICE, NO LIMIT
          return inclusions.length > 0
            ? inclusions
            : [
                "Tour combo with return airport transfer",
                "City Tour",
                "Sightseeing",
              ];
        })(),
        currency: getCurrencySymbol(item.currency), // Use currency from API, no hardcoded fallback
        originalPrice: oldPrice,
        finalPrice: newPrice,
        priceContent: item?.cardJson?.priceContent || "Per person",
        itineraryIcons: itineraryIcons, // Pass through the itinerary icons from API
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
      setAllDestinations(transformedDestinations);
      setDestinations(transformedDestinations);
      setFilterResetSignal((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching holiday cards:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setDestinations([]);
      setRawApiData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch holiday itinerary details by country ID
  const fetchHolidayItineraryDetails = async (countryId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cms/holiday-country-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryId: countryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch holiday country search");
      }

      const data = await response.json();
      console.log("holiday country search response", data);

      const list = Array.isArray(data?.data) ? data.data : [];

      setRawApiData(list);
      const transformedDestinations = transformHolidayData(list);
      setAllDestinations(transformedDestinations);
      setDestinations(transformedDestinations);
      setFilterResetSignal((prev) => prev + 1);

      // Try to set category from the first item's category
      if (
        list.length > 0 &&
        list[0].categoryName &&
        typeof window !== "undefined"
      ) {
        window.sessionStorage.setItem(
          "selectedHolidayCategory",
          list[0].categoryName
        );
      }
    } catch (err) {
      console.error("Error fetching holiday country search:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setDestinations([]);
      setRawApiData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch holiday city search by city ID
  const fetchHolidayCitySearch = async (cityId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cms/holiday-city-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch holiday city search");
      }

      const data = await response.json();
      const list = Array.isArray(data?.data) ? data.data : [];

      setRawApiData(list);
      const transformedDestinations = transformHolidayData(list);
      setAllDestinations(transformedDestinations);
      setDestinations(transformedDestinations);
      setFilterResetSignal((prev) => prev + 1);

      // Try to set category from the first item's category
      if (
        list.length > 0 &&
        list[0].categoryName &&
        typeof window !== "undefined"
      ) {
        window.sessionStorage.setItem(
          "selectedHolidayCategory",
          list[0].categoryName
        );
      }
    } catch (err) {
      console.error("Error fetching holiday city search:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setDestinations([]);
      setRawApiData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when category changes or on initial load
  useEffect(() => {
    // Check if we have cached API response data from the booking card search
    if (typeof window !== "undefined") {
      try {
        const cachedData = window.sessionStorage.getItem("cachedHolidaySearchData");
        const cachedTimestamp = window.sessionStorage.getItem("cachedHolidaySearchTimestamp");
        
        // Use cached data if it exists and is less than 5 minutes old
        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          if (age < 5 * 60 * 1000) { // 5 minutes
            console.log("[HolidayList] Using cached holiday search data");
            const parsedData = JSON.parse(cachedData);
            setRawApiData(parsedData);
            const transformedDestinations = transformHolidayData(parsedData);
            setAllDestinations(transformedDestinations);
            setDestinations(transformedDestinations);
            
            // Try to set category from the first item's category
            if (parsedData.length > 0 && parsedData[0].categoryName) {
              window.sessionStorage.setItem(
                "selectedHolidayCategory",
                parsedData[0].categoryName
              );
            }
            
            // Clear the cache after using it
            window.sessionStorage.removeItem("cachedHolidaySearchData");
            window.sessionStorage.removeItem("cachedHolidaySearchTimestamp");
            setLoading(false);
            setFilterResetSignal((prev) => prev + 1);
            return;
          } else {
            // Cache expired, remove it
            window.sessionStorage.removeItem("cachedHolidaySearchData");
            window.sessionStorage.removeItem("cachedHolidaySearchTimestamp");
          }
        }
      } catch (e) {
        console.error("Error reading cached holiday data:", e);
      }
    }

    // Check if we have session storage data for destination-based search
    const destinationType =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("selectedHolidayDestinationType")
        : null;

    if (destinationType === "country") {
      const countryId =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("selectedHolidayCountryId")
          : null;

      if (countryId) {
        fetchHolidayItineraryDetails(countryId);
        return;
      }
    } else if (destinationType === "city") {
      const cityId =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("selectedHolidayCityId")
          : null;

      if (cityId) {
        fetchHolidayCitySearch(cityId);
        return;
      }
    }

    // Fallback to category-based search
    const storedCategory =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("selectedHolidayCategory")
        : null;

    if (storedCategory && CATEGORY_ID_MAP[storedCategory]) {
      fetchHolidayCardsByCategory(CATEGORY_ID_MAP[storedCategory]);
    }
  }, []);

  // Listen for category changes from HeroBanner
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      const category = event.detail?.category;
      if (category && CATEGORY_ID_MAP[category]) {
        // Clear destination type to switch to category-based search
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem("selectedHolidayDestinationType");
          window.sessionStorage.removeItem("selectedHolidayCountryId");
          window.sessionStorage.removeItem("selectedHolidayCityId");
          window.sessionStorage.setItem("selectedHolidayCategory", category);
        }
        fetchHolidayCardsByCategory(CATEGORY_ID_MAP[category]);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "categoryChanged",
        handleCategoryChange as EventListener
      );

      return () => {
        window.removeEventListener(
          "categoryChanged",
          handleCategoryChange as EventListener
        );
      };
    }
  }, []);

  // Extract unique cities and categories
  const uniqueCities = Array.from(
    new Set(rawApiData.map((item) => item.cityName).filter(Boolean))
  );
  const uniqueCategories = Array.from(
    new Set(rawApiData.map((item) => item.categoryName).filter(Boolean))
  );

  // Calculate min and max prices from the data
  const prices = rawApiData
    .map((item) => parseFloat(item.newPrice || "0"))
    .filter((price) => price > 0);

  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 10000;

  // Extract the most common currency from the data
  const currencies = rawApiData.map((item) => item.currency).filter(Boolean);

  const currencyCount: Record<string, number> = {};
  currencies.forEach((curr) => {
    currencyCount[curr] = (currencyCount[curr] || 0) + 1;
  });

  // Get the most common currency
  const mostCommonCurrency =
    Object.keys(currencyCount).length > 0
      ? Object.keys(currencyCount).reduce((a, b) =>
          currencyCount[a] > currencyCount[b] ? a : b
        )
      : "";

  // Get currency directly from API response for filter - no conversion
  const getCurrencySymbolForFilter = (currency: string) => {
    // Return currency as-is from API, or empty string if not provided
    return currency || "";
  };

  const displayCurrency = getCurrencySymbolForFilter(mostCommonCurrency);

  // Filter handler - memoized to prevent infinite loop
  const handleFilterChange = useCallback(
    (filters: FilterCriteria) => {
      const filteredRaw = rawApiData.filter((item) => {
        if (filters.cityName !== "All" && item.cityName !== filters.cityName)
          return false;
        if (
          filters.categoryName !== "All" &&
          item.categoryName !== filters.categoryName
        )
          return false;
        const noOfGuests = parseInt(item.noOfGuests || "0");
        if (noOfGuests > 0 && noOfGuests < filters.minGuests) return false;
        const price = parseFloat(item.newPrice || "0");
        if (price < filters.minPrice || price > filters.maxPrice) return false;
        const rating = parseFloat(
          item.packageRating || item.cardJson?.packageRating || "0"
        );
        if (rating < filters.minRating) return false;
        if (filters.pickupRequired !== null) {
          const hasPickup = item.pickupRequired === "1";
          if (filters.pickupRequired && !hasPickup) return false;
          if (!filters.pickupRequired && hasPickup) return false;
        }
        return true;
      });
      setDestinations(transformHolidayData(filteredRaw));
    },
    [rawApiData]
  ); // Only recreate when rawApiData changes

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="relative w-full px-2 sm:px-4 max-w-[1400px] mx-auto">
        <HeroBanner />
      </div>

      <main className="container mx-auto px-4 sm:px-5 py-8 sm:py-10 max-w-[1400px]">
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
                    No destinations found for selected destination
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
              minPrice={minPrice}
              maxPrice={maxPrice}
              currency={displayCurrency}
              resetSignal={filterResetSignal}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HolidayListPage;
