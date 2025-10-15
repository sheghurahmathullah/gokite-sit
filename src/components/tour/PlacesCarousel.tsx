import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Place {
  id: string;
  name: string;
  image: string;
}

interface PlacesCarouselProps {
  places: Place[];
}

const PlacesCarousel = ({ places }: PlacesCarouselProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Place You'll See</h2>
      
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {places.map((place) => (
            <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/4">
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg group">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-[200px] object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="text-foreground font-medium">{place.name}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-foreground text-background hover:bg-foreground/90 border-none" />
        <CarouselNext className="bg-foreground text-background hover:bg-foreground/90 border-none" />
      </Carousel>
    </div>
  );
};

export default PlacesCarousel;
