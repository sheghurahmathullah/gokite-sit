"use client";
import { useState, useEffect } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HeroBanner from "@/components/holiday-grid/HeroBanner";
import FilterSidebar from "@/components/holiday-grid/FilterSidebar";
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
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Currency conversion and formatting
  const convertAndFormatCurrency = (amount: number, currency: string) => {
    const exchangeRates: Record<string, number> = {
      AED: 20, // 1 AED = 20 INR
      USD: 80, // 1 USD = 80 INR
      INR: 1,
    };

    const rate = exchangeRates[currency] || 1;
    const convertedAmount = Math.round(parseFloat(String(amount)) * rate);

    switch (currency) {
      case "AED":
        return `${convertedAmount.toFixed(2)} ${currency}`;
      case "INR":
      default:
        return convertedAmount;
    }
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

      return {
        id: holidayId, // This will be used as slug and stored in sessionStorage
        name: item.title || "Holiday Package",
        image: getImageUrl(item?.cardJson?.heroImage),
        rating: parseFloat(item.packageRating || "4.5"),
        days: parseInt(item.noOfDays) || 3,
        nights: parseInt(item.noOfNights) || 4,
        flights: getIconValue("flight", 2),
        hotels: getIconValue("hotel", 1) || getIconValue("accomodation", 1),
        transfers: getIconValue("transfer", 2) || getIconValue("car", 2),
        activities: getIconValue("activit", 4),
        features: item?.cardJson?.inclusions?.slice(0, 3) || [
          "Tour combo with return airport transfer",
          "City Tour",
          "Sightseeing",
        ],
        currency: "₹",
        originalPrice: convertAndFormatCurrency(
          oldPrice,
          item.currency || "INR"
        ),
        finalPrice: convertAndFormatCurrency(newPrice, item.currency || "INR"),
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

      const transformedDestinations = transformHolidayData(list);
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

      const transformedDestinations = transformHolidayData(list);
      setDestinations(transformedDestinations);
    } catch (err) {
      console.error("Error fetching holiday country search:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setDestinations([]);
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

      const transformedDestinations = transformHolidayData(list);
      setDestinations(transformedDestinations);
    } catch (err) {
      console.error("Error fetching holiday city search:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when category changes or on initial load
  useEffect(() => {
    // Check if we have session storage data for destination-based search
    const destinationType = typeof window !== "undefined" 
      ? window.sessionStorage.getItem("selectedHolidayDestinationType") 
      : null;
    
    if (destinationType === "country") {
      const countryId = typeof window !== "undefined" 
        ? window.sessionStorage.getItem("selectedHolidayCountryId") 
        : null;
      
      if (countryId) {
        fetchHolidayItineraryDetails(countryId);
        return;
      }
    } else if (destinationType === "city") {
      const cityId = typeof window !== "undefined" 
        ? window.sessionStorage.getItem("selectedHolidayCityId") 
        : null;
      
      if (cityId) {
        fetchHolidayCitySearch(cityId);
        return;
      }
    }
    
    // Fallback to category-based search
    
  }, []);


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
            <FilterSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HolidayListPage;
