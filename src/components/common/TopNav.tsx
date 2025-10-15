import { Button } from "@/components/ui/button";

const TopNav = () => {
  return (
    <nav className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="GoKite" className="h-12" />
      </div>

      <Button
        variant="default"
        size="sm"
        className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Hi, Usman
      </Button>
    </nav>
  );
};

export default TopNav;
