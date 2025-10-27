"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import TourHero from "@/components/tour/TourHero";
import TourInfoCard from "@/components/tour/TourInfoCard";
import TourOverview from "@/components/tour/TourOverview";
import PlacesCarousel from "@/components/tour/PlacesCarousel";
import TourItinerary from "@/components/tour/TourItinerary";
import WhatsIncluded from "@/components/tour/WhatsIncluded";
import TourFAQ from "@/components/tour/TourFAQ";
import HolidayEnquiryForm from "@/components/tour/HolidayEnquiryForm";

// Use local proxy; server will attach Authorization from cookie
const getAuthHeaders = () => ({ "Content-Type": "application/json" });

async function fetchHolidayDetails(holidayId: string) {
  const response = await fetch("/api/cms/holiday-itinerary-details", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ holidayId: holidayId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch holiday details");
  }

  const data = await response.json();
  console.log("Holiday Details:", data);
  return data.data || [];
}

const TourDetailPageInner = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [holidayDetails, setHolidayDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holidayId, setHolidayId] = useState<string | null>(null);

  // Resolve holidayId: prefer sessionStorage, else query param, else use slug
  useEffect(() => {
    // Try to get from sessionStorage first (highest priority)
    if (typeof window !== "undefined") {
      try {
        const stored = window.sessionStorage.getItem("holidayId");
        if (stored) {
          setHolidayId(stored);
          return;
        }
      } catch (e) {
        // ignore storage errors
      }
    }

    // Check query param as second priority
    const idFromQuery = searchParams.get("holidayId");
    if (idFromQuery) {
      setHolidayId(idFromQuery);
      return;
    }

    // Use slug as fallback
    if (params.slug) {
      setHolidayId(params.slug as string);
    }
  }, [searchParams, params.slug]);

  // Fetch holiday details
  useEffect(() => {
    if (!holidayId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchHolidayDetails(holidayId);
        console.log("Fetched data:", data);

        if (data && data.length > 0) {
          setHolidayDetails(data[0]);
        } else {
          setError("Holiday details not found");
        }
      } catch (err: any) {
        console.error("Error fetching holiday details:", err);
        setError(err.message || "Failed to load holiday details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [holidayId]);

  const handleOpenEnquiryForm = () => {
    setIsEnquiryFormOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading Holiday Details...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your holiday information
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Error Loading Holiday Details
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // No data state
  if (!holidayDetails) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-7xl mb-6 opacity-70">🏖️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Holiday destination does not exist
          </h2>
          <p className="text-gray-600 mb-6 max-w-md text-center">
            The holiday package you're looking for could not be found or may
            have been removed.
          </p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper function to get image URL
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "/img/general/fallback-image.jpg";
    return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
  };

  // Transform API data to match component props
  const transformedTourData = {
    // Hero images from cardJson
    heroImages: {
      main: getImageUrl(holidayDetails?.cardJson?.heroImage),
      side1: getImageUrl(holidayDetails?.cardJson?.subImage1),
      side2: getImageUrl(holidayDetails?.cardJson?.subImage2),
    },
    title: holidayDetails.title || "",
    location: holidayDetails.cityName || holidayDetails.location || "",
    duration: `${holidayDetails.noOfDays || 0} Days - ${
      holidayDetails.noOfNights || 0
    } Nights`,
    price: parseFloat(holidayDetails.newPrice || "0"),
    currency: holidayDetails.currency || "₹",
    rating: parseFloat(holidayDetails.packageRating || "4.7"),
    ratingText: `${holidayDetails.packageRating || "4.7"}/5`,
    // Overview data
    description: holidayDetails?.cardJson?.overview || "",
    fullDescription: holidayDetails?.cardJson?.overview || "",
    // Places from thumbnail array
    places: Array.isArray(holidayDetails?.cardJson?.thumbnail)
      ? holidayDetails.cardJson.thumbnail.map((item: any, index: number) => ({
          id: `place-${index}-${item.title || index}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.title || `Place ${index + 1}`,
          image: getImageUrl(item.image),
        }))
      : [],
    // Itinerary from cardJson
    itinerary: Array.isArray(holidayDetails?.cardJson?.itineraries)
      ? holidayDetails.cardJson.itineraries.map((item: any, index: number) => ({
          id: `day-${index + 1}-${item.title || index}-${Math.random().toString(36).substr(2, 9)}`,
          day: `Day ${index + 1}`,
          time: item.time || "",
          title: item.title || "",
          description: Array.isArray(item.descriptions)
            ? item.descriptions.map((d: any) => d?.text || "").join(" ")
            : item.description || "",
          activities: item.activities || [],
        }))
      : [],
    // What's included from cardJson
    included: Array.isArray(holidayDetails?.cardJson?.inclusions)
      ? holidayDetails.cardJson.inclusions.map((item: any, index: number) => ({
          id: `included-${index}-${item.title || index}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.title || "",
          included: true,
          description: Array.isArray(item.description)
            ? item.description.map((d: any) => d?.text || "").join(" ")
            : item.description || "",
        }))
      : [],
    // What's excluded from cardJson
    excluded: Array.isArray(holidayDetails?.cardJson?.exclusions)
      ? holidayDetails.cardJson.exclusions.map((item: any, index: number) => ({
          id: `excluded-${index}-${item.title || index}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.title || "",
          included: false,
          description: Array.isArray(item.description)
            ? item.description.map((d: any) => d?.text || "").join(" ")
            : item.description || "",
        }))
      : [],
    // FAQs from cardJson
    faqs: Array.isArray(holidayDetails?.cardJson?.faqs)
      ? holidayDetails.cardJson.faqs.map((item: any, index: number) => ({
          id: `faq-${index}-${item.question || index}-${Math.random().toString(36).substr(2, 9)}`,
          question: item.question || "",
          answer: Array.isArray(item.answers)
            ? item.answers.map((a: any) => a?.text || "").join(" ")
            : item.answer || "",
        }))
      : [],
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero Section with Images and Info Card */}
      <div className="max-w-8xl mx-auto px-6 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TourHero images={transformedTourData.heroImages} />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
            <TourInfoCard
              tour={transformedTourData}
              onEnquire={handleOpenEnquiryForm}
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-12 space-y-16">
          {/* Overview Section */}
          <TourOverview tour={transformedTourData} />

          {/* Places Carousel */}
          <PlacesCarousel places={transformedTourData.places} />

          {/* Itinerary Section */}
          <TourItinerary 
            itinerary={transformedTourData.itinerary} 
            itineraryMainDescription={holidayDetails?.cardJson?.itineraryMainDescription}
          />

          {/* What's Included Section */}
          <WhatsIncluded included={transformedTourData.included} />

          {/* What's Excluded Section */}
          {transformedTourData.excluded && transformedTourData.excluded.length > 0 && (
            <WhatsIncluded included={transformedTourData.excluded} isExcluded={true} />
          )}

          {/* FAQs Section */}
          <TourFAQ faqs={transformedTourData.faqs} />
        </div>
      </div>

      <Footer />

      {/* Holiday Enquiry Form */}
      <HolidayEnquiryForm
        open={isEnquiryFormOpen}
        onOpenChange={setIsEnquiryFormOpen}
      />
    </div>
  );
};

export default function TourDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      }
    >
      <TourDetailPageInner />
    </Suspense>
  );
}
