"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import VisaBookingCard from "@/components/landingpage/VisaBookingCard";

const FALLBACK_IMAGE = "/landingpage/hero.png";

// Static slug mappings - no extra API calls needed
const PAGE_SLUGS = {
  home: "/master-landing-page",
  holidays: "/holiday-home-page",
  visa: "/visa-landing-page",
};

interface BannerSection {
  pageSectionId: string;
  title: string;
  contentType: string;
}

interface HeroBannerProps {
  bannerSection: BannerSection | null;
}

const iconNavItems = [
  {
    id: "Home",
    label: "Home",
    imgSrc: "/landingpage/icons/home.png",
    redirectUrl: PAGE_SLUGS.home,
  },
  {
    id: "Flight",
    label: "Flight",
    imgSrc: "/landingpage/icons/flight.png",
    redirectUrl: "#",
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
    redirectUrl: PAGE_SLUGS.holidays,
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
    redirectUrl: PAGE_SLUGS.visa,
  },
  {
    id: "More",
    label: "More",
    imgSrc: "/landingpage/icons/more.png",
    redirectUrl: "#",
  },
];

const HeroBanner: React.FC<HeroBannerProps> = ({ bannerSection }) => {
  const pathname = usePathname();
  const [bannerImages, setBannerImages] = useState<string[]>([FALLBACK_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const bannerFetchedRef = useRef(false); // Track if banner has been fetched
  const lastFetchedSectionIdRef = useRef<string | null>(null); // Track which section was fetched

  const isActive = (item: typeof iconNavItems[0]) => {
    if (item.redirectUrl === PAGE_SLUGS.home) {
      return pathname === "/" || pathname === PAGE_SLUGS.home;
    }
    if (item.redirectUrl === PAGE_SLUGS.holidays) {
      return pathname === "/holidays" || pathname === PAGE_SLUGS.holidays;
    }
    if (item.redirectUrl === PAGE_SLUGS.visa) {
      return pathname === "/visa" || pathname === PAGE_SLUGS.visa;
    }
    return pathname.startsWith(item.redirectUrl) && item.redirectUrl !== "#";
  };

  useEffect(() => {
    const loadBanner = async () => {
      try {
        console.log("[HeroBanner useEffect] Called - bannerSection:", bannerSection, "alreadyFetched:", bannerFetchedRef.current);

        // If no banner section provided, use fallback
        if (!bannerSection?.pageSectionId) {
          console.log("[HeroBanner] No banner section, using fallback");
          setBannerImages([FALLBACK_IMAGE]);
          setLoading(false);
          return;
        }

        // Check if we've already fetched this section's data
        if (bannerFetchedRef.current && lastFetchedSectionIdRef.current === bannerSection.pageSectionId) {
          console.log("[HeroBanner] Skipping - banner already fetched for section:", bannerSection.pageSectionId);
          return;
        }

        // Mark as fetched immediately to prevent race conditions
        console.log("[HeroBanner] Proceeding with banner fetch");
        bannerFetchedRef.current = true;
        lastFetchedSectionIdRef.current = bannerSection.pageSectionId;
        setLoading(true);

        // Fetch banner details for that section
        console.log("[API Call] Fetching /api/cms/section-banners for section:", bannerSection.pageSectionId);
        const bannerRes = await fetch("/api/cms/section-banners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageSectionId: bannerSection.pageSectionId }),
        });

        if (!bannerRes.ok) throw new Error("Failed to load banner");

        const bannerJson = await bannerRes.json();
        console.log("[API Call] Received banner data");
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
        // Reset the flag on error so user can retry
        bannerFetchedRef.current = false;
        lastFetchedSectionIdRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, [bannerSection]);

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
              const isHashLink = item.redirectUrl === "#";
              
              return isHashLink ? (
                <button
                  key={item.id}
                  onClick={(e) => e.preventDefault()}
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
                </button>
              ) : (
                <Link
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
                </Link>
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
