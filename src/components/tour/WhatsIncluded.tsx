import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface IncludedItem {
  id: string;
  name: string;
  included: boolean;
  description?: string;
}

interface WhatsIncludedProps {
  included: IncludedItem[];
}

const WhatsIncluded = ({ included }: WhatsIncludedProps) => {
  const [expandAll, setExpandAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleExpandAll = () => {
    if (expandAll) {
      setOpenItems([]);
    } else {
      setOpenItems(included.map((item) => item.id));
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
        <h2 className="text-2xl font-bold text-foreground">What's Included</h2>
        <button
          onClick={handleExpandAll}
          className="text-[#4AB8B8] hover:underline text-sm"
        >
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-3">
        {included.map((item) => {
          const isOpen = openItems.includes(item.id);

          return (
            <Collapsible
              key={item.id}
              open={isOpen}
              onOpenChange={() => toggleItem(item.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    {item.included ? (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-foreground/70" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground/70" />
                  )}
                </div>
              </CollapsibleTrigger>

              {item.description && (
                <CollapsibleContent className="mt-2">
                  <div className="p-4 border border-border ml-12">
                    <p className="text-foreground/70">{item.description}</p>
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default WhatsIncluded;
