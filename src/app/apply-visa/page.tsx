"use client"
import React, { useState, useRef, useEffect } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import ApplyHero from "@/components/applyvisa/ApplyHero";
import VisaTypeTabs from "@/components/applyvisa/VisaTypeTabs";
import VisaOptionsGrid from "@/components/applyvisa/VisaOptionsGrid";
import ThreeStepTimeline from "@/components/applyvisa/ThreeStepTimeline";
import RequirementTable from "@/components/applyvisa/RequirementTable";
import FAQAccordion from "@/components/applyvisa/FAQAccordion";
import {
  visaOptions,
  timelineSteps,
  requirements,
  faqs,
} from "@/data/visaApplyData";
import { VisaTab } from "@/data/visa";

const ApplyVisaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VisaTab>("types");
  const sectionRefs = {
    types: useRef<HTMLDivElement>(null),
    process: useRef<HTMLDivElement>(null),
    eligibility: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };

  const handleApplyClick = () => {
    console.log("Apply Now clicked");
  };

  const scrollToSection = (tab: VisaTab) => {
    const sectionElement = sectionRefs[tab].current;
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <TopNav />

      <main>
        {/* Hero Section */}
        <div className="pt-8 pb-0">
          <ApplyHero />
        </div>

        {/* Tab Navigation */}
        <VisaTypeTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            scrollToSection(tab);
          }}
        />

        {/* All Sections - Always Visible */}
        <div className="space-y-12">
          {/* Types Section */}
          <div ref={sectionRefs.types} id="types-section">
            <VisaOptionsGrid options={visaOptions} />
            <ThreeStepTimeline steps={timelineSteps} />
            <RequirementTable
              requirements={requirements}
              nationality="Indian"
            />
          </div>


          {/* FAQ Section */}
          <div ref={sectionRefs.faq} id="faq-section">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ApplyVisaPage;
