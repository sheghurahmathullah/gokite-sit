import { useState } from "react";
import { FileText } from "lucide-react";

interface TourOverviewProps {
  tour: {
    title: string;
    description: string;
    fullDescription: string;
  };
}

const navItems = [
  { label: "Overview" },
  { label: "Itinerary" },
  { label: "What's Included" },
  { label: "FAQs" },
];

const TourOverview = ({ tour }: TourOverviewProps) => {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className=" max-w-7xl mt-6">
      {/* Buttons Row */}
      <div className="flex gap-4 mb-8">
        {navItems.map((item, idx) => (
          <button
            key={item.label}
            className={`px-6 py-2 rounded-full text-base transition ${
              idx === 0
                ? "bg-foreground text-background font-semibold shadow"
                : "bg-background text-foreground/70 border border-foreground/10"
            }`}
            disabled
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 rounded">
        {/* Left: Overview Content */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {tour.title}
          </h2>
          <p className="text-foreground/70 leading-relaxed text-[1.12rem]">
            {showFullText ? tour.fullDescription : tour.description}
          </p>
          {!showFullText && (
            <button
              onClick={() => setShowFullText(true)}
              className="text-[#4AB8B8] hover:underline mt-2 text-base"
            >
              Read More...
            </button>
          )}
        </div>

        {/* Right: Download Brochure Card */}
        <div className="flex flex-col justify-start lg:col-start-3">
          <div className="border border-foreground/10 rounded-xl p-6 bg-background/60 shadow-sm">
            <p className="text-foreground/70 mb-2 text-base">
              Plan your adventure:
            </p>
            <a
              href="#"
              className="flex items-center gap-2 text-[#4AB8B8] hover:underline font-medium"
            >
              <FileText className="w-4 h-4" />
              Download PDF Brochure
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourOverview;
