"use client";
import React, { useState, useEffect } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import ApplyVisa from "@/components/applyvisa/ApplyVisa";
import {
  visaOptions,
  timelineSteps,
  requirements,
  faqs,
} from "@/data/visaApplyData";

const ApplyVisaPage: React.FC = () => {
  const [visaDetails, setVisaDetails] = useState<any>(null);
  const [visaError, setVisaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [noVisaAvailable, setNoVisaAvailable] = useState(false);

  // Get authorization headers
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

  // Fetch visa details from API
  useEffect(() => {
    async function loadVisaDetails() {
      // Check if we have cached API response data from the booking card search
      if (typeof window !== "undefined") {
        try {
          const cachedData = window.sessionStorage.getItem(
            "cachedVisaSearchData"
          );
          const cachedTimestamp = window.sessionStorage.getItem(
            "cachedVisaSearchTimestamp"
          );

          // Use cached data if it exists and is less than 5 minutes old
          if (cachedData && cachedTimestamp) {
            const age = Date.now() - parseInt(cachedTimestamp);
            if (age < 5 * 60 * 1000) {
              // 5 minutes
              console.log("[ApplyVisa] Using cached visa search data");
              const parsedData = JSON.parse(cachedData);

              if (parsedData.length > 0) {
                const details = parsedData[0];
                setVisaDetails(details);
                setVisaError(null);
                setNoVisaAvailable(false);

                // Store the visa details
                window.sessionStorage.setItem(
                  "applyVisaDetails",
                  JSON.stringify(details || {})
                );

                // Clear the cache after using it
                window.sessionStorage.removeItem("cachedVisaSearchData");
                window.sessionStorage.removeItem("cachedVisaSearchTimestamp");
                setLoading(false);
                return;
              } else {
                // Cache expired or invalid, remove it
                window.sessionStorage.removeItem("cachedVisaSearchData");
                window.sessionStorage.removeItem("cachedVisaSearchTimestamp");
              }
            } else {
              // Cache expired, remove it
              window.sessionStorage.removeItem("cachedVisaSearchData");
              window.sessionStorage.removeItem("cachedVisaSearchTimestamp");
            }
          }
        } catch (e) {
          console.error("Error reading cached visa data:", e);
        }
      }

      let countryId = "";

      try {
        if (typeof window !== "undefined") {
          countryId = window.sessionStorage.getItem("applyVisaCountryId") || "";
        }
      } catch (e) {
        console.error("Error reading from sessionStorage:", e);
      }

      // If no country selected, use default (UAE/AE)
      if (!countryId) {
        countryId = "AE";
        console.log("No country code found, using default: AE");
      }

      setLoading(true);

      // Helper function to make API call
      const fetchVisaData = async (countryCode: string) => {
        console.log(`Fetching visa data for country: ${countryCode}`);
        const res = await fetch("/api/cms/visa-country-search", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ countryCode: countryCode }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API call failed for ${countryCode}:`, {
            status: res.status,
            statusText: res.statusText,
            error: errorText,
          });
          throw new Error(
            `Failed to fetch visa details for ${countryCode}: ${res.status} ${res.statusText}`
          );
        }

        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        console.log(`API response for ${countryCode}:`, {
          itemsCount: items.length,
          data: json,
        });
        return items;
      };

      try {
        // First attempt with the selected country
        let items = await fetchVisaData(countryId);

        // If no data found and we're not already using AE, retry with AE
        if (items.length === 0 && countryId !== "AE") {
          console.log(
            `No data found for ${countryId}, retrying with default: AE`
          );
          items = await fetchVisaData("AE");
        }

        if (items.length === 0) {
          console.log("No visa data available for any country");
          setNoVisaAvailable(true);
          setVisaDetails(null);
          setVisaError(null);
          return;
        }

        const details = items[0] || null;
        console.log("Successfully fetched visa details:", details);
        setVisaDetails(details);
        setVisaError(null);
        setNoVisaAvailable(false);

        // Cache the details
        try {
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(
              "applyVisaDetails",
              JSON.stringify(details || {})
            );
          }
        } catch (e) {
          console.error("Error saving to sessionStorage:", e);
        }
      } catch (e) {
        console.error("Error fetching visa details:", e);
        setVisaError(
          `Failed to load visa details: ${
            e instanceof Error ? e.message : "Unknown error"
          }`
        );
        setNoVisaAvailable(false);
      } finally {
        setLoading(false);
      }
    }

    // Try to use cached details first (legacy cache from previous sessions)
    try {
      if (typeof window !== "undefined") {
        const cached = window.sessionStorage.getItem("applyVisaDetails");
        if (cached) {
          const parsed = JSON.parse(cached);
          setVisaDetails(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.error("Error reading cached data:", e);
    }

    loadVisaDetails();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <TopNav isSticky={false} />

      <main className="pt-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">Loading visa details...</p>
          </div>
        ) : noVisaAvailable ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-xl font-semibold text-gray-800">
              No VISA Available
            </p>
          </div>
        ) : visaError ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
            <p className="text-lg text-red-600 mb-4">{visaError}</p>
            <p className="text-sm text-gray-500">Showing default content</p>
            {/* Fallback to static data */}
            <ApplyVisa
              title="Apply for UAE Visa Online"
              subtitle="Get your Visa by 7 June 2025, If applied today"
              visaOptions={visaOptions}
              timelineSteps={timelineSteps}
              requirements={requirements}
              nationality="Indian"
              faqs={faqs}
              visaDetails={null}
            />
          </div>
        ) : (
          <ApplyVisa
            title={`Apply for ${
              visaDetails?.detailsJson?.country || "UAE"
            } Visa Online`}
            subtitle={
              visaDetails?.detailsJson?.visaProcess?.subHeading ||
              "Get your Visa by 7 June 2025, If applied today"
            }
            visaOptions={visaDetails?.detailsJson?.visaTypes || visaOptions}
            timelineSteps={timelineSteps}
            requirements={
              visaDetails?.detailsJson?.eligibility?.descriptions?.map(
                (desc: string, idx: number) => ({
                  id: `req-${idx}`,
                  name: desc,
                })
              ) || requirements
            }
            nationality={
              visaDetails?.detailsJson?.eligibility?.nationality || "Indian"
            }
            faqs={
              visaDetails?.detailsJson?.faq?.map((f: any, idx: number) => ({
                id: `faq-${idx}`,
                question: f.question,
                answer: f.answer,
              })) || faqs
            }
            visaDetails={visaDetails}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ApplyVisaPage;
