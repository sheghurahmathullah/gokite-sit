import PaginationDots from "@/components/common/PaginationDots";

interface SectionHeaderProps {
  title: string;
  showPagination?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  totalDots?: number;
  activeIndex?: number;
}

const SectionHeader = ({ 
  title, 
  showPagination = false,
  onPrevious,
  onNext,
  totalDots = 3,
  activeIndex = 0
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
        {title}
      </h2>
      {showPagination && (
        <PaginationDots 
          totalDots={totalDots}
          activeIndex={activeIndex}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      )}
    </div>
  );
};

export default SectionHeader;
