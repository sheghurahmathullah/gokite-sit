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
      let countryCode = "";
      let countryId = "";

      try {
        if (typeof window !== "undefined") {
          countryId = window.sessionStorage.getItem("applyVisaCountryId") || "";
          countryCode =
            window.sessionStorage.getItem("applyVisaCountryCode") || "";
        }
      } catch (e) {
        console.error("Error reading from sessionStorage:", e);
      }

      // If no country selected, use default (UAE/AE)
      if (!countryCode) {
        countryCode = "AE";
      }

      try {
        setLoading(true);
        const res = await fetch("/api/cms/visa-country-search", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ countryCode: countryCode }),
        });

        if (!res.ok) throw new Error("Failed to fetch visa details");

        const json = await res.json();
        const details = json?.data?.[0] || null;

        console.log("Fetched visa details:", details);
        setVisaDetails(details);
        setVisaError(null);

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
        setVisaError("Failed to load visa details");
      } finally {
        setLoading(false);
      }
    }

    // Try to use cached details first
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
      <TopNav />

      <main className="pt-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-lg text-gray-600">Loading visa details...</p>
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
