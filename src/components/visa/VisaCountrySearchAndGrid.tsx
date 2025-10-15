import { Plane, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, lazy, Suspense, useRef } from "react";

interface VisaCountry {
  id: string;
  country: string;
  countryCode: string;
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
}

const filters = [
  "Popular",
  "Visa in a week",
  "Easy Visa",
  "Season",
  "Business Visa",
  "Visa Free",
];

const allVisaCountries: VisaCountry[] = [
  {
    id: "uae-1",
    country: "United Arab Emirates",
    countryCode: "AE",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "3 Days",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  },
  {
    id: "singapore-3",
    country: "Singapore",
    countryCode: "SG",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  },
  {
    id: "japan-1",
    country: "Japan",
    countryCode: "JP",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
  },
  {
    id: "sri-lanka-2",
    country: "Srilanka",
    countryCode: "LK",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    id: "africa-1",
    country: "Africa",
    countryCode: "ZA",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  },
  {
    id: "australia-2",
    country: "Australia",
    countryCode: "AU",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
  },
  {
    id: "thailand-1",
    country: "Thailand",
    countryCode: "TH",
    price: 6500,
    currency: "₹",
    visaType: "Visa on Arrival",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
  },
  {
    id: "russia-1",
    country: "Russia",
    countryCode: "RU",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80",
  },
];

const VisaCountryCard = ({ country }: { country: VisaCountry }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        <img
          src={country.image}
          alt={country.country}
          className="w-full h-full object-cover"
        />
        {country.offer && (
          <div className="absolute top-3 right-3 bg-yellow-400 px-2.5 py-1 rounded-md">
            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
              {country.offer.split("!")[0].includes("Hurry")
                ? "OFFER"
                : "OFFER"}
            </span>
          </div>
        )}
        {country.offer && (
          <div className="absolute top-9 right-3 bg-yellow-400 px-2 py-0.5 rounded text-[9px] font-semibold text-gray-900">
            {country.offer}
          </div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-base">
            {country.country}
          </h3>
          <div className="text-right text-[11px] text-gray-600">
            <div>Visa in</div>
            <div className="font-semibold text-black">{country.visaTime}</div>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-xl font-bold text-black">
            {country.currency}
            {country.price.toLocaleString()}
          </span>
        </div>

        <div className="text-[11px] text-gray-500">+ ₹6,500 (Fees + Tax)</div>
      </div>
    </div>
  );
};

export default function VisaCardDesign() {
  const [selectedFilter, setSelectedFilter] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const filterScrollRef = useRef<HTMLDivElement>(null);

  const filteredCountries = allVisaCountries.filter((country) =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scroll = (direction: "left" | "right") => {
    if (filterScrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        filterScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      filterScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#e1effa]">
      {/* Header Section */}
      <div className="bg-[#e1effa] py-4 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
              <input
                type="text"
                placeholder="Search Country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>

            {/* Filter Tabs */}
            <div
              ref={filterScrollRef}
              className="flex items-center gap-2 flex-1 overflow-x-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* chevron left and right button */}
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
        </div>
      </div>

      {/* Country Grid */}
      <div className="px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredCountries.map((country) => (
              <VisaCountryCard key={country.id} country={country} />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
