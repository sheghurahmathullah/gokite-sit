"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { Plane } from "lucide-react";

const Flights = () => {
  return (
    <WorkInProgress
      title="Flight Booking"
      description="We're working hard to bring you the best flight booking experience."
      icon={Plane}
      colorTheme="blue"
    />
  );
};

export default Flights;

