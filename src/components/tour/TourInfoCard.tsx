import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TourInfoCardProps {
  tour: {
    title: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    rating: number;
    ratingText: string;
  };
  onEnquire?: () => void; // Add this line
}

const TourInfoCard = ({ tour, onEnquire }: TourInfoCardProps) => {
  return (
    <div
      className="
      bg-white rounded-xl shadow-lg p-6 max-w-[380px] mx-auto space-y-4 sticky top-4
      md:max-w-[440px] md:p-8"
    >
      <h1 className="text-3xl font-bold text-foreground leading-tight">
        {tour.title}
      </h1>

      <div className="flex items-center gap-4 text-base text-foreground/70 font-medium">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{tour.location}</span>
        </div>
        <span className="text-xl">|</span>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{tour.duration}</span>
        </div>
      </div>

      <div className="text-3xl font-bold text-foreground">
        {tour.currency} {tour.price.toLocaleString()}
      </div>

      <div className="flex items-center gap-2">
        <Badge className="bg-green-500 text-white px-3 py-1 text-lg font-semibold rounded-md hover:bg-green-600">
          {tour.rating}
        </Badge>
        <span className="text-base text-foreground/90">{tour.ratingText}</span>
      </div>

      <Button
        onClick={onEnquire} // Add onClick handler
        className="w-full bg-[#FDB714] hover:bg-[#FDB714]/90 text-foreground font-semibold rounded-lg py-6 text-lg shadow-none"
      >
        Enquire
      </Button>
    </div>
  );
};

export default TourInfoCard;
