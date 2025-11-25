import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Static slug mappings - no extra API calls needed
const PAGE_SLUGS = {
  home: "/master-landing-page",
  holidays: "/holiday-home-page",
  visa: "/visa-landing-page",
};

interface TopNavProps {
  isSticky?: boolean;
}

const TopNav = ({ isSticky = true }: TopNavProps) => {
  const pathname = usePathname();

  const iconNavItems = [
    {
      id: "Home",
      label: "Home",
      imgSrc: "/landingpage/icons/home.png",
      redirectUrl: PAGE_SLUGS.home,
    },
    {
      id: "Flight",
      label: "Flight",
      imgSrc: "/landingpage/icons/flight.png",
      redirectUrl: "/flights",
    },
    {
      id: "Activities",
      label: "Activities",
      imgSrc: "/landingpage/icons/activity.png",
      redirectUrl: "/activities",
    },
    {
      id: "Holidays",
      label: "Holidays",
      imgSrc: "/landingpage/icons/holiday.png",
      redirectUrl: PAGE_SLUGS.holidays,
    },
    {
      id: "Hotel",
      label: "Hotel",
      imgSrc: "/landingpage/icons/hotel.png",
      redirectUrl: "/hotels",
    },
    {
      id: "Visa",
      label: "Visa",
      imgSrc: "/landingpage/icons/visa.png",
      redirectUrl: PAGE_SLUGS.visa,
    },
    {
      id: "More",
      label: "More",
      imgSrc: "/landingpage/icons/more.png",
      redirectUrl: "/more",
    },
  ];

  const isActive = (item: (typeof iconNavItems)[0]) => {
    if (item.redirectUrl === PAGE_SLUGS.home) {
      return (
        pathname === "/" ||
        pathname === PAGE_SLUGS.home ||
        pathname.startsWith("/master-landing-page")
      );
    }
    if (item.redirectUrl === PAGE_SLUGS.holidays) {
      return (
        pathname === PAGE_SLUGS.holidays ||
        pathname.startsWith("/holiday-home-page")
      );
    }
    if (item.redirectUrl === PAGE_SLUGS.visa) {
      return (
        pathname === PAGE_SLUGS.visa ||
        pathname.startsWith("/visa-landing-page")
      );
    }
    return pathname.startsWith(item.redirectUrl) && item.redirectUrl !== "#";
  };

  return (
    <nav
      className={`${
        isSticky ? "sticky top-0 z-50" : ""
      } w-full px-6 lg:px-12 py-4 flex items-center justify-between bg-background`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href={PAGE_SLUGS.home} className="cursor-pointer">
          <img src="/gokite.png" alt="GoKite" className="h-20" />
        </Link>
      </div>

      {/* Icon navigation */}
      <div className="flex gap-4 lg:gap-12 flex-1 mx-8 ml-16">
        {iconNavItems.map((item) => {
          const active = isActive(item);
          const isHashLink = item.redirectUrl === "#";

          return isHashLink ? (
            <button
              key={item.id}
              onClick={(e) => e.preventDefault()}
              className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
            >
              <div className="w-8 h-8 lg:w-8 lg:h-8 rounded-full bg-white shadow-lg flex  group-hover:shadow-xl transition-shadow">
                <img
                  src={item.imgSrc}
                  alt={item.label}
                  className="w-6 h-6 lg:w-12 lg:h-12 object-contain"
                />
              </div>
              <div className="relative">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-1 bg-yellow-400 rounded-full"></div>
                )}
              </div>
            </button>
          ) : (
            <Link
              key={item.id}
              href={item.redirectUrl}
              onClick={() =>
                console.log("[IconNav] Navigating to:", item.redirectUrl)
              }
              className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
            >
              <div className="w-8 h-8 lg:w-8 lg:h-8 rounded-full bg-white shadow-lg flex  group-hover:shadow-xl transition-shadow">
                <img
                  src={item.imgSrc}
                  alt={item.label}
                  className="w-6 h-6 lg:w-12 lg:h-12 object-contain"
                />
              </div>
              <div className="relative">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-1 bg-yellow-400 rounded-full"></div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Button */}
      <Button
        variant="default"
        size="sm"
        className="rounded-full px-6 bg-black text-primary-foreground"
      >
        Sign in
      </Button>
    </nav>
  );
};

export default TopNav;
