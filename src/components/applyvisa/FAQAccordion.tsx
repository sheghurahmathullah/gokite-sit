import React, { useState } from "react";
import { FAQ } from "@/types/visa";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  faqs: FAQ[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Frequently Asked Questions
        </h2>

        {/* Accordion */}
        <div className="space-y-4" aria-label="Frequently Asked Questions">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md border-none"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none border-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex items-start gap-3 flex-1 pr-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-base lg:text-lg font-medium text-foreground">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-foreground transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpen
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }
                  `}
                >
                  <div className="px-6 pb-5 pl-[60px]">
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
