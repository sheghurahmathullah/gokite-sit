import { Button } from "@/components/ui/button";

interface TourTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "included", label: "What's Included" },
  { id: "faqs", label: "FAQs" },
];

const TourTabs = ({ activeTab, setActiveTab }: TourTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          variant={activeTab === tab.id ? "default" : "secondary"}
          className={`rounded-full px-6 ${
            activeTab === tab.id
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default TourTabs;
