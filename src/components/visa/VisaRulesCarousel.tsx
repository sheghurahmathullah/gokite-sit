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
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative w-full h-[280px] cursor-pointer hover:shadow-md transition-all flex flex-col"
      onClick={onClick}
    >
      {/* Flag and Country Name */}
      <div className="flex flex-col items-start gap-2 px-6 pt-6 pb-4 flex-shrink-0">
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
        <h3 className="font-bold text-2xl text-gray-900 max-w-[calc(100%-180px)] break-words">
          {rule.title || rule.country}
        </h3>
      </div>

      {/* Card/Document Image - Top Right */}
      {rule.cardImage && (
        <div className="absolute -top-2 right-6">
          <img
            src={`/api/cms/file-download?image=${encodeURIComponent(
              rule.cardImage
            )}`}
            alt="Digital Card"
            className="w-32 h-32 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 pb-16 pt-2 flex-1 overflow-hidden">
        <p
          className="text-gray-700 text-[15px] leading-relaxed overflow-hidden text-ellipsis"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            maxHeight: "85px", // 3.5 lines: 15px * 1.625 (leading-relaxed) * 3.5 ≈ 85px
            lineHeight: "1.625",
          }}
        >
          {rule.description}
        </p>
      </div>

      {/* Logo - Bottom Right */}
      <div className="absolute bottom-5 right-6">
        <img
          src="/gokite.png"
          alt="Logo"
          className="h-6 w-auto object-contain"
        />
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
        <CarouselContent className="-ml-6">
          {/* Render rules directly - loop handled by Embla */}
          {rules.map((rule, index) => (
            <CarouselItem
              key={`${rule.uniqueId || rule.id}-${index}`}
              className="pl-6 md:basis-1/2 lg:basis-1/3"
            >
              <div className="w-full max-w-[380px]">
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
