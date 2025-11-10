"use client";
import { Plane, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const params = useParams();
  const currentSlug = params.slug as string || "visa-landing-page";

  const handleCardClick = async () => {
    try {
      // Fetch country ID from API
      const res = await fetch("/api/cms/countries-dd-proxy", {
        cache: "no-store",
      });
      const payload = await res.json();

      const rows = Array.isArray(payload?.data?.data) ? payload.data.data : [];

      const norm = (v: any) =>
        typeof v === "string" ? v.trim().toLowerCase() : "";
      const match = rows.find(
        (r: any) => norm(r?.label) === norm(country.country)
      );

      if (!match?.id) {
        console.log("Country id not found for:", country.country);
        const { toast } = await import("react-toastify");
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const countryId = String(match.id);
      console.log("Selected visa country id:", countryId);

      // Validate country has visa data before redirecting
      const visaResponse = await fetch("/api/cms/visa-country-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: countryId }),
      });

      if (!visaResponse.ok) {
        const { toast } = await import("react-toastify");
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const visaData = await visaResponse.json();
      
      if (!visaData.success || !visaData.data || visaData.data.length === 0) {
        const { toast } = await import("react-toastify");
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Store country ID and navigate
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("applyVisaCountryId", countryId);
        }
      } catch (_) {}

      // Navigate to apply-visa page with nested routing
      // Use the current slug from URL params instead of sessionStorage
      // Also store it in sessionStorage as a fallback for other components
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("currentPageSlug", currentSlug);
        } catch (_) {}
      }
      
      router.push(`/${currentSlug}/apply-visa`);
    } catch (e) {
      console.error("Failed to validate visa:", e);
      const { toast } = await import("react-toastify");
      toast.error("Failed to validate visa availability. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
      onClick={handleCardClick}
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoplayRef = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
      playOnInit: true, // Start playing immediately
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  );

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

  // Update carousel scroll state
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Filter countries based on selected filter and search query
  const filteredCountries = countriesData.filter((country) => {
    // Check category filter - show cards that contain the selected filter in their tagNames
    const matchesCategory =
      !country.tagNames ||
      country.tagNames.length === 0 ||
      country.tagNames.some((tag) =>
        tag.trim().toLowerCase().includes(selectedFilter.trim().toLowerCase())
      );

    // Check search query
    const matchesSearch =
      searchQuery.trim() === "" ||
      country.country.toLowerCase().includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselApi) {
      if (direction === "left") {
        carouselApi.scrollPrev();
      } else {
        carouselApi.scrollNext();
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#e1effa]">
        <div className="px-6 py-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Loading Countries
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we fetch the latest visa destinations
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#e1effa]">
        <div className="px-6 py-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Error Loading Countries
              </h3>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchCountriesData}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show no data message if no countries loaded at all
  if (countriesData.length === 0 && !loading && !error) {
    return (
      <div className="bg-[#e1effa]">
        <div className="px-6 py-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Countries Available
              </h3>
              <p className="text-sm text-gray-600">
                No visa destinations are currently available. Please check back
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e1effa]">
      {/* Header Section */}
      <div className="bg-[#e1effa] py-4 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <img
                src="images/visa/visa-flight.png"
                alt=""
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search Country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-white rounded-xl border border-blue-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-300 transition-colors"
                style={{ fontFamily: '"DM Mono", monospace' }}
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
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? "text-white border-0"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                  style={
                    selectedFilter === filter
                      ? { backgroundColor: "#FBB609" }
                      : undefined
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Chevron buttons for carousel control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                disabled={!canScrollPrev}
                className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                disabled={!canScrollNext}
                className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Country Carousel */}
      <div className="px-6 pb-4">
        <div className="max-w-[1400px] mx-auto">
          {filteredCountries.length > 0 ? (
            <div className="relative">
              {/* Carousel */}
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  loop: true,
                  dragFree: false,
                  slidesToScroll: 1,
                  skipSnaps: false,
                  duration: 25, // Smooth transition duration
                  watchDrag: true,
                }}
                plugins={[autoplayRef.current]}
                className="w-full"
                onMouseEnter={() => autoplayRef.current.stop()}
                onMouseLeave={() => autoplayRef.current.play()}
              >
                <CarouselContent className="-ml-4">
                  {/* Render countries directly - loop handled by Embla */}
                  {filteredCountries.map((country, index) => (
                    <CarouselItem
                      key={`${country.id}-${index}`}
                      className="pl-4 sm:basis-1/2 lg:basis-1/4 xl:basis-1/5"
                    >
                      <VisaCountryCard country={country} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Destinations Found
              </h3>
              <p className="text-sm text-gray-600">
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
