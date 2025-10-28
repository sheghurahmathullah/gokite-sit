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
import * as Flags from "country-flag-icons/react/3x2";

interface VisaRuleAnnouncement {
  id: string;
  country: string;
  countryCode: string;
  title?: string;
  description: string;
  date?: string;
  logoImage?: string;
  cardImage?: string;
  flagImageUrl?: string;
  uniqueId?: string;
}

interface VisaRuleCardProps {
  rule: VisaRuleAnnouncement;
  onClick: () => void;
}

const VisaRuleCard = ({ rule, onClick }: VisaRuleCardProps) => {
  const FlagComponent =
    Flags[rule.countryCode.toUpperCase() as keyof typeof Flags] || Flags.US;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative w-full cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      {/* Flag and Country Name */}
      <div className="flex flex-col items-start gap-2 px-6 pt-6 pb-4">
        <span className="block w-10 h-7 rounded overflow-hidden shadow-sm">
          {rule.flagImageUrl ? (
            <img
              src={rule.flagImageUrl}
              alt={`${rule.country} flag`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const nextSibling = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <FlagComponent
            className="w-full h-full object-cover"
            style={{ display: rule.flagImageUrl ? "none" : "block" }}
          />
        </span>
        <h3 className="font-bold text-2xl text-gray-900">{rule.country}</h3>
      </div>

      {/* Card/Document Image - Top Right */}
      <div className="absolute -top-2 right-6">
        <img
          src="/visa/visa-card.png"
          alt="Digital Card"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16 pt-2">
        <p className="text-gray-700 text-[15px] leading-relaxed">
          {rule.description}
        </p>
      </div>

      {/* Logo - Bottom Right */}
      <div className="absolute bottom-5 right-6">
        <img src="/logo.svg" alt="Logo" className="h-6 w-auto object-contain" />
      </div>
    </div>
  );
};

interface VisaRulesCarouselProps {
  rules: VisaRuleAnnouncement[];
  onCardClick?: (rule: VisaRuleAnnouncement) => void;
}

export interface VisaRulesCarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

const VisaRulesCarousel = forwardRef<
  VisaRulesCarouselRef,
  VisaRulesCarouselProps
>(({ rules, onCardClick }, ref) => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const autoplayRef = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: false,
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
          containScroll: false,
        }}
        plugins={[autoplayRef.current]}
        className="w-full"
        onMouseEnter={() => autoplayRef.current.stop()}
        onMouseLeave={() => autoplayRef.current.play()}
      >
        <CarouselContent className="-ml-6">
          {[...rules, ...rules, ...rules].map((rule, index) => (
            <CarouselItem
              key={`${rule.uniqueId || rule.id}-${index}`}
              className="pl-6 md:basis-1/2 lg:basis-1/3 transition-all duration-700 ease-in-out"
            >
              <div className="max-w-sm">
                <VisaRuleCard rule={rule} onClick={() => onCardClick?.(rule)} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
});

VisaRulesCarousel.displayName = "VisaRulesCarousel";

export default VisaRulesCarousel;
export type { VisaRuleAnnouncement };
