"use client";
import { useState, useEffect } from "react";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import { ContentPageSkeleton } from "@/components/common/SkeletonLoader";
import SEOHead from "@/components/seo/SEOHead";
import { SEO_CONFIG } from "@/lib/seo/config";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("[Privacy Policy] Fetching privacy policy data...");
        const response = await fetch("/api/privacy-policy");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch privacy policy data: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("[Privacy Policy] Received data:", data);

        if (
          data.success &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          const privacyPolicyContent = data.data[0]?.privacyPolicy || "";
          setContent(privacyPolicyContent);
        } else {
          throw new Error("Invalid response format or no data available");
        }
      } catch (err) {
        console.error("[Privacy Policy] Error:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return <ContentPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Privacy Policy - GoKite | Your Data Protection & Privacy"
        description="Read GoKite's privacy policy to understand how we collect, use, and protect your personal information. Learn about your privacy rights and our commitment to data protection."
        keywords={["privacy policy", "data protection", "privacy", "data security", "personal information", "GoKite privacy"]}
        pageName="Privacy Policy"
        canonical="/privacy-policy"
        robots="index, follow"
        openGraph={{
          title: "Privacy Policy - GoKite",
          description: "Read GoKite's privacy policy to understand how we collect, use, and protect your personal information.",
          image: "/images/privacy-policy-og.jpg",
          url: `${SEO_CONFIG.baseDomain}/privacy-policy`,
          type: "website",
        }}
        twitter={{
          title: "Privacy Policy - GoKite",
          description: "Read GoKite's privacy policy to understand how we collect, use, and protect your personal information.",
          image: "/images/privacy-policy-og.jpg",
        }}
        schema={{
          breadcrumb: [
            { name: "Home", url: SEO_CONFIG.baseDomain },
            { name: "Privacy Policy", url: `${SEO_CONFIG.baseDomain}/privacy-policy` },
          ],
        }}
      />
      <TopNav />

      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          {error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center text-red-600 bg-red-50 rounded-2xl p-12 max-w-md">
                <h3 className="text-xl font-semibold mb-2">
                  Error Loading Content
                </h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : content ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
              {/* Page Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Privacy Policy
              </h1>

              {/* Render HTML content */}
              <div
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-6
                  prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
