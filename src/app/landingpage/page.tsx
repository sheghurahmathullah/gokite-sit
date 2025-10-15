"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopNav from "@/components/common/TopNav";
import HeroBanner from "@/components/landingpage/HeroBanner";
import DestinationCard from "@/components/common/DestinationCard";
import VisaCard from "@/components/landingpage/VisaCard";
import Footer from "@/components/common/Footer";
import { popularDestinations } from "@/data/destinations";
import { visaDestinations } from "@/data/visaDestinations";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main>
        {/* Hero Section */}
        <HeroBanner />

        {/* Popular Holiday Destinations */}
        <section className="px-6 lg:px-12 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Popular Holiday Destinations
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-foreground/80"
              >
                View All
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        {/* Top Visa Destination */}
        <section className="px-6 lg:px-12 mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Top Visa Destination
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-foreground/80"
              >
                View All
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaDestinations.map((destination) => (
              <VisaCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
