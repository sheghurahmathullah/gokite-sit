/**
 * ApplyHero Component
 * Hero section for Apply Visa page with title, subtitle and illustration
 * Color tokens: --visa-hero-bg, --foreground
 */

import React from "react";

interface ApplyHeroProps {
  title?: string;
  subtitle?: string;
  destination?: string;
  date?: string;
}

const ApplyHero: React.FC<ApplyHeroProps> = ({
  title = "Apply for UAE Visa Online",
  subtitle = "Get your Visa by 7 June 2025, If applied today",
  destination = "Singapore",
  date = "28th May",
}) => {
  return (
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
  );
};

export default ApplyHero;
