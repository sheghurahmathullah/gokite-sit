"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Plane } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG } from "@/lib/seo/config";

const Flights = () => {
  return (
    <>
      <SEOHead
        title="Flight Booking - GoKite | Book Cheap Flights Online"
        description="Book cheap flights online with GoKite. Compare prices, find the best deals on domestic and international flights. Get instant confirmation and best prices guaranteed."
        keywords={["flights", "flight booking", "cheap flights", "airline tickets", "flight deals", "book flights UAE", "Dubai flights"]}
        pageName="Flights"
        canonical="/flights"
        openGraph={{
          title: "Flight Booking - GoKite | Book Cheap Flights Online",
          description: "Book cheap flights online with GoKite. Compare prices and find the best deals.",
          image: "/images/flights-og.jpg",
          url: `${SEO_CONFIG.baseDomain}/flights`,
          type: "website",
        }}
        twitter={{
          title: "Flight Booking - GoKite",
          description: "Book cheap flights online with GoKite. Compare prices and find the best deals.",
          image: "/images/flights-og.jpg",
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "Flights", url: `${SEO_CONFIG.baseDomain}/flights` },
          ],
        }}
      />
      <WorkInProgress
        title="Flight Booking"
        description="We're working hard to bring you the best flight booking experience."
        icon={Plane}
        colorTheme="blue"
      />
    </>
  );
};

export default Flights;

