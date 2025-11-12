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
