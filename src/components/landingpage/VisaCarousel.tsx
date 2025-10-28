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
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const autoplayRef = useRef(
      Autoplay({
        delay: 3000,
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

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      scrollNext: () => api?.scrollNext(),
      scrollPrev: () => api?.scrollPrev(),
      canScrollNext,
      canScrollPrev,
    }));

    return (
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
            slidesToScroll: 1, // Scroll one card at a time
            skipSnaps: false,
            containScroll: false, // Allow full looping without containment
          }}
          plugins={[autoplayRef.current]}
          className="w-full"
          onMouseEnter={() => autoplayRef.current.stop()}
          onMouseLeave={() => autoplayRef.current.play()}
        >
          <CarouselContent className="-ml-4">
            {/* Duplicate destinations array to create seamless infinite loop */}
            {[...destinations, ...destinations, ...destinations].map(
              (destination, index) => (
                <CarouselItem
                  key={`${destination.id}-${index}`}
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 transition-all duration-700 ease-in-out"
                >
                  <VisaCard destination={destination} />
                </CarouselItem>
              )
            )}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
);

VisaCarousel.displayName = "VisaCarousel";

export default VisaCarousel;
