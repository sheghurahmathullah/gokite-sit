import { VisaDestination } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";

interface VisaCardProps {
  destination: VisaDestination;
}

const formatDate = (
  processingDays?: string | number,
  processingTime?: string | number
) => {
  // Start from current date/time
  const date = new Date();

  // Add processing_days to current date if provided
  if (processingDays) {
    const daysToAdd = parseInt(String(processingDays), 10);
    if (!isNaN(daysToAdd)) {
      date.setDate(date.getDate() + daysToAdd);
    }
  }

  // Add processing_time (hours) to current time if provided
  if (processingTime) {
    const hoursToAdd = parseInt(String(processingTime), 10);
    if (!isNaN(hoursToAdd)) {
      date.setHours(date.getHours() + hoursToAdd);
    }
  }

  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${day} ${month}, ${hours}:${minutesStr}${ampm}`;
};

const VisaCard = ({ destination }: VisaCardProps) => {
  const router = useRouter();
  const params = useParams();
  const currentSlug = params.slug as string || "master-landing-page";

  // Format the fast track date using processing_days and processing_time
  const fastTrackText = formatDate(
    destination.processing_days,
    destination.processing_time
  );

  // Format the get on date using processing_days and processing_time
  const getOnDate = formatDate(
    destination.processing_days,
    destination.processing_time
  );

  // Handle card click - validate visa availability before navigation
  const handleCardClick = async () => {
    try {
      console.log("[VisaCard] Clicked on visa card for:", destination.country);
      
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

      if (!match?.id) {
        console.error("[VisaCard] Country id not found for:", destination.country);
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const countryId = String(match.id);
      console.log("[VisaCard] Validating visa data for country:", countryId);

      // Store country ID
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("applyVisaCountryId", countryId);
        }
      } catch (_) {}

      // Validate country has visa data before redirecting
      const visaResponse = await fetch("/api/cms/visa-country-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: countryId }),
      });

      console.log("[VisaCard] API response status:", visaResponse.status);

      // Check if response is not OK
      if (!visaResponse.ok) {
        console.error("[VisaCard] API call failed with status:", visaResponse.status);
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const visaData = await visaResponse.json();
      console.log("[VisaCard] API response data:", visaData);
      
      // Validate response structure and data
      if (!visaData.success || !visaData.data || !Array.isArray(visaData.data) || visaData.data.length === 0) {
        console.warn("[VisaCard] Invalid or empty visa data:", visaData);
        toast.error("The country is not found or no visa is available", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Valid data found - store the visa details and redirect
      console.log("[VisaCard] Valid visa data found, redirecting to apply-visa");
      
      // Store the visa details for the apply-visa page
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("applyVisaDetails", JSON.stringify(visaData.data[0]));
        }
      } catch (_) {}

      // Redirect to apply-visa page (always use nested route)
      // Use the current slug from URL params instead of sessionStorage
      // Also store it in sessionStorage as a fallback for other components
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("currentPageSlug", currentSlug);
        } catch (_) {}
      }
      router.push(`/${currentSlug}/apply-visa`);
      
    } catch (e) {
      console.error("[VisaCard] Error validating visa:", e);
      toast.error("The country is not found or no visa is available", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-2 group cursor-pointer h-full flex flex-col mb-6"
      style={{ backgroundColor: "#fafafa" }}
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
            {destination.priceRange.currency + " "}
            {destination.priceRange.min.toLocaleString()} +{" "}
            {destination.priceRange.currency + " "}
            {destination.priceRange.max.toLocaleString()} ={" "}
            {destination.priceRange.currency + " "}
            {destination.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {destination.country}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          Get on{" "}
          <span className="font-semibold text-[#3790ad]">{getOnDate}</span>
        </p>
        {/* Price */}
        <div className="text-2xl text-black font-semibold">
          {destination.priceRange.currency + " "}
          {destination.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
