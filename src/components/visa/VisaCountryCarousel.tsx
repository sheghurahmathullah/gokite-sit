"use client";

import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";

interface VisaCountry {
  id: string;
  country: string;
  countryCode: string;
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
  flagImageUrl?: string;
  subtitle?: string;
}

interface VisaCardProps {
  visa: VisaCountry;
  type?: "popular" | "trending";
  subtitle?: string;
  hasVisaTag?: boolean;
  onClick?: () => void;
}

const VisaCard = ({
  visa,
  type = "popular",
  subtitle,
  hasVisaTag,
  onClick,
}: VisaCardProps) => {
  const FlagComponent =
    Flags[visa.countryCode.toUpperCase() as keyof typeof Flags];

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex-shrink-0"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div
          className={
            type === "trending"
              ? "flex items-center justify-between mb-1"
              : "mb-1"
          }
        >
          {visa.flagImageUrl ? (
            <img
              src={visa.flagImageUrl}
              alt={`${visa.country} flag`}
              className="w-12 h-12 rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const nextSibling = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = "block";
              }}
            />
          ) : null}
          {FlagComponent && (
            <FlagComponent
              className="w-12 h-12 rounded"
              style={{ display: visa.flagImageUrl ? "none" : "block" }}
            />
          )}
          {hasVisaTag && (
            <img
              src="/visa/visa-icon.png"
              alt="Visa"
              className="w-8 h-6 ml-auto"
            />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base mb-0.5">
            {visa.country}
          </h3>
          {type === "popular" ? (
            <p className="text-xs text-gray-500 mb-3">{visa.visaType}</p>
          ) : (
            subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-semibold text-gray-900">
              {visa.currency}
              {visa.price.toLocaleString()}
            </span>
            {visa.perAdult && (
              <span className="text-xs text-gray-500">per adult</span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-yellow-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

interface VisaCountryCarouselProps {
  countries: VisaCountry[];
  type?: "popular" | "trending";
  onCardClick?: (visa: VisaCountry) => void;
}

export interface VisaCountryCarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

const VisaCountryCarousel = forwardRef<
  VisaCountryCarouselRef,
  VisaCountryCarouselProps
>(({ countries, type = "popular", onCardClick }, ref) => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoplayRef = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
      playOnInit: true, // Start playing immediately
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useImperativeHandle(ref, () => ({
    scrollNext: () => api?.scrollNext(),
    scrollPrev: () => api?.scrollPrev(),
    canScrollNext,
    canScrollPrev,
  }));

  return (
    <div className="relative pb-4 bg-white">
      <Carousel
        setApi={setApi}
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
          {countries.map((country, index) => (
            <CarouselItem
              key={`${country.id}-${index}`}
              className="pl-4 basis-auto"
            >
              <div className="w-[260px]">
                <VisaCard
                  visa={country}
                  type={type}
                  subtitle={
                    type === "trending" ? "Get your Visa by 24hours" : undefined
                  }
                  hasVisaTag={
                    type === "trending" &&
                    (country.eVisa ||
                      country.visaType.toLowerCase().includes("e-visa"))
                  }
                  onClick={() => onCardClick?.(country)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
});

VisaCountryCarousel.displayName = "VisaCountryCarousel";

export default VisaCountryCarousel;
