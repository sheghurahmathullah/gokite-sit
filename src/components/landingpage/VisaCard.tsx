import { VisaDestination } from "@/types";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // If fastTrack is an object, extract the relevant information
  const fastTrackText =
    typeof destination.fastTrack === "object"
      ? formatDate(destination.fastTrack.date)
      : destination.fastTrack;

  // Format the get on date
  const getOnDate = formatDate(
    destination.getOn?.date || destination.departureDate
  );

  // Handle card click - fetch country ID and store in session storage
  const handleCardClick = async () => {
    try {
      // Fetch country ID from API
      const res = await fetch("/api/cms/countries-dd-proxy", {
        cache: "no-store",
      });
      const payload = await res.json();

      const rows = Array.isArray(payload?.data?.data) ? payload.data.data : [];

      const norm = (v: any) =>
        typeof v === "string" ? v.trim().toLowerCase() : "";
      const match = rows.find(
        (r: any) => norm(r?.label) === norm(destination.country)
      );

      if (match?.id) {
        console.log("Selected visa country id:", match.id);
        try {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem("applyVisaCountryId", String(match.id));
          }
        } catch (_) {}
      } else {
        console.log("Country id not found for:", destination.country);
      }
    } catch (e) {
      console.error("Failed to fetch country id:", e);
    }

    // Navigate to apply-visa page
    router.push("/apply-visa");
  };

  return (
    <div 
      className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
      onClick={handleCardClick}
    >
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
