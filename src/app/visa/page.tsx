"use client";
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import HeroVisaBanner from "@/components/visa/HeroVisaBanner";
import CountrySlider from "@/components/visa/CountrySlider";
import VisaRulesCard from "@/components/visa/VisaRulesCard";
import VisaCountrySearchAndGrid from "@/components/visa/VisaCountrySearchAndGrid";
import StepsGetVisa from "@/components/visa/StepsGetVisa";

const VisaPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main>
        <HeroVisaBanner />

        <CountrySlider title="Popular Visa" sectionTitle="Popular Countries" />

        <CountrySlider
          title="Vaccation – Trending Countries"
          sectionTitle="Vacation - Trending Countries"
          type="trending"
        />

        <VisaRulesCard />

        {/* <VisaCountrySearchAndGrid countries={allVisaCountries} /> */}
        <VisaCountrySearchAndGrid />

        <StepsGetVisa />
      </main>

      <Footer />
    </div>
  );
};

export default VisaPage;
