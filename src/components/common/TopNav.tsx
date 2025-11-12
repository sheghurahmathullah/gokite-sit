import { Button } from "@/components/ui/button";
import Link from "next/link";

const TopNav = () => {
  return (
    <nav className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="cursor-pointer">
          <img src="/logo.svg" alt="GoKite" className="h-12" />
        </Link>
      </div>

      <Button
        variant="default"
        size="sm"
        className="rounded-full px-6 bg-black text-primary-foreground"
      >
      Sign in
      </Button>
    </nav>
  );
};

export default TopNav;
