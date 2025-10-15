"use client";
import TopNav from "@/components/common/TopNav";
import Footer from "@/components/common/Footer";
import HeroBanner from "@/components/holiday-grid/HeroBanner";
import FilterSidebar from "@/components/holiday-grid/FilterSidebar";
import DestinationCard from "@/components/common/DestinationCard";
import { popularDestinations } from "@/data/destinations";

const HolidayGridPage = () => {
  // Repeat destinations to show 12 cards (4 rows x 3 cards)
  const displayDestinations = [
    ...popularDestinations,
    ...popularDestinations,
    ...popularDestinations,
  ].slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="relative w-full px-2 sm:px-4 max-w-[1400px] mx-auto">
        <HeroBanner />
      </div>

      <main className="container mx-auto px-4 sm:px-5 py-8 sm:py-10 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Tour Cards Grid - 70% width */}
          <div className="w-full lg:w-[70%]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayDestinations.map((destination, index) => (
                <DestinationCard
                  key={`${destination.id}-${index}`}
                  destination={destination}
                />
              ))}
            </div>
          </div>

          {/* Filter Sidebar - 30% width */}
          <div className="w-full lg:w-[30%]">
            <FilterSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HolidayGridPage;
