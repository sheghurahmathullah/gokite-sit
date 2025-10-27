"use client";
import React, { useState, useEffect } from "react";
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

const HeroBanner = () => {
  const [bannerImages, setBannerImages] = useState<string[]>([FALLBACK_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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
        setLoading(true);

        // Fetch sections to find BANNER section for visa landing page
        const sectionsRes = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            pageId: getPageIdWithFallback("visaLanding"),
          }),
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

  // Auto-rotate banner images every 6 seconds
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
      <div className="hero-gradient rounded-[2.5rem] overflow-hidden relative min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        {/* Background image with carousel */}
        <div className="absolute inset-0">
          <img
            src={bannerImages[currentIndex] || FALLBACK_IMAGE}
            alt="Visa Banner"
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
        <div className="relative z-10 px-4 sm:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-white mb-2">
            The whole world awaits.
          </h1>
          <p className="text-center text-white/90 text-sm lg:text-base mb-8">
            Get your visa faster and efficient
          </p>
          {/* Booking Card */}
          <VisaBookingCard />

          {/* Bottom CTA */}
          <p className="text-center text-white text-sm mt-6">
            Book a meeting with our travel Agent →
          </p>
        </div>

        {/* Carousel Dots Navigation - only show if multiple images */}
        {bannerImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
