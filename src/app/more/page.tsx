"use client";
import WorkInProgress from "@/components/common/WorkInProgress";
import { MoreHorizontal } from "lucide-react";

const More = () => {
  return (
    <WorkInProgress
      title="More Services"
      description="We're working hard to bring you more amazing travel services."
      icon={MoreHorizontal}
      colorTheme="gray"
    />
  );
};

export default More;

