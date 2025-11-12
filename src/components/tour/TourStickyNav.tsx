"use client";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Overview", id: "overview" },
  { label: "Itinerary", id: "itinerary" },
  { label: "What's Included", id: "whats-included" },
  { label: "FAQs", id: "faqs" },
];

const TourStickyNav = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    // Immediately update the active section when clicked
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Offset from top for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Scrollspy: Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      // Find which section is currently in view
      let foundSection = false;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          // Check if scroll position is within this section's bounds
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(navItems[i].id);
            foundSection = true;
            break;
          }
        }
      }

      // If no section found and we're scrolled past all sections, keep the last section active
      if (!foundSection) {
        const lastSection = document.getElementById(
          navItems[navItems.length - 1].id
        );
        if (lastSection && scrollPosition >= lastSection.offsetTop) {
          setActiveSection(navItems[navItems.length - 1].id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4">
      <div className="max-w-8xl mx-auto px-6 lg:px-24">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className={`px-6 py-2 rounded-full text-base transition cursor-pointer hover:shadow-md whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-foreground text-background font-semibold shadow"
                  : "bg-background text-foreground/70 border border-foreground/10 hover:border-foreground/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourStickyNav;
