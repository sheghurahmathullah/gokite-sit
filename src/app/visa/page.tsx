"use client";
import { useState, useEffect } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HeroVisaBanner from "@/components/visa/HeroVisaBanner";
import CountrySlider from "@/components/visa/CountrySlider";
import VisaRulesCard from "@/components/visa/VisaRulesCard";
import VisaCountrySearchAndGrid from "@/components/visa/VisaCountrySearchAndGrid";
import StepsGetVisa from "@/components/visa/StepsGetVisa";
import { usePageContext } from "@/components/common/PageContext";

interface Section {
  pageSectionId: string;
  title: string;
  contentType: string;
}

const VisaPage = () => {
  const [visaSections, setVisaSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPageIdWithFallback, loading: pageLoading } = usePageContext();

  // Read cookie helper
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : "";
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getCookie("accesstoken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // Fetch sections data
  const fetchSectionsData = async (): Promise<Section[]> => {
    try {
      const pageId = getPageIdWithFallback("visa-landing-page");
      
      const sectionsResponse = await fetch("/api/cms/pages-sections", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pageId }),
      });

      if (!sectionsResponse.ok) {
        throw new Error("Failed to fetch sections data");
      }

      const sectionsData = await sectionsResponse.json();
      return sectionsData.data || [];
    } catch (err) {
      console.error("Error fetching sections:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (pageLoading) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sections
        const sections = await fetchSectionsData();
        console.log("Fetched visa sections:", sections);

        // Filter sections by VISA contentType
        const visaFiltered = sections.filter(
          (section) => section.contentType === "VISA"
        );

        console.log("Filtered visa sections:", visaFiltered);
        setVisaSections(visaFiltered);
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading]);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main>
        <HeroVisaBanner />

        {/* Dynamic Visa Sections */}
        {loading ? (
          <section className="w-full px-6 py-6">
            <div className="max-w-[85rem] mx-auto text-center text-gray-600">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Loading visa sections...</p>
            </div>
          </section>
        ) : error ? (
          <section className="w-full px-6 py-6">
            <div className="max-w-[85rem] mx-auto text-center text-red-600">
              Error: {error}
            </div>
          </section>
        ) : visaSections.length > 0 ? (
          visaSections.map((section) => (
            <CountrySlider
              key={section.pageSectionId}
              title={section.title}
              sectionTitle={section.title}
              type="popular"
            />
          ))
        ) : (
          <section className="w-full px-6 py-6">
            <div className="max-w-[85rem] mx-auto text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Visa Sections Available
              </h3>
              <p className="text-sm text-gray-600">
                No visa sections found at the moment.
              </p>
            </div>
          </section>
        )}

        <VisaRulesCard />

        <VisaCountrySearchAndGrid />

        <StepsGetVisa />
      </main>

      <Footer />
    </div>
  );
};

export default VisaPage;
