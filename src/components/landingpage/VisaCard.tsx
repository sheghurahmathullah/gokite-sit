import { VisaDestination } from "@/types";

interface VisaCardProps {
  destination: VisaDestination;
}

const formatDate = (dateString: string) => {
  // Parse the full date string and return only the date part
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const VisaCard = ({ destination }: VisaCardProps) => {
  // If fastTrack is an object, extract the relevant information
  const fastTrackText =
    typeof destination.fastTrack === "object"
      ? formatDate(destination.fastTrack.date)
      : destination.fastTrack;

  // Format the get on date
  const getOnDate = formatDate(
    destination.getOn?.date || destination.departureDate
  );

  return (
    <div className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-2 group">
      {/* Image with overlays */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.country}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Fast track label */}
        <div className="absolute bottom-4 left-0 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-r-full rounded-l-none">
          <p className="text-xs font-medium text-foreground">
            Fast track{" "}
            <span className="font-semibold text-[#3790ad]">
              {fastTrackText}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {destination.priceRange.currency}
            {destination.priceRange.min.toLocaleString()} +{" "}
            {destination.priceRange.currency}
            {destination.priceRange.max.toLocaleString()} ={" "}
            {destination.priceRange.currency}
            {destination.priceRange.max.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-card">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {destination.country}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Get on{" "}
          <span className="font-semibold text-[#3790ad]">{getOnDate}</span>
        </p>
        {/* Price */}
        <div className="text-2xl text-black font-semibold">
          {destination.priceRange.currency}
          {destination.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
