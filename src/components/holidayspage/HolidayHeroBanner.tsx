"use client";
import React, { useState, useEffect } from "react";
import HolidayBookingCard from "@/components/holidayspage/HolidayBookingCard";
import { usePageContext } from "@/components/common/PageContext";

const FALLBACK_IMAGE = "/images/holidays/hero-sunset.jpg";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

const HolidayHeroBanner = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([FALLBACK_IMAGE]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getPageIdWithFallback } = usePageContext();

  const getAuthHeaders = () => {
    const token = getCookie("accesstoken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Load banner images from CMS
  useEffect(() => {
    const loadBanner = async () => {
      try {
        // Fetch sections to find BANNER section
        const sectionsRes = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ pageId: getPageIdWithFallback("holidays") }),
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

        // Fetch banner details
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
      }
    };

    loadBanner();
  }, [getPageIdWithFallback]);

  // Auto-play carousel
  useEffect(() => {
    if (bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        setTimeout(() => setIsTransitioning(false), 1000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length, isTransitioning]);

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <div className="relative w-full min-h-[400px]">
      {/* Hero Container with Carousel */}
      <div className="relative w-full rounded-3xl overflow-hidden px-6 lg:px-12 pt-12 pb-12 min-h-[460px]">
        {/* Carousel Slides */}
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              pointerEvents: index === currentSlide ? "auto" : "none",
            }}
          >
            <img
              src={image}
              alt={`Holiday Banner ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center" }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        ))}

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            A Lifetime Memory of Holidays
          </h1>
          <p className="text-lg lg:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Plan your holiday with our Tailored Packages for your Solo Trip,
            Honeymoon, Family Trip, Corporate Workstation
          </p>

          {/* Booking Card */}
          <div className="mb-8">
            <HolidayBookingCard />
          </div>

          {/* Bottom CTA */}
          <p className="text-white/90 text-sm">
            Book a meeting with our travel Agent →
          </p>
        </div>

        {/* Carousel Dots Navigation */}
        {bannerImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayHeroBanner;
