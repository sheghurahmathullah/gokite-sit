"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import VisaBookingCard from "@/components/landingpage/VisaBookingCard";
import { usePageContext } from "@/components/common/PageContext";

const FALLBACK_IMAGE = "/landingpage/hero.png";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

const iconNavItems = [
  {
    id: "Home",
    label: "Home",
    imgSrc: "/landingpage/icons/home.png",
    redirectUrl: "/",
  },
  {
    id: "Flight",
    label: "Flight",
    imgSrc: "/landingpage/icons/flight.png",
    redirectUrl: "/flight",
  },
  {
    id: "Activities",
    label: "Activities",
    imgSrc: "/landingpage/icons/activity.png",
    redirectUrl: "#",
  },
  {
    id: "Holidays",
    label: "Holidays",
    imgSrc: "/landingpage/icons/holiday.png",
    redirectUrl: "/holidays",
  },
  {
    id: "Hotel",
    label: "Hotel",
    imgSrc: "/landingpage/icons/hotel.png",
    redirectUrl: "#",
  },
  {
    id: "Visa",
    label: "Visa",
    imgSrc: "/landingpage/icons/visa.png",
    redirectUrl: "/visa",
  },
  {
    id: "More",
    label: "More",
    imgSrc: "/landingpage/icons/more.png",
    redirectUrl: "#",
  },
];

const HeroBanner = () => {
  const pathname = usePathname();
  const [bannerImages, setBannerImages] = useState<string[]>([FALLBACK_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getPageIdWithFallback } = usePageContext();

  const isActive = (item: typeof iconNavItems[0]) => {
    if (item.redirectUrl === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.redirectUrl) && item.redirectUrl !== "#";
  };

  const getAuthHeaders = () => {
    const token = getCookie("accesstoken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    const loadBanner = async () => {
      try {
        setLoading(true);

        // Fetch sections to find BANNER section for the page
        const sectionsRes = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ pageId: getPageIdWithFallback("landing") }),
        });

        if (!sectionsRes.ok) throw new Error("Failed to load sections");

        const sectionsJson = await sectionsRes.json();
        const sections = Array.isArray(sectionsJson?.data)
          ? sectionsJson.data
          : [];
        const bannerSection = sections.find(
          (s: any) => s.contentType === "BANNER"
        );

        if (!bannerSection?.pageSectionId) {
          setBannerImages([FALLBACK_IMAGE]);
          return;
        }

        // Fetch banner details for that section
        const bannerRes = await fetch("/api/cms/section-banners", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ pageSectionId: bannerSection.pageSectionId }),
        });

        if (!bannerRes.ok) throw new Error("Failed to load banner");

        const bannerJson = await bannerRes.json();
        const bannersArr = Array.isArray(bannerJson?.data)
          ? bannerJson.data
          : [];
        const imgs = bannersArr
          .map((b: any) => b?.bannerImageUrl)
          .filter(Boolean)
          .map(
            (name: string) =>
              `/api/cms/file-download?image=${encodeURIComponent(name)}`
          );

        setBannerImages(imgs.length ? imgs : [FALLBACK_IMAGE]);
      } catch (e) {
        console.error("Failed to load banner:", e);
        setBannerImages([FALLBACK_IMAGE]);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, [getPageIdWithFallback]);

  // Auto-rotate banner images
  useEffect(() => {
    if (!bannerImages || bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [bannerImages]);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [bannerImages?.length]);

  return (
    <section className="w-full px-6 lg:px-12">
      <div className="hero-gradient rounded-[2.5rem] overflow-hidden relative min-h-[600px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={bannerImages[currentIndex] || FALLBACK_IMAGE}
            alt="Hero Banner"
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{
              objectPosition: "center 30%",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 lg:px-16 pt-12 pb-8">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-foreground mb-2">
            Travel to your Dream Destination!
          </h1>
          <p className="text-center text-foreground/80 text-sm lg:text-base mb-8">
            Flight booking made faster and efficient
          </p>

          {/* Icon Navigation */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 mb-8 flex-wrap">
            {iconNavItems.map((item) => {
              const active = isActive(item);
              return (
                <a
                  key={item.id}
                  href={item.redirectUrl}
                  className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow ${active ? "ring-4 ring-yellow-400" : ""}`}>
                    <img
                      src={item.imgSrc}
                      alt={item.label}
                      className="w-6 h-6 lg:w-12 lg:h-12 object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Booking Card */}
          <VisaBookingCard />

          {/* Bottom CTA */}
          <p className="text-center text-white text-sm mt-6">
            Book a meeting with our travel Agent →
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
