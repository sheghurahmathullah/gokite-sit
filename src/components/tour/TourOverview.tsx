import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

interface TourOverviewProps {
  tour: {
    title: string;
    description: string;
    fullDescription: string;
    brochure?: string;
  };
}

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "Itinerary", id: "itinerary" },
  { label: "What's Included", id: "whats-included" },
  { label: "FAQs", id: "faqs" },
];

const TourOverview = ({ tour }: TourOverviewProps) => {
  const [showFullText, setShowFullText] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Get the full description text
  const fullText = tour.fullDescription || tour.description;
  const words = fullText.split(" ");
  const wordLimit = 50;

  // Create truncated text with first 50 words
  const truncatedText = words.slice(0, wordLimit).join(" ");
  const hasMoreContent = words.length > wordLimit;

  // Scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset from top for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Scrollspy: Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for better UX

      // Find which section is currently in view
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="overview" className=" max-w-7xl mt-6">
      {/* Buttons Row */}
      <div className="flex gap-4 mb-8">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.id)}
            className={`px-6 py-2 rounded-full text-base transition cursor-pointer hover:shadow-md ${
              activeSection === item.id
                ? "bg-foreground text-background font-semibold shadow"
                : "bg-background text-foreground/70 border border-foreground/10 hover:border-foreground/30"
            }`}
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
    </div>
  );
};

export default TourOverview;
