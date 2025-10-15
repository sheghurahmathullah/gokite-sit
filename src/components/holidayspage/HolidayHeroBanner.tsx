import HolidayBookingCard from "@/components/holidayspage/HolidayBookingCard";

const HolidayHeroBanner = () => {
  return (
    <div className="relative w-full">
      {/* Hero Container */}
      <div 
        className="relative w-full rounded-3xl overflow-hidden px-6 lg:px-12 pt-32 pb-32"
        style={{
          backgroundImage: "url('/images/holidays/hero-sunset.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px"
        }}
      >
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            An Lifetime Memory of Holidays
          </h1>
          <p className="text-lg lg:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Plan your holiday with our Tailored Packages for your Solo Trip, Honeymoon, Family Trip, Group Travel
          </p>

          {/* Booking Card */}
          <div className="mb-8">
            <HolidayBookingCard />
          </div>

          {/* Bottom CTA */}
          <p className="text-white/90 text-sm">
            Book a meeting with our travel Agent
          </p>
        </div>
      </div>
    </div>
  );
};

export default HolidayHeroBanner;
