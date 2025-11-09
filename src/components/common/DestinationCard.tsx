import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Plane, Building2, Car, User } from "lucide-react";
import { toast } from "react-toastify";

interface Destination {
  id?: string;
  name: string;
  image: string;
  rating: number;
  days: number;
  nights: number;
  flights: number;
  hotels: number;
  transfers: number;
  activities: number;
  features?: string[];
  currency: string;
  originalPrice: number;
  finalPrice: number;
  priceContent?: string;
  itineraryIcons?: { text?: string; image?: string }[];
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const handleCardClick = async () => {
    try {
      // Check if holiday ID exists
      if (!destination.id) {
        console.error("[DestinationCard] No holiday ID available");
        toast.error("Unable to load holiday details. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      console.log("[DestinationCard] Validating holiday data for:", destination.id);

      // Store holidayId and title in sessionStorage
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("holidayId", destination.id);
          window.sessionStorage.setItem("holidayTitle", destination.name);
        } catch (e) {
          console.error("[DestinationCard] Failed to store holiday data:", e);
        }
      }

      // Validate holiday data before redirecting
      const response = await fetch("/api/cms/holiday-itinerary-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidayId: destination.id }),
      });

      console.log("[DestinationCard] API response status:", response.status);

      // Check if response is not OK
      if (!response.ok) {
        console.error("[DestinationCard] API call failed with status:", response.status);
        toast.error("Holiday package not found or unavailable", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const data = await response.json();
      console.log("[DestinationCard] API response data:", data);

      // Validate response structure and data
      if (!data.success || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
        console.warn("[DestinationCard] Invalid or empty holiday data:", data);
        toast.error("Holiday package not found or unavailable", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Valid data found - store the details and redirect
      console.log("[DestinationCard] Valid holiday data found, redirecting to tour-details");

      // Store the holiday details for the tour details page
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("holidayDetails", JSON.stringify(data.data[0]));
        }
      } catch (e) {
        console.error("[DestinationCard] Error saving holiday details:", e);
      }

      // Navigate to tour details page (always use nested route)
      const tourSlug = destination.name.toLowerCase().replace(/\s+/g, "-");
      const currentPageSlug = typeof window !== "undefined" 
        ? window.sessionStorage.getItem("currentPageSlug") 
        : "master-landing-page";
      router.push(`/${currentPageSlug}/tour-details/${tourSlug}`);
      
    } catch (error) {
      console.error("[DestinationCard] Error validating holiday data:", error);
      toast.error("Holiday package not found or unavailable", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div
      className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group p-4 cursor-pointer h-full flex flex-col"
      style={{ backgroundColor: "#fafafa" }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-[170px] xl:h-[140px] overflow-hidden rounded-sm mb-4">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Heart overlay - white heart icon */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-transparent flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite
                ? "fill-white text-white"
                : "text-white hover:fill-white"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title & Rating */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-black">{destination.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-black">
              {destination.rating > 0 ? destination.rating.toFixed(1) : "N/A"}
            </span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>

        {/* Trip Duration */}
        <p className="text-sm text-gray-600 mb-4">
          {destination.days} Days {destination.nights} Nights
        </p>

        {/* Icons Row */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          {destination.itineraryIcons &&
          destination.itineraryIcons.length > 0 ? (
            destination.itineraryIcons.slice(0, 4).map((icon, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 text-xs text-gray-600 flex-1 min-w-0"
              >
                {icon.image ? (
                  <img
                    src={`/api/cms/file-download?image=${encodeURIComponent(
                      icon.image
                    )}`}
                    alt={icon.text || ""}
                    className="w-5 h-5 flex-shrink-0 object-contain"
                  />
                ) : (
                  <Plane className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-center text-[10px] leading-tight break-words max-w-[70px]">
                  {icon.text || ""}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600 flex-1 min-w-0">
                <Plane className="w-5 h-5 flex-shrink-0" />
                <span className="text-center text-[10px] leading-tight">
                  {destination.flights} Flights
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600 flex-1 min-w-0">
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-center text-[10px] leading-tight">
                  {destination.hotels} Accommodation
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600 flex-1 min-w-0">
                <Car className="w-5 h-5 flex-shrink-0" />
                <span className="text-center text-[10px] leading-tight">
                  {destination.transfers} Cars
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-xs text-gray-600 flex-1 min-w-0">
                <User className="w-5 h-5 flex-shrink-0" />
                <span className="text-center text-[10px] leading-tight">
                  {destination.activities} Activities
                </span>
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-1 mb-4">
          {(destination.features ?? []).map((feature, index) => (
            <li key={index} className="text-sm text-gray-800 flex items-start">
              <span className="mr-2 text-gray-600">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-sm text-gray-500 line-through">
            {destination.currency}
            {destination.originalPrice.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-black">
            {destination.currency + " "}
            {destination.finalPrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">
            {destination.priceContent || "Per person"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
