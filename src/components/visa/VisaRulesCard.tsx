import { FileText } from "lucide-react";
import { lazy, Suspense } from "react";

interface VisaRuleAnnouncement {
  id: string;
  country: string;
  countryCode: string;
  title: string;
  description: string;
  date: string;
  logoImage?: string;
  cardImage?: string;
}

interface VisaRulesCardProps {
  rule: VisaRuleAnnouncement;
}

const VisaRulesCard = ({ rule }: VisaRulesCardProps) => {
  const FlagComponent = lazy(() => {
    // Use a switch statement to handle known country codes
    switch (rule.countryCode) {
      case "US":
        return import("country-flag-icons/react/3x2/US");
      case "GB":
        return import("country-flag-icons/react/3x2/GB");
      case "CA":
        return import("country-flag-icons/react/3x2/CA");
      case "AU":
        return import("country-flag-icons/react/3x2/AU");
      case "IN":
        return import("country-flag-icons/react/3x2/IN");
      default:
        // Fallback to US flag for unknown country codes
        return import("country-flag-icons/react/3x2/US");
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative w-full max-w-sm">
      {/* Flag and Country Name */}
      <div className="flex flex-col items-start gap-2 px-6 pt-6 pb-4">
        <span className="block w-10 h-7 rounded overflow-hidden shadow-sm">
          <Suspense fallback={<div className="w-full h-full bg-gray-200" />}>
            <FlagComponent className="w-full h-full object-cover" />
          </Suspense>
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
      <div className="px-6 pb-6 pt-2">
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

export default VisaRulesCard;
export type { VisaRuleAnnouncement, VisaRulesCardProps };
