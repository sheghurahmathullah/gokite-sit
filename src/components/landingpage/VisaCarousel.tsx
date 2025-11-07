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
import VisaCard from "./VisaCard";

interface VisaCarouselProps {
  destinations: any[];
}

export interface VisaCarouselRef {
  scrollNext: () => void;
  scrollPrev: () => void;
  canScrollNext: boolean;
  canScrollPrev: boolean;
}

const VisaCarousel = forwardRef<VisaCarouselRef, VisaCarouselProps>(
  ({ destinations }, ref) => {
    const [api, setApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(true);
    const [canScrollNext, setCanScrollNext] = useState(true);

    // Duplicate destinations for seamless infinite loop
    const loopedDestinations = destinations.length > 0 
      ? [...destinations, ...destinations, ...destinations] 
      : destinations;

    const autoplayRef = useRef(
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
        playOnInit: true,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      })
    );

    useEffect(() => {
      if (!api) {
        return;
      }

      const onSelect = () => {
        // Always allow scrolling in loop mode
        setCanScrollPrev(true);
        setCanScrollNext(true);
      };

      onSelect();
      api.on("select", onSelect);
      api.on("reInit", onSelect);

      return () => {
        api.off("select", onSelect);
        api.off("reInit", onSelect);
      };
    }, [api]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      scrollNext: () => api?.scrollNext(),
      scrollPrev: () => api?.scrollPrev(),
      canScrollNext: true,
      canScrollPrev: true,
    }));

    return (
      <div className="relative pb-8 bg-white">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
            slidesToScroll: 1,
            skipSnaps: false,
            duration: 30,
            watchDrag: true,
            containScroll: false,
          }}
          plugins={[autoplayRef.current]}
          className="w-full"
          onMouseEnter={() => autoplayRef.current.stop()}
          onMouseLeave={() => autoplayRef.current.play()}
        >
          <CarouselContent className="-ml-4">
            {loopedDestinations.map((destination, index) => (
              <CarouselItem
                key={`${destination.id}-${index}`}
                className="pl-4 md:basis-1/2 lg:basis-1/4 xl:basis-1/4"
              >
                <div className="max-w-sm mx-auto">
                  <VisaCard destination={destination} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
);

VisaCarousel.displayName = "VisaCarousel";

export default VisaCarousel;
