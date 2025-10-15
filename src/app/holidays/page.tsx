"use client";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HolidayHeroBanner from "@/components/holidayspage/HolidayHeroBanner";
import SectionHeader from "@/components/common/SectionHeader";
import DestinationCard from "@/components/common/DestinationCard";
import {
  tripPackages,
  honeymoonSpecials,
  moreDestinations,
} from "@/data/holidaysData";
import { Button } from "@/components/ui/button";

const HolidaysPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* Hero Section */}
      <main className="px-6 lg:px-12 py-8">
        <HolidayHeroBanner />

        {/* Trip Packages Section */}
        <section className="mt-16 max-w-8xl mx-auto">
          <div className="bg-gradient-to-r from-teal-900/40 to-teal-700/40 rounded-3xl overflow-hidden relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop)",
                backgroundBlendMode: "overlay",
              }}
            />

            <div className="relative z-10 p-6 lg:p-8">
              {/* Header */}
              <div className="mb-8">
                <p className="text-white/90 text-sm mb-4">Trip Packages</p>
                <div className="flex items-start justify-between gap-8">
                  <h2 className="text-4xl font-bold text-white max-w-md flex-shrink-0">
                    Best Recommendation Destination For You
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed flex-1">
                    Discover your next adventure with our curated list of the
                    best recommendation destinations that offer unforgettable
                    trip experiences. Whether you fancy touring around or
                    immerse yourself in the beauty of exploration, let us guide
                    you to unforgettable destinations that will create lasting
                    memories
                  </p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8">
                <div className="flex gap-4 overflow-x-auto">
                  {[
                    { icon: "🏖️", label: "Beaches" },
                    { icon: "🎯", label: "Adventure" },
                    { icon: "🌍", label: "World Wonder" },
                    { icon: "🏛️", label: "Iconic city" },
                    { icon: "🌄", label: "Countryside" },
                    { icon: "👨‍👩‍👧", label: "Kids Wonderland" },
                    { icon: "⛷️", label: "Skiing" },
                    { icon: "🦁", label: "Wildlife" },
                  ].map((category, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-2 min-w-fit px-3 py-2 rounded-lg transition-all duration-200 ${
                        index === 0
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-xs whitespace-nowrap font-medium">
                        {category.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beaches Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Beaches</h3>
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2">
                    View All
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Destination Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {tripPackages.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Honeymoon Freebies Special Section */}
        <section className="mt-20 max-w-8xl mx-auto">
          <SectionHeader
            title="Honeymoon Freebies Special"
            showPagination
            totalDots={2}
            activeIndex={0}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {honeymoonSpecials.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        {/* Additional Destinations Section */}
        <section className="mt-20 max-w-8xl mx-auto">
          <SectionHeader
            title=""
            showPagination
            totalDots={2}
            activeIndex={1}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HolidaysPage;
