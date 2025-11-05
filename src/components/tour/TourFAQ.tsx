import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FAQ {
  id: string;
  question: string;
  answer: string;
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
                    <div className="w-5 h-5 relative flex-shrink-0">
                      <Image
                        src="/images/holidays/include.png"
                        alt="FAQ"
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
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

              <CollapsibleContent>
                <div className="py-4 pl-[44px] pr-4">
                  <div className="text-foreground/70 leading-relaxed whitespace-pre-line">
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
