import VisaBookingCard from "@/components/landingpage/VisaBookingCard";

const HeroBanner = () => {
  return (
    <section className="w-full px-6 lg:px-12">
      <div className="hero-gradient rounded-[2.5rem] overflow-hidden relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
        {/* Background globe image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/landingpage/hero.png')`,
            backgroundPosition: "center 30%",
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-8 lg:px-16 py-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-center text-foreground mb-2">
            Travel to your Dream Destination!
          </h1>
          <p className="text-center text-foreground/80 text-sm lg:text-base mb-8">
            Flight booking made faster and efficient
          </p>
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
