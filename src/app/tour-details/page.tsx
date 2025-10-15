"use client";
import { useState } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import TourHero from "@/components/tour/TourHero";
import TourInfoCard from "@/components/tour/TourInfoCard";
import TourOverview from "@/components/tour/TourOverview";
import PlacesCarousel from "@/components/tour/PlacesCarousel";
import TourItinerary from "@/components/tour/TourItinerary";
import WhatsIncluded from "@/components/tour/WhatsIncluded";
import TourFAQ from "@/components/tour/TourFAQ";
import { tourData } from "@/data/tourData";
import HolidayEnquiryForm from "@/components/tour/HolidayEnquiryForm";

const TourDetailPage = () => {
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);

  const handleOpenEnquiryForm = () => {
    setIsEnquiryFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero Section with Images and Info Card */}
      <div className="max-w-8xl mx-auto px-6 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TourHero images={tourData.heroImages} />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start">
            <TourInfoCard tour={tourData} onEnquire={handleOpenEnquiryForm} />
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-12 space-y-16">
          {/* Overview Section */}
          <TourOverview tour={tourData} />

          {/* Places Carousel */}
          <PlacesCarousel places={tourData.places} />

          {/* Itinerary Section */}
          <TourItinerary itinerary={tourData.itinerary} />

          {/* What's Included Section */}
          <WhatsIncluded included={tourData.included} />

          {/* FAQs Section */}
          <TourFAQ faqs={tourData.faqs} />
        </div>
      </div>

      <Footer />

      {/* Holiday Enquiry Form */}
      <HolidayEnquiryForm
        open={isEnquiryFormOpen}
        onOpenChange={setIsEnquiryFormOpen}
      />
    </div>
  );
};

export default TourDetailPage;
