"use client";
import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HeroVisaBanner from "@/components/visa/HeroVisaBanner";
import CountrySlider from "@/components/visa/CountrySlider";
import VisaRulesCard from "@/components/visa/VisaRulesCard";
import VisaCountrySearchAndGrid from "@/components/visa/VisaCountrySearchAndGrid";
import StepsGetVisa from "@/components/visa/StepsGetVisa";
import { usePageContext } from "@/components/common/PageContext";
import { CarouselSkeleton } from "@/components/common/SkeletonLoader";

interface Section {
  pageSectionId: string;
  title: string;
  contentType: string;
  subTypeId?: string;
  displayOrder?: string;
}

interface BannerSection {
  pageSectionId: string;
  title: string;
  contentType: string;
}

interface VisaCountry {
  id: string;
  country: string;
  countryCode: string;
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
  flagImageUrl?: string;
  subtitle?: string;
  priceContent?: string;
}

interface VisaRuleAnnouncement {
  id: string;
  country: string;
  countryCode: string;
  title?: string;
  description: string;
  date?: string;
  logoImage?: string;
  cardImage?: string;
  flagImageUrl?: string;
  uniqueId?: string;
}

interface SectionWithVisaData {
  pageSectionId: string;
  title: string;
  contentType: string;
  subTypeId?: string;
  displayOrder?: string;
  data: VisaCountry[];
}

