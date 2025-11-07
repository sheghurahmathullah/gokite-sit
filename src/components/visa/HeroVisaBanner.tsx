"use client";
import React, { useState, useEffect, useRef } from "react";
import VisaBookingCard from "@/components/landingpage/VisaBookingCard";

const FALLBACK_IMAGE = "/landingpage/hero.png";

interface BannerSection {
  pageSectionId: string;
  title: string;
  contentType: string;
}

interface HeroVisaBannerProps {
  bannerSection: BannerSection | null;
}

const HeroBanner: React.FC<HeroVisaBannerProps> = ({ bannerSection }) => {
  const [bannerImages, setBannerImages] = useState<string[]>([FALLBACK_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const bannerFetchedRef = useRef(false); // Track if banner has been fetched
  const lastFetchedSectionIdRef = useRef<string | null>(null); // Track which section was fetched

  // Load banner images from CMS
  useEffect(() => {
    const loadBanner = async () => {
      try {
        console.log("[HeroVisaBanner useEffect] Called - bannerSection:", bannerSection, "alreadyFetched:", bannerFetchedRef.current);

        // If no banner section provided, use fallback
        if (!bannerSection?.pageSectionId) {
          console.log("[HeroVisaBanner] No banner section, using fallback");
          setBannerImages([FALLBACK_IMAGE]);
          setLoading(false);
          return;
        }

        // Check if we've already fetched this section's data
        if (bannerFetchedRef.current && lastFetchedSectionIdRef.current === bannerSection.pageSectionId) {
          console.log("[HeroVisaBanner] Skipping - banner already fetched for section:", bannerSection.pageSectionId);
          return;
        }

        // Mark as fetched immediately to prevent race conditions
        console.log("[HeroVisaBanner] Proceeding with banner fetch");
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
    <section className="w-full px-6 lg:px-12 pb-5">
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
