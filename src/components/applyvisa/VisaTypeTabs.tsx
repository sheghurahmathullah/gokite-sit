import React, { useState, useEffect } from "react";
import { VisaTab } from "@/types/visa";

interface VisaTypeTabsProps {
  activeTab: VisaTab;
  onTabChange: (tab: VisaTab) => void;
}

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

const VisaTypeTabs: React.FC<VisaTypeTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabClick = (tab: VisaTab) => {
    onTabChange(tab);
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

  const detectActiveTabByScroll = () => {
    // Calculate the viewport height and scroll position
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    // Find the section that is most prominently in view
    const tabSections = tabs
      .map((tab) => {
        const sectionElement = document.getElementById(tab.sectionId);
        if (!sectionElement) return null;

        const rect = sectionElement.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const sectionBottom = sectionTop + rect.height;

        // Calculate how much of the section is in the viewport
        const visiblePixels = Math.min(
          Math.max(0, viewportHeight - Math.max(0, rect.top)),
          rect.height
        );

        return {
          tab: tab.id,
          visiblePixels,
          sectionTop,
          sectionBottom,
        };
      })
      .filter((section) => section !== null);

    // If no sections are found, return the current active tab
    if (tabSections.length === 0) return activeTab;

    // Sort sections by visible pixels in descending order
    const mostVisibleSection = tabSections.reduce((prev, current) =>
      prev.visiblePixels > current.visiblePixels ? prev : current
    );

    return mostVisibleSection.tab as VisaTab;
  };

  // Detect active tab based on scroll position
  useEffect(() => {
    const detectedTab = detectActiveTabByScroll();
    if (detectedTab !== activeTab) {
      onTabChange(detectedTab);
    }
  }, [scrollPosition]);

  return (
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
  );
};

export default VisaTypeTabs;
