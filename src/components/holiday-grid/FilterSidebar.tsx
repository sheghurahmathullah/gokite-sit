import { useState } from "react";
import {
  MapPin,
  Calendar,
  User,
  DollarSign,
  Star,
  ChevronDown,
  Filter,
  Minus,
  Plus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const FilterSidebar = () => {
  const [guestCount, setGuestCount] = useState(2);
  const [priceRange, setPriceRange] = useState([10, 300]);
  const [selectedRating, setSelectedRating] = useState(2);
  const [pickupNeeded, setPickupNeeded] = useState(true);
  const [pickupAvailable, setPickupAvailable] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
        <Filter className="w-5 h-5 text-foreground" />
        <h3 className="text-lg font-bold text-foreground">Search By Filter</h3>
      </div>

      {/* Destination */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span>Destination</span>
          </div>
          <select className="w-full px-3 py-2 border border-border rounded-lg appearance-none bg-background text-foreground pr-10">
            <option>Goa</option>
            <option>Dubai</option>
            <option>Maldives</option>
          </select>
          <ChevronDown className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Activity Type */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Activity Type</span>
          </div>
          <select className="w-full px-3 py-2 border border-border rounded-lg appearance-none bg-background text-foreground pr-10">
            <option>Desert Safari</option>
            <option>Beach Activities</option>
            <option>Mountain Hiking</option>
          </select>
          <ChevronDown className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Date From */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span>Date From</span>
          </div>
          <input
            type="text"
            defaultValue="01/12/2023"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
      </div>

      {/* Guests Counter */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <User className="w-4 h-4" />
            <span>Guests</span>
          </div>
          <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
            <button
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="text-muted-foreground hover:text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-foreground font-medium">
              {String(guestCount).padStart(2, "0")}
            </span>
            <button
              onClick={() => setGuestCount(guestCount + 1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter By Price */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <DollarSign className="w-4 h-4" />
          Filter By Price
        </label>
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            Price: ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          Apply
        </Button>
      </div>

      {/* Traveler Rating */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Star className="w-4 h-4" />
          Traveler Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`flex-1 py-2 rounded-lg border transition-colors ${
                selectedRating === rating
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Travello Section */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Travello</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="pickup-available"
              checked={pickupAvailable}
              onCheckedChange={(checked) =>
                setPickupAvailable(checked as boolean)
              }
            />
            <label
              htmlFor="pickup-available"
              className="text-sm text-foreground cursor-pointer"
            >
              Pickup Available
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="no-pickup"
              checked={pickupNeeded}
              onCheckedChange={(checked) => setPickupNeeded(checked as boolean)}
            />
            <label
              htmlFor="no-pickup"
              className="text-sm text-foreground cursor-pointer"
            >
              No Pickup needed
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
