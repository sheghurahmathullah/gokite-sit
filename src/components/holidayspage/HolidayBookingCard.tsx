"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
}

const HolidayBookingCard = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"city" | "country">("city");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input change with autocomplete
  const handleSearchInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Show loading immediately
    setIsLoading(true);
    setShowDropdown(true);

    // Debounce API call
    debounceTimer.current = setTimeout(async () => {
      try {
        const endpoint =
          searchType === "city"
            ? "/api/holiday-city-autocomplete"
            : "/api/holiday-country-autocomplete";
        const params = new URLSearchParams({ query: value });

        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();

        if (data.success && data.data) {
          setSuggestions(data.data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  // Fetch and store selected country ID in sessionStorage
  const fetchAndStoreCountryId = async (countryLabel: string) => {
    try {
      const res = await fetch("/api/cms/countries-dd-proxy", {
        cache: "no-store",
      });
      const payload = await res.json();

      const rows = Array.isArray(payload?.data?.data) ? payload.data.data : [];

      const norm = (v: any) =>
        typeof v === "string" ? v.trim().toLowerCase() : "";
      const match = rows.find(
        (r: any) => norm(r?.label) === norm(countryLabel)
      );

      if (match?.id) {
        console.log("Selected holiday country id:", match.id);
        try {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(
              "selectedHolidayCountryId",
              String(match.id)
            );
          }
        } catch (_) {}
      } else {
        console.log("Country id not found for label:", countryLabel);
      }
    } catch (e) {
      console.error("Failed to fetch holiday country id:", e);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (item: SearchSuggestion) => {
    setSearchQuery(item.label);
    setSelectedCountry(item.value);
    setShowDropdown(false);

    // Store destination name and type in session storage
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("selectedHolidayDestination", item.label);
        window.sessionStorage.setItem(
          "selectedHolidayDestinationType",
          searchType
        );
      }
    } catch (_) {}

    // Store city ID if it's a city selection
    if (searchType === "city" && item.id) {
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("selectedHolidayCityId", item.id);
          console.log("Selected holiday city id:", item.id);
        }
      } catch (_) {}
    }

    // Fetch and store country ID if it's a country selection
    if (searchType === "country") {
      fetchAndStoreCountryId(item.label);
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please select a destination", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      console.log("[HolidayBookingCard] Validating holiday data for:", searchType, searchQuery);

      // Determine which API endpoint to call based on search type
      let apiEndpoint = "";
      let requestBody: any = {};

      if (searchType === "city") {
        const cityId = typeof window !== "undefined" 
          ? window.sessionStorage.getItem("selectedHolidayCityId") 
          : null;
        
        if (!cityId) {
          toast.error("Please select a valid city", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        apiEndpoint = "/api/cms/holiday-city-search";
        requestBody = { cityId };
      } else if (searchType === "country") {
        const countryId = typeof window !== "undefined" 
          ? window.sessionStorage.getItem("selectedHolidayCountryId") 
          : null;
        
        if (!countryId) {
          toast.error("Please select a valid country", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        apiEndpoint = "/api/cms/holiday-country-search";
        requestBody = { countryId };
      }

      // Validate holiday data exists
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("[HolidayBookingCard] API response status:", response.status);

      // Check if response is not OK
      if (!response.ok) {
        console.error("[HolidayBookingCard] API call failed with status:", response.status);
        toast.error("No holiday packages found for this destination", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const data = await response.json();
      console.log("[HolidayBookingCard] API response data:", data);

      // Validate response structure and data
      if (!data.success || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.warn("[HolidayBookingCard] Invalid or empty holiday data:", data);
        toast.error("No holiday packages found for this destination", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Valid data found - redirect to holiday-list page
      console.log("[HolidayBookingCard] Valid holiday data found, redirecting to holiday-list");
      router.push("/holiday-list");
      
    } catch (error) {
      console.error("[HolidayBookingCard] Error validating holiday data:", error);
      toast.error("No holiday packages found for this destination", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-left">Book Holiday</h2>

      <div className="bg-gray-50 rounded-lg p-4 flex flex-col lg:flex-row items-center gap-4">
        {/* Left side - Search Input with Autocomplete */}
        <div className="flex-1 flex flex-col relative w-full" ref={dropdownRef}>
          <label className="text-xs text-muted-foreground text-left mb-1">
            Where are you {searchType === "city" ? "Going" : "Going"}?
          </label>
          <input
            type="text"
            placeholder={
              searchType === "city" ? "Select City" : "Select Country"
            }
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            className="text-sm text-foreground outline-none bg-transparent border-none"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-[50%] z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Loading...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer transition-colors text-left"
                  >
                    <span className="text-sm text-gray-900 block text-left">
                      {item.label}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center - Search Type Toggle */}
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
            <button
              onClick={() => {
                setSearchType("city");
                setSearchQuery("");
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className={`px-4 py-2 text-sm font-bold tracking-wider rounded-md transition-all ${
                searchType === "city"
                  ? "bg-black text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-black"
              }`}
            >
              CITY
            </button>
            <button
              onClick={() => {
                setSearchType("country");
                setSearchQuery("");
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className={`px-4 py-2 text-sm font-bold tracking-wider rounded-md transition-all ${
                searchType === "country"
                  ? "bg-black text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-black"
              }`}
            >
              COUNTRY
            </button>
          </div>
        </div>

        {/* Right side - Search Button */}
        <Button
          size="lg"
          onClick={handleSearch}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base font-semibold rounded-lg"
        >
          <Search className="w-5 h-5 mr-2" />
          {searchType === "city" ? "Search" : "Search"}
        </Button>
      </div>

      {/* Google Reviews Badge */}
      <div className="mt-4 flex justify-end">
        <div className="hero-google-powered google-powered text-xs text-muted-foreground flex items-center gap-2">
          <span>Powered by</span>
          <svg
            className="hero-google-logo google-logo w-16 h-5"
            viewBox="0 0 272 92"
            fill="none"
          >
            <path
              d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              fill="#EA4335"
            />
            <path
              d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              fill="#FBBC05"
            />
            <path
              d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
              fill="#34A853"
            />
            <path d="M225 3v65h-9.5V3h9.5z" fill="#EA4335" />
            <path
              d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
              fill="#FBBC05"
            />
            <path
              d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
              fill="#4285F4"
            />
          </svg>
          <span>Reviews</span>
          <div className="flex items-center ml-1">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="ml-1">4.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayBookingCard;
