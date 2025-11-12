import { useState, useEffect } from "react";
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

export interface FilterCriteria {
  cityName: string;
  categoryName: string;
  minGuests: number;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  pickupRequired: boolean | null; // null = any, true = required, false = not required
  dateFrom: string;
}

interface FilterSidebarProps {
  cities: string[];
  categories: string[];
  onFilterChange: (filters: FilterCriteria) => void;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}

const FilterSidebar = ({
  cities,
  categories,
  onFilterChange,
  minPrice = 0,
  maxPrice = 10000,
  currency = "₹",
}: FilterSidebarProps) => {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [guestCount, setGuestCount] = useState(1);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [pickupNeeded, setPickupNeeded] = useState(false);
  const [pickupAvailable, setPickupAvailable] = useState(false);
  const [dateFrom, setDateFrom] = useState("");

  // Update price range when min or max price props change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    const filters: FilterCriteria = {
      cityName: selectedCity,
      categoryName: selectedCategory,
      minGuests: guestCount,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: selectedRating,
      pickupRequired:
        pickupAvailable && !pickupNeeded
          ? true
          : !pickupAvailable && pickupNeeded
          ? false
          : null,
      dateFrom,
    };
    onFilterChange(filters);
  }, [
    selectedCity,
    selectedCategory,
    guestCount,
    priceRange,
    selectedRating,
    pickupAvailable,
    pickupNeeded,
    dateFrom,
    onFilterChange,
  ]);

  const handleApplyFilters = () => {
    const filters: FilterCriteria = {
      cityName: selectedCity,
      categoryName: selectedCategory,
      minGuests: guestCount,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: selectedRating,
      pickupRequired:
        pickupAvailable && !pickupNeeded
          ? true
          : !pickupAvailable && pickupNeeded
          ? false
          : null,
      dateFrom,
    };
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border mb-6">
        <Filter className="w-5 h-5 text-foreground" />
        <h3 className="text-lg font-bold text-foreground">Search By Filter</h3>
      </div>

      {/* Destination (City) */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span>Destination</span>
          </div>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg appearance-none bg-background text-foreground pr-10"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="All">All Destinations</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Category Type */}
      <div className="mb-4">
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Category</span>
          </div>
          <select
            className="w-full px-3 py-2 border border-border rounded-lg appearance-none bg-background text-foreground pr-10"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
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
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
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
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([minPrice, parseInt(e.target.value)])}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {priceRange[0] === priceRange[1] ? (
              <>
                Price: {currency}
                {priceRange[0]}
              </>
            ) : (
              <>
                Price: {currency}
                {priceRange[0]} - {currency}
                {priceRange[1]}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Traveler Rating */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Star className="w-4 h-4" />
          Minimum Rating
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRating(0)}
            className={`flex-1 py-2 rounded-lg border transition-colors ${
              selectedRating === 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="text-sm font-medium">Any</span>
          </button>
          {[3, 4, 5].map((rating) => (
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
                <span className="text-sm font-medium">{rating}+</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pickup Options */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-foreground mb-3">
          Pickup Options
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="pickup-available"
              checked={pickupAvailable}
              onCheckedChange={(checked) => {
                setPickupAvailable(checked as boolean);
                if (checked) setPickupNeeded(false);
              }}
            />
            <label
              htmlFor="pickup-available"
              className="text-sm text-foreground cursor-pointer"
            >
              Pickup Required
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="no-pickup"
              checked={pickupNeeded}
              onCheckedChange={(checked) => {
                setPickupNeeded(checked as boolean);
                if (checked) setPickupAvailable(false);
              }}
            />
            <label
              htmlFor="no-pickup"
              className="text-sm text-foreground cursor-pointer"
            >
              No Pickup Needed
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCity("All");
          setSelectedCategory("All");
          setGuestCount(1);
          setPriceRange([minPrice, maxPrice]);
          setSelectedRating(0);
          setPickupAvailable(false);
          setPickupNeeded(false);
          setDateFrom("");
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
