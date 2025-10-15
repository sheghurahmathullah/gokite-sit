import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import * as Flags from "country-flag-icons/react/3x2";

export interface VisaCountry {
  id: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
}

interface VisaCardProps {
  visa: VisaCountry;
  type?: "popular" | "trending";
  subtitle?: string; // For showing custom subtitle like in trending
  hasVisaTag?: boolean; // For "VISA" tag in trending
}

const VisaCard = ({
  visa,
  type = "popular",
  subtitle,
  hasVisaTag,
}: VisaCardProps) => {
  // Access flag by countryCode (uppercase)
  const FlagComponent =
    Flags[visa.countryCode.toUpperCase() as keyof typeof Flags];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer min-w-[260px] flex-shrink-0">
      <div className="flex flex-col gap-2">
        <div
          className={
            type === "trending"
              ? "flex items-center justify-between mb-1"
              : "mb-1"
          }
        >
          {FlagComponent && <FlagComponent className="w-12 h-12 rounded" />}
          {hasVisaTag && (
            <img
              src="/visa/visa-icon.png"
              alt="Visa"
              className="w-8 h-6 ml-auto"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-0.5">
            {visa.country}
          </h3>
          {type === "popular" ? (
            <p className="text-xs text-gray-500 mb-3">{visa.visaType}</p>
          ) : (
            subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-gray-900">
              {visa.currency}
              {visa.price.toLocaleString()}
            </span>
            {visa.perAdult && (
              <span className="text-xs text-gray-500">per adult</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

interface CountrySliderProps {
  title: string;
  countries: VisaCountry[];
  type?: "popular" | "trending";
}

const CountrySlider = ({
  title,
  countries,
  type = "popular",
}: CountrySliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full px-6 py-6">
      <div className="max-w-[85rem] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {countries.map((visa) => (
            <VisaCard
              key={visa.id}
              visa={visa}
              type={type}
              subtitle={
                type === "trending" ? "Get your Visa by 24hours" : undefined
              }
              hasVisaTag={
                type === "trending" &&
                (visa.eVisa || visa.visaType.toLowerCase().includes("e-visa"))
              }
            />
          ))}
        </div>
      </div>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default CountrySlider;
