"use client"
import TopNav from "@/components/common/IconNav";
import Footer from "@/components/common/Footer";
import SectionHeader from "@/components/common/SectionHeader";
import HeroVisaBanner from "@/components/visa/HeroVisaBanner";
import CountrySlider from "@/components/visa/CountrySlider";
import VisaRulesCard from "@/components/visa/VisaRulesCard";
import VisaCountrySearchAndGrid from "@/components/visa/VisaCountrySearchAndGrid";
import StepsGetVisa from "@/components/visa/StepsGetVisa";
import {
  popularVisaCountries,
  trendingCountries,
  allVisaCountries,
  visaRules,
} from "@/data/visaData";

const VisaPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />

      <main>
        <HeroVisaBanner />

        <CountrySlider title="Popular Visa" countries={popularVisaCountries} />

        <CountrySlider
          title="Vaccation – Trending Countries"
          countries={trendingCountries}
          type="trending"
        />

        {visaRules.length > 0 && (
          <section className="px-20 py-8 lg:py-12">
            <SectionHeader title="Visa Rules & Announcements" />
            <VisaRulesCard rule={visaRules[0]} />
          </section>
        )}

        {/* <VisaCountrySearchAndGrid countries={allVisaCountries} /> */}
        <VisaCountrySearchAndGrid />

        <StepsGetVisa />
      </main>

      <Footer />
    </div>
  );
};

export default VisaPage;
