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
import DestinationCard from "@/components/common/DestinationCard";

interface HolidayCarouselProps {
  destinations: any[];
}

export interface HolidayCarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

const HolidayCarousel = forwardRef<HolidayCarouselRef, HolidayCarouselProps>(
  ({ destinations }, ref) => {
    const [api, setApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Duplicate items for seamless infinite loop if we have fewer items
    const displayDestinations =
      destinations.length < 8
        ? [...destinations, ...destinations, ...destinations]
        : destinations;

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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      scrollNext: () => api?.scrollNext(),
      scrollPrev: () => api?.scrollPrev(),
      canScrollNext,
      canScrollPrev,
    }));

    return (
      <div className="relative pb-8 bg-white">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
            slidesToScroll: 1, // Scroll one card at a time
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
            {/* Render destinations for seamless loop */}
            {displayDestinations.map((destination, index) => (
              <CarouselItem
                key={`${destination.id || destination.name}-${index}`}
                className="pl-6 md:basis-1/2 lg:basis-1/4 xl:basis-1/4"
              >
                <div className="h-full">
                  <DestinationCard destination={destination} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
);

HolidayCarousel.displayName = "HolidayCarousel";

export default HolidayCarousel;
