"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/common/TopNav";

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("general-terms");
  const [apiData, setApiData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigationItems = [
    { id: "general-terms", label: "General Terms of Use" },
    { id: "privacy-policy", label: "Privacy policy" },
    { id: "cookie-policy", label: "Cookie Policy" },
    { id: "best-price-guarantee", label: "Best Price Guarantee" },
  ];

  const currentSection = navigationItems.find(item => item.id === activeSection) || navigationItems[0];

  // Fetch data from API based on selected section
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let apiEndpoint = '';
        let dataField = '';
        
        // Determine API endpoint and data field based on selected section
        switch (activeSection) {
          case 'general-terms':
            apiEndpoint = '/api/terms';
            dataField = 'termsAndCondns';
            break;
          case 'privacy-policy':
            apiEndpoint = '/api/privacy-policy';
            dataField = 'privacyPolicy'; // Adjust this based on actual API response field
            break;
          default:
            apiEndpoint = '/api/terms';
            dataField = 'termsAndCondns';
        }
        
        const response = await fetch(apiEndpoint);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // Try to get data from the expected field, fallback to first available field
          const dataItem = result.data[0];
          const content = dataItem[dataField] || dataItem.termsAndCondns || dataItem.privacyPolicy || '';
          setApiData(content);
        } else {
          setError(`No ${currentSection.label.toLowerCase()} data available`);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load ${currentSection.label.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, currentSection.label]);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      activeSection === item.id
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Main Heading */}
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {currentSection.label}
              </h1>

              {/* Content */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading terms and conditions...</div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-red-500">{error}</div>
                </div>
              ) : (
                <div className="prose prose-gray max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: apiData }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Icon */}
      <div className="fixed bottom-6 left-6">
        <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
