"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Hotel } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG } from "@/lib/seo/config";

const Hotels = () => {
  return (
    <>
      <SEOHead
        title="Hotel Booking - GoKite | Book Hotels Online at Best Prices"
        description="Book hotels online with GoKite. Find the best hotel deals worldwide. Compare prices, read reviews, and get instant confirmation. Best price guarantee on hotel bookings."
        keywords={["hotels", "hotel booking", "hotel deals", "book hotels", "hotel reservations", "hotels UAE", "Dubai hotels"]}
        pageName="Hotels"
        canonical="/hotels"
        openGraph={{
          title: "Hotel Booking - GoKite | Book Hotels Online at Best Prices",
          description: "Book hotels online with GoKite. Find the best hotel deals worldwide.",
          image: "/images/hotels-og.jpg",
          url: `${SEO_CONFIG.baseDomain}/hotels`,
          type: "website",
        }}
        twitter={{
          title: "Hotel Booking - GoKite",
          description: "Book hotels online with GoKite. Find the best hotel deals worldwide.",
          image: "/images/hotels-og.jpg",
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "Hotels", url: `${SEO_CONFIG.baseDomain}/hotels` },
          ],
        }}
      />
      <WorkInProgress
        title="Hotel Booking"
        description="We're working hard to bring you the best hotel booking experience."
        icon={Hotel}
        colorTheme="purple"
      />
    </>
  );
};

export default Hotels;

