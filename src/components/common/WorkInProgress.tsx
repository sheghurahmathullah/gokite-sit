"use client";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import { LucideIcon } from "lucide-react";

interface WorkInProgressProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  colorTheme?: "blue" | "purple" | "orange" | "gray" | "green";
}

const WorkInProgress = ({
  title,
  description = "We're working hard to bring you the best experience.",
  icon: Icon,
  colorTheme = "blue",
}: WorkInProgressProps) => {
  const themeClasses = {
    blue: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      titleColor: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      titleColor: "text-orange-600",
    },
    gray: {
      bg: "bg-gray-50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      titleColor: "text-gray-600",
    },
    green: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-600",
    },
  };

  const theme = themeClasses[colorTheme];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className={`text-center ${theme.bg} rounded-2xl p-12 max-w-2xl`}>
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 ${theme.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-10 h-10 ${theme.iconColor}`} />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              <h2 className={`text-2xl font-semibold ${theme.titleColor} mb-3`}>
                Coming Soon
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                {description}
              </p>
              <p className="text-gray-600">
                This feature is currently under development and will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkInProgress;

