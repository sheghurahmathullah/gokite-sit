import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ItineraryItem {
  day: string;
  time: string;
  title: string;
  description: string;
}

interface TourItineraryProps {
  itinerary: ItineraryItem[];
}

const TourItinerary = ({ itinerary }: TourItineraryProps) => {
  const [expandAll, setExpandAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenItems([]);
    } else {
      setOpenItems(itinerary.map((_, index) => `item-${index}`));
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

      <div className="space-y-4 relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-border" />

        {itinerary.map((item, index) => {
          const itemId = `item-${index}`;
          const isOpen = openItems.includes(itemId);

          return (
            <Collapsible
              key={itemId}
              open={isOpen}
              onOpenChange={() => toggleItem(itemId)}
            >
              <div className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-foreground border-4 border-background" />

                <CollapsibleTrigger className="w-full text-left group">
                  <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/20 transition-colors">
                    <div>
                      <span className="font-semibold text-foreground">
                        {item.day} ({item.time})
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

                <CollapsibleContent className="mt-2">
                  <div className="p-4 border border-border">
                    <p className="text-foreground/70">{item.description}</p>
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
