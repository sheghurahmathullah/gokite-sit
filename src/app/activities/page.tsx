"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG } from "@/lib/seo/config";

const Activities = () => {
  return (
    <>
      <SEOHead
        title="Activities & Experiences - GoKite | Book Exciting Travel Activities"
        description="Discover and book exciting activities and experiences for your next trip. From adventure sports to cultural tours, find the perfect activities to make your journey memorable with GoKite."
        keywords={["activities", "travel experiences", "adventure activities", "tours", "sightseeing", "travel activities UAE", "Dubai activities"]}
        pageName="Activities"
        canonical="/activities"
        openGraph={{
          title: "Activities & Experiences - GoKite",
          description: "Discover and book exciting activities and experiences for your next trip.",
          image: "/images/activities-og.jpg",
          url: `${SEO_CONFIG.baseDomain}/activities`,
          type: "website",
        }}
        twitter={{
          title: "Activities & Experiences - GoKite",
          description: "Discover and book exciting activities and experiences for your next trip.",
          image: "/images/activities-og.jpg",
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "Activities", url: `${SEO_CONFIG.baseDomain}/activities` },
          ],
        }}
      />
      <WorkInProgress
        title="Activities"
        description="We're working hard to bring you the best activities and experiences."
        icon={Sparkles}
        colorTheme="orange"
      />
    </>
  );
};

export default Activities;

