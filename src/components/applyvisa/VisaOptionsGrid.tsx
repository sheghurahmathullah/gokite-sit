import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import VisaEnquiryForm from "./VisaEnquiryForm";

interface VisaOption {
  id: string;
  title: string;
  badge?: string;
  visaType: string;
  stayDuration: string;
  visaValidity: string;
  processingTime: string;
  originalPrice: number;
  discountedPrice: number;
  finalPrice: number;
}

interface VisaOptionsGridProps {
  options: VisaOption[];
}

const VisaOptionsGrid: React.FC<VisaOptionsGridProps> = ({ options }) => {
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<VisaOption | null>(null);

  const handleEnquireClick = (option: VisaOption) => {
    setSelectedOption(option);
    setIsEnquiryFormOpen(true);
  };

  return (
    <section className="w-full py-12 lg:py-16 bg-[#f2f8fc]">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {options.map((option, index) => (
            <div
              key={option.id}
              className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full"
            >
              {/* Header with badge */}
              <div className="bg-black text-yellow-400 px-6 py-4 relative flex items-center justify-between">
                <h3 className="text-base font-bold">{option.title}</h3>
                {option.badge && (
                  <img
                    src="/applyvisa/express-badge.png"
                    alt={option.badge}
                    className="h-6"
                  />
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Visa Type</span>
                    <span className="text-sm font-bold text-black">
                      {option.visaType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stay Duration</span>
                    <span className="text-sm font-bold text-black">
                      {option.stayDuration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Visa validity</span>
                    <span className="text-sm font-bold text-black">
                      {option.visaValidity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Processing time
                    </span>
                    <span className="text-sm font-bold text-black">
                      {option.processingTime}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs text-gray-500">
                        Form Fee + Tax
                      </div>
                      <div className="text-lg font-bold text-black line-through">
                        ₹{option.originalPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        Processing Fee
                      </div>
                      <div className="text-lg font-bold text-black">
                        ₹{option.discountedPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Pay us</div>
                      <div className="text-lg font-bold text-black">
                        ₹{option.finalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleEnquireClick(option)}
                  className="group/btn flex items-center justify-between w-full text-teal-600 font-bold text-base transition-all"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-5 h-5 text-yellow-400 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visa Enquiry Form Popup */}
      {isEnquiryFormOpen && (
        <VisaEnquiryForm
          open={isEnquiryFormOpen}
          onOpenChange={(open) => {
            setIsEnquiryFormOpen(open);
            if (!open) setSelectedOption(null);
          }}
        />
      )}
    </section>
  );
};

export default VisaOptionsGrid;
