import { useState } from "react";
import { CheckCircle2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  hasCheck?: boolean;
}

interface TourFAQProps {
  faqs: FAQ[];
}

const TourFAQ = ({ faqs }: TourFAQProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">FAQ</h2>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openItems.includes(faq.id);

          return (
            <Collapsible
              key={faq.id}
              open={isOpen}
              onOpenChange={() => toggleItem(faq.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    {faq.hasCheck ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-foreground/50 flex-shrink-0" />
                    )}
                    <span className="font-medium text-foreground text-left">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-foreground/70 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground/70 flex-shrink-0" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2">
                <div className="p-4 border border-border ml-12">
                  <div className="text-foreground/70 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default TourFAQ;
