/**
 * RequirementTable Component
 * Table displaying visa document requirements with mandatory indicators
 * Color tokens: --visa-card-bg, --visa-border, --muted-foreground
 */

import React from "react";
import { Requirement } from "@/types/visa";
import { FileCheck } from "lucide-react";

interface RequirementTableProps {
  requirements: Requirement[];
  nationality?: string;
}

const RequirementTable: React.FC<RequirementTableProps> = ({
  requirements,
  nationality = "Indian",
}) => {
  return (
    <section className="w-full bg-[#f2f8fc]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            UAE Visa Requirement for {nationality} Citizen
          </h2>
        </div>

        {/* Table Container */}
        <div className="bg-gray-50 rounded-lg border overflow-hidden">
          {/* Table Header */}
          <div className="flex justify-between items-center px-10 py-5 bg-white border-b border-[#1796eb]">
            <h3 className="text-xl font-semibold text-gray-900">
              Documents required for {nationality.toLowerCase()} citizen
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
  );
};

export default RequirementTable;
