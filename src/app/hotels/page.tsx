"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Hotel } from "lucide-react";

const Hotels = () => {
  return (
    <WorkInProgress
      title="Hotel Booking"
      description="We're working hard to bring you the best hotel booking experience."
      icon={Hotel}
      colorTheme="purple"
    />
  );
};

export default Hotels;

