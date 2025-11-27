"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { MoreHorizontal } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG } from "@/lib/seo/config";

const More = () => {
  return (
    <>
      <SEOHead
        title="More Services - GoKite | Additional Travel Services"
        description="Explore more travel services from GoKite. Discover additional services to enhance your travel experience including travel insurance, car rentals, and more."
        keywords={["travel services", "additional services", "travel insurance", "car rental", "travel assistance", "GoKite services"]}
        pageName="More Services"
        canonical="/more"
        openGraph={{
          title: "More Services - GoKite",
          description: "Explore more travel services from GoKite to enhance your travel experience.",
          image: "/images/more-services-og.jpg",
          url: `${SEO_CONFIG.baseDomain}/more`,
          type: "website",
        }}
        twitter={{
          title: "More Services - GoKite",
          description: "Explore more travel services from GoKite to enhance your travel experience.",
          image: "/images/more-services-og.jpg",
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "More Services", url: `${SEO_CONFIG.baseDomain}/more` },
          ],
        }}
      />
      <WorkInProgress
        title="More Services"
        description="We're working hard to bring you more amazing travel services."
        icon={MoreHorizontal}
        colorTheme="gray"
      />
    </>
  );
};

export default More;

