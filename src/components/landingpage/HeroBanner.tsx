import VisaBookingCard from "@/components/landingpage/VisaBookingCard";

const iconNavItems = [
  {
    id: "Home",
    label: "Home",
    imgSrc: "/landingpage/icons/home.png",
    redirectUrl: "/",
  },
  {
    id: "Flight",
    label: "Flight",
    imgSrc: "/landingpage/icons/flight.png",
    redirectUrl: "/",
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
    redirectUrl: "/holidays",
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
    redirectUrl: "/visa",
  },
  {
    id: "More",
    label: "More",
    imgSrc: "/landingpage/icons/more.png",
    redirectUrl: "#",
  },
];

const HeroBanner = () => {
  return (
    <section className="w-full px-6 lg:px-12">
      <div className="hero-gradient rounded-[2.5rem] overflow-hidden relative">
        {/* Background globe image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/landingpage/hero.png')`,
            backgroundPosition: "center 30%",
          }}
        />

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
            {iconNavItems.map((item) => (
              <a
                key={item.id}
                href={item.redirectUrl}
                className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <img
                    src={item.imgSrc}
                    alt={item.label}
                    className="w-6 h-6 lg:w-12 lg:h-12 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </a>
            ))}
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
