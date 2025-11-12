import { useState } from "react";
import { FileText } from "lucide-react";

interface TourOverviewProps {
  tour: {
    title: string;
    description: string;
    fullDescription: string;
    brochure?: string;
  };
}

const TourOverview = ({ tour }: TourOverviewProps) => {
  const [showFullText, setShowFullText] = useState(false);

  // Get the full description text
  const fullText = tour.fullDescription || tour.description;
  const words = fullText.split(" ");
  const wordLimit = 50;

  // Create truncated text with first 50 words
  const truncatedText = words.slice(0, wordLimit).join(" ");
  const hasMoreContent = words.length > wordLimit;

  return (
    <div
      id="overview"
      className="grid grid-cols-1 lg:grid-cols-3 gap-12 rounded"
    >
      {/* Left: Overview Content */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {tour.title}
        </h2>
        <p className="text-foreground/70 leading-relaxed text-[1.12rem]">
          {showFullText ? fullText : truncatedText}
          {!showFullText && hasMoreContent && "..."}
        </p>
        {hasMoreContent && (
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="text-[#4AB8B8] hover:underline mt-2 text-base"
          >
            {showFullText ? "Read Less" : "Read More..."}
          </button>
        )}
      </div>

      {/* Right: Download Brochure Card */}
      <div className="flex flex-col justify-start lg:col-start-3">
        <div className="border border-foreground/10 rounded-xl p-6 bg-background/60 shadow-sm">
          <p className="text-foreground/70 mb-2 text-base">
            Plan your adventure:
          </p>
          {tour.brochure ? (
            <a
              href={`/api/cms/file-download?image=${encodeURIComponent(
                tour.brochure
              )}`}
              download={`${tour.title
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase()}_brochure.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#4AB8B8] hover:underline font-medium cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Download PDF Brochure
            </a>
          ) : (
            <span className="flex items-center gap-2 text-foreground/40 font-medium">
              <FileText className="w-4 h-4" />
              Brochure not available
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourOverview;
