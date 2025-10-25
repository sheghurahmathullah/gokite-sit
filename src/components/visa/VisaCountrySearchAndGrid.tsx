"use client";
import { Plane, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface VisaCountry {
  id: string;
  country: string;
  countryCode: string;
  price: string;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
  tagNames?: string[];
  processingDays?: string;
  additionalFee?: string;
}

const filters = [
  "Popular",
  "Visa in a week",
  "Easy Visa",
  "Season",
  "Business Visa",
  "Visa Free",
];

const VisaCountryCard = ({ country }: { country: VisaCountry }) => {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
      onClick={() => router.push("/apply-visa")}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={country.image}
          alt={country.country}
          className="w-full h-full object-cover"
        />
        {country.offer && (
          <>
            <div className="absolute top-3 right-3 bg-yellow-400 px-2.5 py-1 rounded-md">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                OFFER
              </span>
            </div>
            <div className="absolute top-9 right-3 bg-yellow-400 px-2 py-0.5 rounded text-[9px] font-semibold text-gray-900">
              {country.offer}
            </div>
          </>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-base">
            {country.country}
          </h3>
          <div className="text-right text-[11px] text-gray-600">
            <div>Visa in</div>
            <div className="font-semibold text-black">
              {country.processingDays || country.visaTime} Days
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-0.5">
          <span className="text-xl font-bold text-black">{country.price}</span>
        </div>

        <div className="text-[11px] text-gray-500">
          {country.additionalFee || "+ ₹8,500 (Fees + Tax)"}
        </div>
      </div>
    </div>
  );
};

export default function VisaCountrySearchAndGrid() {
  const [selectedFilter, setSelectedFilter] = useState("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [countriesData, setCountriesData] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);


  // Fetch countries data from API
  const fetchCountriesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cms/countries-dd");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // API returns { success: true, data: { data: [...] } }
      if (result?.success && result?.data) {
        const itemsArray = Array.isArray(result.data) ? result.data : [];
        const transformedData = transformCountriesData(itemsArray);
        setCountriesData(transformedData);
      } else {
        throw new Error(result.message || "Failed to fetch countries data");
      }
    } catch (err: any) {
      console.error("Error fetching countries data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to component format
  const transformCountriesData = (apiData: any[]): VisaCountry[] => {
    if (!Array.isArray(apiData) || apiData.length === 0) {
      return [];
    }

    return apiData.map((item, index) => {
      const title = item?.visaCardJson?.title || item?.visaCardTitle || "";
      const imageName = item?.visaCardJson?.image || "";
      const tagNames = item?.visaCardJson?.tagNames || [];
      const processingDays =
        item?.visaCardJson?.processing_days ||
        item?.visaCardJson?.processing_time ||
        "5";

      const formatPrice = (currency: string, amount: string) => {
        if (!amount) return "";
        const numeric = Number(amount);
        if (Number.isNaN(numeric)) return `${currency || ""} ${amount}`.trim();
        return `${currency || ""} ${numeric.toLocaleString("en-IN")}`.trim();
      };

      return {
        id: item?.visaCardId || String(index),
        country: title,
        countryCode: item?.visaCardCountryId || item?.countryCode || "",
        price: formatPrice(item?.currency, item?.newPrice),
        currency: item?.currency || "₹",
        visaType: item?.visaCardJson?.subTitle || "Tourist Visa",
        visaTime: processingDays,
        image: imageName
          ? `/api/cms/file-download?image=${encodeURIComponent(imageName)}`
          : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
        tagNames: tagNames,
        processingDays: processingDays,
        additionalFee: "+ ₹8,500 (Fees + Tax)",
      };
    });
  };

  // Fetch countries data on component mount
  useEffect(() => {
    fetchCountriesData();
  }, []);

  // Filter countries based on selected filter and search query
  const filteredCountries = countriesData.filter((country) => {
    // Check category filter - show cards that contain the selected filter in their tagNames
    const matchesCategory =
      !country.tagNames ||
      country.tagNames.length === 0 ||
      country.tagNames.some(
        (tag) =>
          tag.trim().toLowerCase().includes(selectedFilter.trim().toLowerCase())
      );

    // Check search query
    const matchesSearch =
      searchQuery.trim() === "" ||
      country.country.toLowerCase().includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e1effa]">
        <div className="px-6 py-8">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-lg text-gray-600">Loading countries...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch the latest visa destinations
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#e1effa]">
        <div className="px-6 py-8">
          <div className="max-w-[1400px] mx-auto text-center">
            <p className="text-lg text-red-600 mb-2">Error loading countries</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCountriesData}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Chevron buttons */}
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
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredCountries.map((country) => (
                <VisaCountryCard key={country.id} country={country} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4">✈️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Destinations Found
              </h3>
              <p className="text-gray-600">
                {searchQuery.trim() !== ""
                  ? `No visa destinations found matching "${searchQuery}" in "${selectedFilter}" category.`
                  : `No visa destinations available for "${selectedFilter}" category.`}
              </p>
            </div>
          )}
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
