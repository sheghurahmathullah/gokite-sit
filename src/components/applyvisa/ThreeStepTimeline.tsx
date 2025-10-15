import React from "react";
import { Calendar, FileText, RefreshCw, CheckCircle } from "lucide-react";
import { TimelineStep } from "@/types/visa";

interface ThreeStepTimelineProps {
  steps: TimelineStep[];
}

const ThreeStepTimeline: React.FC<ThreeStepTimelineProps> = ({ steps }) => (
  <section className="w-full py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center text-foreground mb-2">
        GET YOUR UAE VISA IN 3 EASY STEPS
      </h2>
      <p className="text-center text-muted-foreground mb-10">
        Our Visa expert review and procee the Visa to the embassy on your behalf
      </p>
      {/* Timeline container */}
      <div className="relative flex items-center justify-between bg-[#F8F8F8] rounded-full px-6 py-8 shadow">
        {/* Timeline connection line */}
        <div
          className="absolute top-1/2 left-[5%] right-[5%] h-2 bg-gray-200 rounded-full -z-10"
          style={{ transform: "translateY(-50%)" }}
        ></div>

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
      </div>
    </div>
  </section>
);

export default ThreeStepTimeline;
