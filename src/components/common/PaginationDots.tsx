import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationDotsProps {
  totalDots?: number;
  activeIndex?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

const PaginationDots = ({ 
  totalDots = 3, 
  activeIndex = 0,
  onPrevious,
  onNext 
}: PaginationDotsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrevious}
        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalDots }).map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all ${
              index === activeIndex 
                ? "w-2 h-2 bg-black" 
                : "w-1.5 h-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PaginationDots;
