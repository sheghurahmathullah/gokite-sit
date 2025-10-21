import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, Plane, Building2, Car, User } from "lucide-react";

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
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    // Store holidayId and title in sessionStorage
    if (typeof window !== "undefined") {
      try {
        if (destination.id) {
          window.sessionStorage.setItem("holidayId", destination.id);
        }
        window.sessionStorage.setItem("holidayTitle", destination.name);
      } catch (e) {
        console.error("Failed to store holiday data:", e);
      }
    }

    // Navigate to tour details page with slug (using title)
    const slug = destination.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/tour-details/${slug}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group p-4 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-sm mb-4">
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
      <div>
        {/* Title & Rating */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-black">{destination.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-black text-black" />
            <span className="text-sm font-medium text-black">
              {destination.rating}
            </span>
          </div>
        </div>

        {/* Trip Duration */}
        <p className="text-sm text-gray-600 mb-4">
          {destination.days} Days {destination.nights} Nights
        </p>

        {/* Icons Row */}
        <div className="flex items-center gap-5 mb-4 flex-wrap">
          <div className="flex flex-col items-center gap-3 text-xs text-gray-600">
            <Plane className="w-4 h-4 flex-shrink-0" />
            <span>{destination.flights} Flights</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-xs text-gray-600">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span>{destination.hotels} Hotel</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-xs text-gray-600">
            <Car className="w-4 h-4 flex-shrink-0" />
            <span>{destination.transfers} Transfers</span>
          </div>
          <div className="flex flex-col items-center gap-3 text-xs text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span>{destination.activities} Activities</span>
          </div>
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 line-through">
            {destination.currency}
            {destination.originalPrice.toLocaleString()}
          </span>
          <span className="text-xl font-bold text-black">
            {destination.currency}
            {destination.finalPrice.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">Per person</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
