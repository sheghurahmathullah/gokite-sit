"use client";
import { useState, useEffect } from "react";
import TopNav from "@/components/common/TopNav";
import Footer from "@/components/common/Footer";

const AboutUs = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("[About Us] Fetching about us data...");
        const response = await fetch("/api/about-us");

        if (!response.ok) {
          throw new Error(`Failed to fetch about us data: ${response.status}`);
        }

        const data = await response.json();
        console.log("[About Us] Received data:", data);

        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const aboutUsContent = data.data[0]?.aboutUs || "";
          setContent(aboutUsContent);
        } else {
          throw new Error("Invalid response format or no data available");
        }
      } catch (err) {
        console.error("[About Us] Error:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav/>

      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center text-red-600 bg-red-50 rounded-2xl p-12 max-w-md">
                <h3 className="text-xl font-semibold mb-2">Error Loading Content</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