const VisaPage = () => {
  const [visaSectionsWithData, setVisaSectionsWithData] = useState<
    SectionWithVisaData[]
  >([]);
  const [allVisaSections, setAllVisaSections] = useState<Section[]>([]); // Store all sections for empty state titles
  const [bannerSection, setBannerSection] = useState<BannerSection | null>(
    null
  );
  const [visaRulesData, setVisaRulesData] = useState<VisaRuleAnnouncement[]>(
    []
  );
  const [visaRulesSectionTitle, setVisaRulesSectionTitle] = useState<
    string | null
  >(null); // Store visa rules section title
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchedRef = useRef(false); // Track if data has been fetched
  const {
    getPageIdWithFallback,
    getPageInfo,
    loading: pageLoading,
    isAuthenticated,
  } = usePageContext();

  // Set page title dynamically and store page slug
  useEffect(() => {
    const pageInfo = getPageInfo("visaLanding");
    if (pageInfo?.title) {
      document.title = pageInfo.title;
    }

    // Store page slug for nested routing
    if (pageInfo?.slug && typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("currentPageSlug", pageInfo.slug);
      } catch (e) {
        console.error("Failed to store page slug:", e);
      }
    }
  }, [getPageInfo]);

  // Helper function to get flag image URL
  const getFlagImageUrl = (imageName?: string) => {
    if (!imageName) return undefined;
    return `/api/cms/file-download?image=${encodeURIComponent(imageName)}`;
  };

  // Transform API data to component format
  const transformVisaData = (apiData: any[]): VisaCountry[] => {
    return apiData.map((item) => {
      const countryCode =
        item.visaCardJson?.countryCode ||
        item.visaCardCountryId ||
        item.countryCode ||
        "US";

      return {
        id: item.visaCardCountryId || item.id,
        country: item.visaCardTitle || item.country,
        countryCode: countryCode,
        price: parseFloat(item.newPrice || item.price || "0"),
        currency: item.currency || "₹",
        visaType: item.visaCardJson?.subTitle || "Tourist Visa",
        visaTime: item.visaCardJson?.visaTime || "",
        image: item.visaCardJson?.image || "",
        perAdult: item.visaCardJson?.perAdult || true,
        eVisa: item.visaCardJson?.eVisa || false,
        flagImageUrl: getFlagImageUrl(item.visaCardJson?.flagImage),
        subtitle: item.subtitle || "Get your Visa by 24 hours",
        priceContent: item.visaCardJson?.priceContent || undefined,
      };
    });
  };

  // Transform visa rules API data
  const transformVisaRulesData = (apiData: any[]): VisaRuleAnnouncement[] => {
    return apiData.map((item) => {
      const countryCode =
        item.visaCardJson?.countryCode || item.countryCode || "US";

      return {
        id: item.sectionVisaCardUniqueId || item.id,
        country: item.visaCardTitle || "Unknown Country",
        countryCode: countryCode,
        title: item.title || item.visaCardJson?.title,
        description: item.visaCardJson?.description || "",
        cardImage: item.visaCardJson?.cardImage || "",
        flagImageUrl: getFlagImageUrl(item.visaCardJson?.flagImage),
        uniqueId: item.sectionVisaCardUniqueId,
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      console.log(
        "[VisaPage useEffect] Called - isAuthenticated:",
        isAuthenticated,
        "pageLoading:",
        pageLoading,
        "dataFetched:",
        dataFetchedRef.current
      );

      // Wait for PageContext to finish loading
      if (pageLoading) {
        console.log(
          "[VisaPage useEffect] Skipping - page context still loading"
        );
        return;
      }

      // Early exit if data already fetched
      if (dataFetchedRef.current) {
        console.log("[VisaPage useEffect] Skipping - data already fetched");
        return;
      }

      // Check authentication
      if (!isAuthenticated) {
        console.log("[VisaPage useEffect] Skipping - user not authenticated");
        setVisaSectionsWithData([]);
        setAllVisaSections([]);
        setBannerSection(null);
        setVisaRulesData([]);
        setVisaRulesSectionTitle(null);
        setLoading(false);
        return;
      }

      // Mark as fetching immediately to prevent race conditions
      dataFetchedRef.current = true;

      try {
        setLoading(true);
        setError(null);

        const pageId = getPageIdWithFallback("visaLanding");
        if (!pageId) {
          console.error("[VisaPage] Missing visa landing pageId");
          throw new Error("Missing visa landing pageId");
        }

        console.log(
          "[VisaPage] Starting data fetch - this should only happen once"
        );

        // Fetch sections
        console.log(
          "[API Call] Fetching /api/cms/pages-sections for visa page"
        );
        const sectionsResponse = await fetch("/api/cms/pages-sections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageId }),
        });

        if (!sectionsResponse.ok) {
          throw new Error("Failed to fetch sections data");
        }

        const sectionsData = await sectionsResponse.json();
        const sections = sectionsData.data || [];
        console.log("[API Call] Received pages-sections data");
        console.log("Fetched visa sections:", sections);

        // Extract banner section
        const bannerFiltered = sections.find(
          (section: Section) => section.contentType === "BANNER"
        );
        if (bannerFiltered) {
          console.log("Banner section found:", bannerFiltered);
          setBannerSection({
            pageSectionId: bannerFiltered.pageSectionId,
            title: bannerFiltered.title,
            contentType: bannerFiltered.contentType,
          });
        }

        // Filter sections by VISA contentType
        const visaFiltered = sections.filter(
          (section: Section) => section.contentType === "VISA"
        );

        // Sort sections by subTypeId (treating empty as last) and then by displayOrder
        const sortedVisaSections = [...visaFiltered].sort((a, b) => {
          const aSubType = a.subTypeId || "";
          const bSubType = b.subTypeId || "";

          // Compare subTypeId (empty strings go to end)
          if (aSubType === "" && bSubType !== "") return 1;
          if (aSubType !== "" && bSubType === "") return -1;
          if (aSubType !== bSubType) {
            return aSubType.localeCompare(bSubType);
          }

          // If subTypeId is same, sort by displayOrder
          const aOrder = parseInt(a.displayOrder || "0", 10);
          const bOrder = parseInt(b.displayOrder || "0", 10);
          return aOrder - bOrder;
        });

        // Store all visa sections (sorted) for rendering
        setAllVisaSections(sortedVisaSections);

        console.log("Filtered and sorted visa sections:", sortedVisaSections);

        // Separate sections by subTypeId
        // subTypeId "3" = Visa Rules section
        const visaRulesSection = sortedVisaSections.find(
          (section: Section) => section.subTypeId === "3"
        );

        // Regular visa sections (subTypeId "1", "2", or other non-"3" values)
        const regularVisaSections = sortedVisaSections.filter(
          (section: Section) => section.subTypeId !== "3"
        );

        // Store the visa rules section title if found
        if (visaRulesSection) {
          setVisaRulesSectionTitle(visaRulesSection.title);
        }

        // Fetch visa cards for all regular sections in parallel
        if (regularVisaSections.length > 0) {
          const visaSectionsDataPromises = regularVisaSections.map(
            async (section: Section) => {
              console.log(
                `[API Call] Fetching /api/cms/sections-visa-cards for section: ${section.pageSectionId}`
              );
              const response = await fetch("/api/cms/sections-visa-cards", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ pageSectionId: section.pageSectionId }),
              });

              if (!response.ok) {
                console.error(
                  "Failed to fetch visa cards for section:",
                  section.pageSectionId
                );
                return {
                  pageSectionId: section.pageSectionId,
                  title: section.title,
                  contentType: section.contentType,
                  subTypeId: section.subTypeId,
                  displayOrder: section.displayOrder,
                  data: [],
                };
              }

              const data = await response.json();
              console.log(
                `[API Call] Received visa cards for section: ${section.pageSectionId}`
              );
              const visaCards = Array.isArray(data?.data) ? data.data : [];

              // Transform data
              const transformedData = transformVisaData(visaCards);

              return {
                pageSectionId: section.pageSectionId,
                title: section.title,
                contentType: section.contentType,
                subTypeId: section.subTypeId,
                displayOrder: section.displayOrder,
                data: transformedData,
              };
            }
          );

          const visaSectionsWithDataResult = await Promise.all(
            visaSectionsDataPromises
          );
          setVisaSectionsWithData(visaSectionsWithDataResult);
        }

        // Fetch visa rules data if section exists
        if (visaRulesSection) {
          console.log(
            `[API Call] Fetching /api/cms/sections-visa-cards-rules for section: ${visaRulesSection.pageSectionId}`
          );
          const rulesResponse = await fetch(
            "/api/cms/sections-visa-cards-rules",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pageSectionId: visaRulesSection.pageSectionId,
              }),
            }
          );

          if (rulesResponse.ok) {
            const rulesData = await rulesResponse.json();
            console.log(`[API Call] Received visa rules data`);
            const rulesArray = Array.isArray(rulesData?.data)
              ? rulesData.data
              : [];
            const transformedRules = transformVisaRulesData(rulesArray);
            setVisaRulesData(transformedRules);
          } else {
            console.error("Failed to fetch visa rules data");
            setVisaRulesData([]);
          }
        }

        console.log("[VisaPage] Data fetch completed successfully");
      } catch (err: unknown) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : String(err));
        // Reset the flag on error so user can retry
        dataFetchedRef.current = false;
        setVisaSectionsWithData([]);
        setAllVisaSections([]);
        setBannerSection(null);
        setVisaRulesData([]);
        setVisaRulesSectionTitle(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageLoading, isAuthenticated]);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main>
        <HeroVisaBanner bannerSection={bannerSection} />

        {/* Dynamic Visa Sections */}
        {loading ? (
          <CarouselSkeleton />
        ) : error ? (
          <section className="w-full px-6 py-6">
            <div className="max-w-[85rem] mx-auto text-center text-red-600">
              Error: {error}
            </div>
          </section>
        ) : allVisaSections.length > 0 ? (
          // Show all sections from API, sorted by subTypeId and displayOrder
          // Exclude visa rules section (subTypeId "3") as it's handled separately
          allVisaSections
            .filter((section) => section.subTypeId !== "3")
            .map((section) => {
              // Find if this section has data
              const sectionWithData = visaSectionsWithData.find(
                (s) => s.pageSectionId === section.pageSectionId
              );

              return sectionWithData && sectionWithData.data.length > 0 ? (
                <CountrySlider
                  key={section.pageSectionId}
                  title={section.title}
                  sectionTitle={section.title}
                  type="popular"
                  countries={sectionWithData.data}
                />
              ) : (
                <section
                  key={section.pageSectionId}
                  className="w-full px-6 py-6"
                >
                  <div className="max-w-[85rem] mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No {section.title} Available
                      </h3>
                      <p className="text-sm text-gray-600">
                        No data found for this section at the moment.
                      </p>
                    </div>
                  </div>
                </section>
              );
            })
        ) : (
          <section className="w-full px-6 py-6">
            <div className="max-w-[85rem] mx-auto text-center text-gray-600 bg-gray-50 rounded-2xl p-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {allVisaSections.length === 0 && !loading
                  ? "No Visa Sections Available"
                  : "Loading sections..."}
              </h3>
              <p className="text-sm text-gray-600">
                {allVisaSections.length === 0 && !loading
                  ? "No visa sections found at the moment."
                  : "Please wait while we load the sections."}
              </p>
            </div>
          </section>
        )}

        {/* Visa Rules Card - only show if section with subTypeId "3" exists */}
        {visaRulesSectionTitle && (
          <VisaRulesCard
            visaRulesData={visaRulesData}
            sectionTitle={visaRulesSectionTitle}
          />
        )}

        <VisaCountrySearchAndGrid />

        <StepsGetVisa />
      </main>

      <Footer />
    </div>
  );
};

export default VisaPage;
