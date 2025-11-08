import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ItineraryItem {
  id: string;
  day: string;
  time: string;
  title: string;
  description: string;
}

interface TourItineraryProps {
  itinerary: ItineraryItem[];
  itineraryMainDescription?: string;
}

const TourItinerary = ({ itinerary, itineraryMainDescription }: TourItineraryProps) => {
  const [expandAll, setExpandAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenItems([]);
    } else {
      setOpenItems(itinerary.map((item) => item.id));
    }
    setExpandAll(!expandAll);
  };

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Itinerary</h2>
        <button
          onClick={handleExpandAll}
          className="text-[#4AB8B8] hover:underline text-sm"
        >
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {itineraryMainDescription && (
        <div className="mb-6">
          <p className="text-foreground/80 leading-relaxed">
            {itineraryMainDescription}
          </p>
        </div>
      )}

      <div className="space-y-4 relative">
        {itinerary.map((item, index) => {
          const itemId = item.id || `item-${index}`;
          const isOpen = openItems.includes(itemId);
          const isLast = index === itinerary.length - 1;

          return (
            <Collapsible
              key={itemId}
              open={isOpen}
              onOpenChange={() => toggleItem(itemId)}
            >
              <div className="relative pl-8">
                {/* Timeline dot - centered with text */}
                <div className="absolute left-0 top-[22px] w-4 h-4 rounded-full bg-foreground border-4 border-background z-10" />
                
                {/* Timeline line - connects bottom of current dot through gap to next dot */}
                {!isLast && (
                  <div className="absolute left-[7px] top-[38px] bottom-[-38px] w-[2px] bg-border" />
                )}

                <CollapsibleTrigger className="w-full text-left group">
                  <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/20 transition-colors">
                    <div>
                      <span className="font-semibold text-foreground">
                        {item.day}
                        {item.time ? ` ${item.time}` : ""}
                      </span>
                      <span className="text-foreground/70 ml-2">
                        - {item.title}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-foreground/70" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground/70" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="py-4 pl-4 pr-4">
                    <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default TourItinerary;
