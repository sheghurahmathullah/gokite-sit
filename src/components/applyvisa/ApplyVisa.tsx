import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import {
  VisaOption,
  TimelineStep,
  Requirement,
  FAQ,
  VisaTab,
} from "@/data/visa";
import VisaEnquiryForm from "./VisaEnquiryForm";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ApplyVisaProps {
  // Hero props
  title?: string;
  subtitle?: string;
  destination?: string;
  date?: string;

  // Timeline props
  timelineSteps?: TimelineStep[];

  // Visa options props
  visaOptions: VisaOption[];

  // Requirements props
  requirements: Requirement[];
  nationality?: string;

  // FAQ props
  faqs: FAQ[];

  // API data
  visaDetails?: any;
}

// Tab configuration
const tabs = [
  {
    id: "types" as VisaTab,
    label: "Types Of Visa",
    sectionId: "types-section",
  },
  {
    id: "process" as VisaTab,
    label: "Visa Process",
    sectionId: "process-section",
  },
  {
    id: "eligibility" as VisaTab,
    label: "Visa Eligibility",
    sectionId: "eligibility-section",
  },
  {
    id: "faq" as VisaTab,
    label: "FAQ",
    sectionId: "faq-section",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

const ApplyVisa: React.FC<ApplyVisaProps> = ({
  title = "Apply for UAE Visa Online",
  subtitle = "Get your Visa by 7 June 2025, If applied today",
  destination = "Singapore",
  date = "28th May",
  timelineSteps = [],
  visaOptions,
  requirements,
  nationality = "Indian",
  faqs,
  visaDetails,
}) => {
  const [activeTab, setActiveTab] = useState<VisaTab>("types");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<VisaOption | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // ============================================
  // SCROLL HANDLING FOR TABS
  // ============================================

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const detectActiveTabByScroll = () => {
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    const tabSections = tabs
      .map((tab) => {
        const sectionElement = document.getElementById(tab.sectionId);
        if (!sectionElement) return null;

        const rect = sectionElement.getBoundingClientRect();
        const visiblePixels = Math.min(
          Math.max(0, viewportHeight - Math.max(0, rect.top)),
          rect.height
        );

        return {
          tab: tab.id,
          visiblePixels,
        };
      })
      .filter((section) => section !== null);

    if (tabSections.length === 0) return activeTab;

    const mostVisibleSection = tabSections.reduce((prev, current) =>
      prev.visiblePixels > current.visiblePixels ? prev : current
    );

    return mostVisibleSection.tab as VisaTab;
  };

  useEffect(() => {
    const detectedTab = detectActiveTabByScroll();
    if (detectedTab !== activeTab) {
      setActiveTab(detectedTab);
    }
  }, [scrollPosition]);

  const handleTabClick = (tab: VisaTab) => {
    setActiveTab(tab);
    const sectionElement = document.getElementById(
      tabs.find((t) => t.id === tab)?.sectionId || ""
    );

    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleEnquireClick = (option: VisaOption) => {
    setSelectedOption(option);
    setIsEnquiryFormOpen(true);
  };

  const toggleFAQ = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="w-full">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative w-full bg-[#dbf3ff] overflow-hidden pb-0 mb-0">
        <div className="px-6 lg:px-20 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground">
                {subtitle}
              </p>
            </div>

            {/* Right Banner Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <img
                  src="/applyvisa/banner-right.png"
                  alt="UAE Visa Application Banner"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STICKY TABS NAVIGATION */}
      {/* ============================================ */}
      <div className="w-full bg-[#f0f0f0] border-b border-border py-2 sticky top-0 z-50">
        <div className="container mx-auto px-3 lg:px-8">
          <div className="flex items-center justify-center gap-16 py-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  relative px-2 py-3 text-[13px] lg:text-[15px] font-semibold transition-colors
                  focus:outline-none whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-[#1d1d1d] font-bold"
                      : "text-[#161a1e] hover:text-[#524e46]"
                  }
                `}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-[80%] h-[3px] bg-[#e2b300] rounded-t-sm"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TYPES OF VISA SECTION */}
      {/* ============================================ */}
      <section
        id="types-section"
        className="w-full py-12 lg:py-16 bg-[#f2f8fc]"
      >
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {visaOptions.map((option, idx) => {
              // Check if this is API data or static data
              const isApiData = option.fields && option.companyPricing;

              // Helper to calculate total fee for API data
              const getTotalFee = (companyPricing: any) => {
                const cp = Array.isArray(companyPricing)
                  ? companyPricing[0]
                  : companyPricing;
                const pricingItems = cp?.pricing || [];
                const currency = cp?.currency || "₹";
                const total = pricingItems.reduce((sum: number, item: any) => {
                  const numeric = Number(item?.value) || 0;
                  return sum + numeric;
                }, 0);
                return { currency, total };
              };

              return (
                <div
                  key={option.id || idx}
                  className="group relative bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full"
                >
                  {/* Header with badge */}
                  <div className="bg-black text-yellow-400 px-6 py-4 relative flex items-center justify-between">
                    <h3 className="text-base font-bold">{option.title}</h3>
                    {(option.badge || option.visaBadge) && (
                      <img
                        src="/applyvisa/express-badge.png"
                        alt={option.badge || option.visaBadge}
                        className="h-6"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {isApiData ? (
                        // Render API data structure
                        option.fields?.map((field: any, fieldIdx: number) => (
                          <div
                            key={fieldIdx}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm text-gray-600">
                              {field.label}
                            </span>
                            <span className="text-sm font-bold text-black">
                              {field.value}
                            </span>
                          </div>
                        ))
                      ) : (
                        // Render static data structure
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Visa Type
                            </span>
                            <span className="text-sm font-bold text-black">
                              {option.visaType}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Stay Duration
                            </span>
                            <span className="text-sm font-bold text-black">
                              {option.stayDuration}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Visa validity
                            </span>
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
                        </>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      {isApiData ? (
                        // Render API pricing structure
                        <div className="flex justify-between items-start mb-2">
                          {(Array.isArray(option.companyPricing)
                            ? option.companyPricing[0]?.pricing
                            : option.companyPricing?.pricing
                          )?.map((fee: any, feeIdx: number) => (
                            <div key={feeIdx} className="text-center">
                              <div className="text-xs text-gray-500">
                                {fee.label}
                              </div>
                              <div className="text-lg font-bold text-black">
                                {`${
                                  (Array.isArray(option.companyPricing)
                                    ? option.companyPricing[0]?.currency
                                    : option.companyPricing?.currency) || "₹"
                                } ${fee.value}`}
                              </div>
                            </div>
                          ))}
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="text-lg font-bold text-black">
                              {(() => {
                                const { currency, total } = getTotalFee(
                                  option.companyPricing
                                );
                                return `${currency} ${total.toLocaleString()}`;
                              })()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Render static pricing structure
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-xs text-gray-500">
                              Form Fee + Tax
                            </div>
                            <div className="text-lg font-bold text-black line-through">
                              ₹{option.originalPrice?.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              Processing Fee
                            </div>
                            <div className="text-lg font-bold text-black">
                              ₹{option.discountedPrice?.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Pay us</div>
                            <div className="text-lg font-bold text-black">
                              ₹{option.finalPrice?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleEnquireClick(option)}
                      className="group/btn flex items-center justify-between w-full text-teal-600 font-bold text-base transition-all"
                    >
                      <span>{option.buttonLabel || "Enquire"}</span>
                      <ArrowRight className="w-5 h-5 text-yellow-400 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VISA PROCESS SECTION - THREE STEP TIMELINE */}
      {/* ============================================ */}
      <section id="process-section" className="w-full py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center text-foreground mb-2">
            {visaDetails?.detailsJson?.visaProcess?.mainHeading ||
              "GET YOUR UAE VISA IN 3 EASY STEPS"}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {visaDetails?.detailsJson?.visaProcess?.subHeading ||
              "Our Visa expert review and procee the Visa to the embassy on your behalf"}
          </p>
          {/* Timeline container */}
          <div className="relative flex items-center justify-between bg-[#F8F8F8] rounded-full px-6 py-8 shadow">
            {/* Timeline connection line */}
            <div
              className="absolute top-1/2 left-[5%] right-[5%] h-2 bg-gray-200 rounded-full -z-10"
              style={{ transform: "translateY(-50%)" }}
            ></div>

            {/* Dynamic Steps or Default Steps */}
            {visaDetails?.detailsJson?.visaProcess?.steps ? (
              visaDetails.detailsJson.visaProcess.steps.map(
                (step: any, index: number) => {
                  const isFirstStep = index === 0;
                  const isLastStep =
                    index ===
                    visaDetails.detailsJson.visaProcess.steps.length - 1;
                  const iconColors = [
                    "#FFC700",
                    "#0EA5E9",
                    "#9C27B0",
                    "#32CD32",
                  ];
                  const bgColor = isFirstStep
                    ? "#FFC700"
                    : isLastStep
                    ? "#32CD32"
                    : "#0EA5E9";

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center z-10 min-w-[130px]"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-1 shadow"
                        style={{ backgroundColor: bgColor }}
                      >
                        {isFirstStep ? (
                          <Calendar className="w-6 h-6 text-white" />
                        ) : isLastStep ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : index === 1 ? (
                          <FileText className="w-6 h-6 text-white" />
                        ) : (
                          <RefreshCw className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div
                        className={`${
                          isFirstStep || isLastStep ? "text-xl" : "text-base"
                        } font-semibold text-foreground mt-2`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-sm ${
                          isFirstStep || isLastStep
                            ? "text-[#637485]"
                            : "text-muted-foreground"
                        } mt-1 text-center`}
                      >
                        {step.subtitle}
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              // Default static steps
              <>
                {/* Step 1 */}
                <div className="flex flex-col items-center z-10 min-w-[130px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-yellow-400 shadow">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-base text-foreground mt-2">Today</div>
                  <div className="text-lg font-bold text-foreground mt-1">
                    31 May 2025
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center z-10 min-w-[130px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-[hsl(var(--visa-accent,#0EA5E9))] shadow">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-base font-semibold text-foreground mt-2">
                    Submit Information
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 text-center">
                    Share travel details and your information
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center z-10 min-w-[130px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-[hsl(var(--visa-accent,#0EA5E9))] shadow">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-base font-semibold text-foreground mt-2">
                    Completing Visa Process
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 text-center">
                    Relax as we deliver your Visa Stress Free
                  </div>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col items-center z-10 min-w-[130px]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-green-400 shadow">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xl font-semibold text-[#637485] mt-2">
                    8 June 2025
                  </div>
                  <span className="text-[15px] text-muted-foreground mt-1">
                    Get Visa By
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VISA ELIGIBILITY SECTION - REQUIREMENTS TABLE */}
      {/* ============================================ */}
      <section id="eligibility-section" className="w-full bg-[#f2f8fc]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-center text-gray-900">
              {visaDetails?.detailsJson?.eligibility?.mainHeading ||
                `UAE Visa Requirement for ${nationality} Citizen`}
            </h2>
          </div>

          {/* Table Container */}
          <div className="bg-gray-50 rounded-lg border overflow-hidden">
            {/* Table Header */}
            <div className="flex justify-between items-center px-10 py-5 bg-white border-b border-[#1796eb]">
              <h3 className="text-xl font-semibold text-gray-900">
                {visaDetails?.detailsJson?.eligibility?.subHeading ||
                  `Documents required for ${nationality.toLowerCase()} citizen`}
              </h3>
              <div className="text-sm text-gray-500 font-normal">
                Mandatory Document
              </div>
            </div>

            {/* Table Body - Desktop */}
            <div className="hidden md:block bg-gray-50">
              <div className="grid grid-cols-6 gap-0">
                {requirements.map((req, index) => (
                  <div
                    key={req.id}
                    className={`px-8 py-10 flex flex-col items-center justify-center text-center ${
                      index < requirements.length - 1 ? "" : ""
                    }`}
                  >
                    <span className="text-sm font-normal text-black leading-relaxed">
                      {req.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Body - Mobile */}
            <div className="md:hidden bg-gray-50 divide-y divide-gray-200">
              {requirements.map((req) => (
                <div key={req.id} className="px-6 py-4">
                  <span className="text-sm font-normal text-gray-900">
                    {req.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ SECTION */}
      {/* ============================================ */}
      <section id="faq-section" className="w-full py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-20">
          {/* Header */}
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>

          {/* Accordion */}
          <div className="space-y-4" aria-label="Frequently Asked Questions">
            {faqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
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

      {/* ============================================ */}
      {/* VISA ENQUIRY FORM MODAL */}
      {/* ============================================ */}
      {isEnquiryFormOpen && (
        <VisaEnquiryForm
          open={isEnquiryFormOpen}
          onOpenChange={(open) => {
            setIsEnquiryFormOpen(open);
            if (!open) setSelectedOption(null);
          }}
        />
      )}
    </div>
  );
};

export default ApplyVisa;
