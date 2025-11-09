"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Sparkles } from "lucide-react";

const Activities = () => {
  return (
    <WorkInProgress
      title="Activities"
      description="We're working hard to bring you the best activities and experiences."
      icon={Sparkles}
      colorTheme="orange"
    />
  );
};

export default Activities;

