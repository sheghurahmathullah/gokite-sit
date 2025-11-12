import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const categories = [
  { id: "beaches", label: "Beaches", icon: "/holidaygrid/beach.png" },
  { id: "adventure", label: "Adventure", icon: "/holidaygrid/adventure.png" },
  {
    id: "world-wonder",
    label: "World Wonder",
    icon: "/holidaygrid/world wonder.png",
  },
  {
    id: "iconic-city",
    label: "Iconic city",
    icon: "/holidaygrid/iconic city.png",
  },
  {
    id: "countryside",
    label: "Countryside",
    icon: "/holidaygrid/country side.png",
  },
  {
    id: "kids-wonderland",
    label: "Kids Wonderland",
    icon: "/holidaygrid/kids wonderland.png",
  },
  { id: "skiing", label: "Skiing", icon: "/holidaygrid/skiing.png" },
  { id: "wildlife", label: "Wildlife", icon: "/holidaygrid/wildlife.png" },
];

const HeroBanner = () => {
  const [activeCategory, setActiveCategory] = useState("beaches");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const pathname = usePathname();
  const isHolidayListRoute = pathname?.includes("/holiday-list");

  // Get selected destination and category from session storage for holiday-list route
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get destination
      const destination = window.sessionStorage.getItem(
        "selectedHolidayDestination"
      );
      if (destination) {
        setSelectedDestination(destination);
      }

      // Get and set active category from session storage
      const storedCategory = window.sessionStorage.getItem(
        "selectedHolidayCategory"
      );
      if (storedCategory) {
        // Map category names to category IDs
        const categoryMap: Record<string, string> = {
          Beaches: "beaches",
          Adventure: "adventure",
          "World Wonder": "world-wonder",
          "Iconic city": "iconic-city",
          Countryside: "countryside",
          "Kids Wonderland": "kids-wonderland",
          Skiing: "skiing",
          Wildlife: "wildlife",
        };

        const mappedCategory =
          categoryMap[storedCategory] ||
          storedCategory.toLowerCase().replace(/\s+/g, "-");
        setActiveCategory(mappedCategory);
      }
    }
  }, [pathname]);

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-cover bg-center rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden mx-2 sm:mx-4 mt-2 sm:mt-4"
      style={{
        backgroundImage: "url('/holidaygrid/banner.jpg')",
      }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-8 h-full flex flex-col justify-center max-w-[1400px] pb-4 sm:pb-8">
        {isHolidayListRoute ? (
          /* Holiday List Route - Show destination title at top */
          <div className="pt-4 sm:pt-8 mb-4">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center">
              {selectedDestination || "Holiday Packages"}
            </h1>
          </div>
        ) : (
          /* Regular Route - Show full content */
          <>
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
                  recommendation trips just for you. Whether seeking
                  exploration, let us guide you to unforgettable destination
                  that will create lasting memories
                </p>
              </div>
            </div>
          </>
        )}

        {/* Category Section - Show on both routes */}
        {!isHolidayListRoute && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-3 sm:py-4 mb-8 border border-white/20">
            <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category.id);

                      // Store selected category in sessionStorage
                      if (typeof window !== "undefined") {
                        window.sessionStorage.setItem(
                          "selectedHolidayCategory",
                          category.label
                        );

                        // Trigger a custom event to notify the page about category change
                        window.dispatchEvent(
                          new CustomEvent("categoryChanged", {
                            detail: { category: category.label },
                          })
                        );
                      }
                    }}
                    className={`group flex-1 flex flex-col items-center justify-center px-1.5 sm:px-2 md:px-3 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 min-w-0 flex-shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 flex items-center justify-center">
                        <img
                          src={category.icon}
                          alt={category.label}
                          className="w-full h-full object-contain filter brightness-0 invert"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium whitespace-nowrap text-center">
                        {category.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className="mt-1 sm:mt-2 w-5 sm:w-6 md:w-8 h-0.5 sm:h-1 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Category Title - Aligned Left */}
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-left pl-4 sm:pl-8">
          {categories.find((cat) => cat.id === activeCategory)?.label}
        </h2>
      </div>
    </div>
  );
};

export default HeroBanner;
