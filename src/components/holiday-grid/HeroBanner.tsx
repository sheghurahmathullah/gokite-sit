import { useState } from "react";
import {
  Umbrella,
  Mountain,
  Building,
  Home,
  FerrisWheel,
  Snowflake,
  Dog,
  MapPin,
} from "lucide-react";

const categories = [
  { id: "beaches", label: "Beaches", icon: Umbrella },
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "world-wonder", label: "World Wonder", icon: MapPin },
  { id: "iconic-city", label: "Iconic city", icon: Building },
  { id: "countryside", label: "Countryside", icon: Home },
  { id: "kids-wonderland", label: "Kids Wonderland", icon: FerrisWheel },
  { id: "skiing", label: "Skiing", icon: Snowflake },
  { id: "wildlife", label: "Wildlife", icon: Dog },
];

const HeroBanner = () => {
  const [activeCategory, setActiveCategory] = useState("beaches");

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-cover bg-center rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden mx-2 sm:mx-4 mt-2 sm:mt-4"
      style={{
        backgroundImage: "url('/holidaygrid/banner.jpg')",
      }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 h-full flex flex-col justify-between max-w-[1400px] pb-4 sm:pb-8">
        {/* Top content */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full pt-4 sm:pt-8 gap-4 sm:gap-0">
          {/* Left side content */}
          <div className="max-w-xl text-center sm:text-left">
            <p className="text-white text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              Trip Packages
            </p>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2 sm:mb-4">
              Best Recommendation
              <br />
              Destination For You
            </h1>
          </div>

          {/* Right side paragraph */}
          <div className="max-w-md hidden sm:block">
            <p className="text-white text-sm sm:text-base leading-relaxed">
              Discover your next adventure with our curated list of the best
              recommendation trips just for you. Whether seeking exploration,
              let us guide you to unforgettable destination that will create
              lasting memories
            </p>
          </div>
        </div>

        {/* Category Section */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 flex flex-col">
          {/* Category Icons */}
          <div className="flex items-left justify-left gap-4 sm:gap-6 md:gap-10 mb-2 sm:mb-4 overflow-x-auto scrollbar-hide pb-1 pt-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 min-w-fit transition-all ${
                    isActive ? "opacity-100" : "opacity-70 hover:opacity-90"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  <span className="text-white text-xs sm:text-sm whitespace-nowrap">
                    {category.label}
                  </span>
                  {isActive && (
                    <div className="w-full h-[2px] sm:h-[3px] bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Active Category Title - Aligned Left */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-left pl-4 sm:pl-8">
          {categories.find((cat) => cat.id === activeCategory)?.label}
        </h2>
      </div>
    </div>
  );
};

export default HeroBanner;
