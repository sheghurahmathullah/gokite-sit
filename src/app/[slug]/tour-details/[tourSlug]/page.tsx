"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import TourHero from "@/components/tour/TourHero";
import TourInfoCard from "@/components/tour/TourInfoCard";
import TourStickyNav from "@/components/tour/TourStickyNav";
import TourOverview from "@/components/tour/TourOverview";
import PlacesCarousel from "@/components/tour/PlacesCarousel";
import TourItinerary from "@/components/tour/TourItinerary";
import WhatsIncluded from "@/components/tour/WhatsIncluded";
import TourFAQ from "@/components/tour/TourFAQ";
import HolidayEnquiryForm from "@/components/tour/HolidayEnquiryForm";
import { ContentPageSkeleton } from "@/components/common/SkeletonLoader";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG, getCanonicalUrl } from "@/lib/seo/config";
import { usePageContext } from "@/components/common/PageContext";

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
  const { getPageInfo } = usePageContext();
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [holidayDetails, setHolidayDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holidayId, setHolidayId] = useState<string | null>(null);

  // Resolve holidayId: prefer sessionStorage, else query param, else use tourSlug
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

    // Use tourSlug as fallback
    if (params.tourSlug) {
      setHolidayId(params.tourSlug as string);
    }
  }, [searchParams, params.tourSlug]);

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
          const details = data[0];
          setHolidayDetails(details);
          
          // Set page title dynamically
          if (details?.title) {
            document.title = details.title;
          }
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
    return <ContentPageSkeleton />;
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
    rating: parseFloat(holidayDetails.cardJson.packageRating || "0"),
    ratingText: `${holidayDetails.cardJson.packageRating || "0"}/5`,
    priceContent: holidayDetails?.cardJson?.priceContent,
    // Overview data
    description: holidayDetails?.cardJson?.overview || "",
    fullDescription: holidayDetails?.cardJson?.overview || "",
    brochure:
      holidayDetails?.brochure || holidayDetails?.cardJson?.brochure || "",
    // Places from thumbnail array
    places: Array.isArray(holidayDetails?.cardJson?.thumbnail)
      ? holidayDetails.cardJson.thumbnail.map((item: any, index: number) => ({
          id: `place-${index}-${item.title || index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          name: item.title || `Place ${index + 1}`,
          image: getImageUrl(item.image),
        }))
      : [],
    // Itinerary from cardJson
    itinerary: Array.isArray(holidayDetails?.cardJson?.itineraries)
      ? holidayDetails.cardJson.itineraries.map((item: any, index: number) => ({
          id: `day-${index + 1}-${item.title || index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          day: `Day ${index + 1}`,
          time: item.time || "",
          title: item.title || "",
          description: Array.isArray(item.descriptions)
            ? item.descriptions.map((d: any) => d?.text || "").join(" ")
            : item.description || "",
          activities: item.activities || [],
          image: item.image ? getImageUrl(item.image) : undefined,
        }))
      : [],
    // What's included from cardJson
    included: Array.isArray(holidayDetails?.cardJson?.inclusions)
      ? holidayDetails.cardJson.inclusions.map((item: any, index: number) => ({
          id: `included-${index}-${item.title || index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
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
          id: `excluded-${index}-${item.title || index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
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
          id: `faq-${index}-${item.question || index}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          question: item.question || "",
          answer: Array.isArray(item.answers)
            ? item.answers.map((a: any) => a?.text || "").join(" ")
            : item.answer || "",
        }))
      : [],
  };

  // Get page slug for canonical URL
  const pageInfo = getPageInfo("holidays");
  const pageSlug = pageInfo?.slug || "holiday-home-page";
  const tourSlug = params.tourSlug as string;
  const canonicalPath = `/${pageSlug}/tour-details/${tourSlug}`;

  // Prepare SEO data
  const tourTitle = transformedTourData.title || holidayDetails?.title || "Tour Package";
  const tourDescription = transformedTourData.description || holidayDetails?.cardJson?.description || `Discover ${tourTitle} - Book your perfect holiday package with GoKite.`;
  // Use available hero images: main, side1, or side2
  const tourImage = transformedTourData.heroImages?.main 
    || transformedTourData.heroImages?.side1 
    || transformedTourData.heroImages?.side2 
    || (transformedTourData.places && transformedTourData.places.length > 0 ? transformedTourData.places[0].image : null)
    || getCanonicalUrl("/images/holidays/hero-sunset.jpg");
  
  // Product schema data
  const productPrice = transformedTourData.price?.toString() || "0";
  const productCurrency = transformedTourData.currency || "AED";
  // Create array of available images for product schema
  const availableImages = [
    transformedTourData.heroImages?.main,
    transformedTourData.heroImages?.side1,
    transformedTourData.heroImages?.side2,
    ...(transformedTourData.places?.map((place: any) => place.image) || [])
  ].filter(Boolean); // Remove null/undefined values
  
  const productImage = availableImages.length > 0
    ? availableImages.map((img: string) => getCanonicalUrl(img))
    : [tourImage];

  // FAQ schema
  const faqSchema = transformedTourData.faqs && transformedTourData.faqs.length > 0
    ? transformedTourData.faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer,
      }))
    : undefined;

  // Breadcrumb schema
  const breadcrumbSchema = [
    { name: "Home", url: SEO_CONFIG.baseDomain },
    { name: pageInfo?.title || "Holiday Packages", url: getCanonicalUrl(`/${pageSlug}`) },
    { name: tourTitle, url: getCanonicalUrl(canonicalPath) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${tourTitle} - GoKite | Holiday Package Details`}
        description={tourDescription}
        keywords={[
          tourTitle,
          "holiday package",
          "tour package",
          "travel package",
          "vacation",
          "GoKite",
          transformedTourData.location || "",
        ].filter(Boolean)} // Remove empty strings
        pageName={tourTitle}
        canonical={canonicalPath}
        openGraph={{
          title: `${tourTitle} - GoKite`,
          description: tourDescription,
          image: tourImage,
          url: getCanonicalUrl(canonicalPath),
          type: "product",
        }}
        twitter={{
          title: `${tourTitle} - GoKite`,
          description: tourDescription,
          image: tourImage,
        }}
        hreflang={[
          { href: `${SEO_CONFIG.countryDomains["en-ae"]}${canonicalPath}`, hreflang: "en-ae" },
          { href: `${SEO_CONFIG.countryDomains["en-in"]}${canonicalPath}`, hreflang: "en-in" },
          { href: `${SEO_CONFIG.countryDomains["en-om"]}${canonicalPath}`, hreflang: "en-om" },
        ]}
        schema={{
          product: {
            name: tourTitle,
            description: tourDescription,
            image: productImage,
            brand: "GoKite",
            offers: {
              price: productPrice,
              priceCurrency: productCurrency,
              availability: "InStock",
              url: getCanonicalUrl(canonicalPath),
            },
            ...(transformedTourData.rating && {
              aggregateRating: {
                ratingValue: typeof transformedTourData.rating === "number" ? transformedTourData.rating : parseFloat(transformedTourData.rating) || 0,
                reviewCount: 0, // Update with actual review count if available
              },
            }),
          },
          breadcrumb: breadcrumbSchema,
          faq: faqSchema,
        }}
      />
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
      </div>

      {/* Sticky Navigation */}
      <TourStickyNav />

      {/* Content Sections */}
      <div className="max-w-8xl mx-auto px-6 lg:px-24">
        <div className="space-y-16 py-8">
          {/* Overview Section */}
          <TourOverview tour={transformedTourData} />

          {/* Places Carousel */}
          <PlacesCarousel places={transformedTourData.places} />

          {/* Itinerary Section */}
          <div id="itinerary">
            <TourItinerary
              itinerary={transformedTourData.itinerary}
              itineraryMainDescription={
                holidayDetails?.cardJson?.itineraryMainDescription
              }
            />
          </div>

          {/* What's Included Section */}
          <div id="whats-included">
            <WhatsIncluded
              included={[
                ...transformedTourData.included,
                ...transformedTourData.excluded,
              ]}
            />
          </div>

          {/* FAQs Section */}
          <div id="faqs">
            <TourFAQ faqs={transformedTourData.faqs} />
          </div>
        </div>
      </div>

      <Footer />

      {/* Holiday Enquiry Form */}
      <HolidayEnquiryForm
        open={isEnquiryFormOpen}
        onOpenChange={setIsEnquiryFormOpen}
        packageId={holidayDetails?.packageId || holidayDetails?.holidayId || holidayDetails?.id}
        packageName={holidayDetails?.title || holidayDetails?.cardJson?.packageName}
      />
    </div>
  );
};

export default function TourDetailPage() {
  return (
    <Suspense
      fallback={<ContentPageSkeleton />}
    >
      <TourDetailPageInner />
    </Suspense>
  );
}

