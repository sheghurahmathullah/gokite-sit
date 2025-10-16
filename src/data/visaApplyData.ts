import { VisaOption, TimelineStep, Requirement, FAQ } from "@/data/visa";

/**
 * Sample data for Apply Visa page
 * Update these values to customize content
 */

export const visaOptions: VisaOption[] = [
  {
    id: "30-days-1",
    title: "30 Days Tourist Visa",
    visaType: "eVisa",
    stayDuration: "30 Days",
    visaValidity: "60 Days",
    processingTime: "5 Working Days",
    originalPrice: 6000,
    discountedPrice: 350,
    finalPrice: 6350,
  },
  {
    id: "30-days-2",
    title: "30 Days Tourist Visa",
    visaType: "eVisa",
    stayDuration: "30 Days",
    visaValidity: "60 Days",
    processingTime: "2 Working Days",
    originalPrice: 6350,
    discountedPrice: 4350,
    finalPrice: 10800,
    badge: "FAST",
  },
  {
    id: "90-days",
    title: "90 Days Tourist Visa",
    visaType: "eVisa",
    stayDuration: "90 Days",
    visaValidity: "120 Days",
    processingTime: "5 Working Days",
    originalPrice: 8000,
    discountedPrice: 4350,
    finalPrice: 12350,
  },
];

export const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    date: "Today\n31 May 2025",
    title: "Submit Information",
    description: "Share travel details and your information",
    icon: "document",
  },
  {
    id: 2,
    date: "",
    title: "Completing Visa Process",
    description: "Relax as we submit your Visa Status Flow",
    icon: "process",
  },
  {
    id: 3,
    date: "8 June 2025\nGet Visa By",
    title: "Receive Visa",
    description: "Get your approved visa via email",
    icon: "check",
  },
];

export const requirements: Requirement[] = [
  {
    id: "passport-front",
    name: "Passport Front Page",
    mandatory: true,
  },
  {
    id: "passport-back",
    name: "Passport back Page",
    mandatory: true,
  },
  {
    id: "flight-ticket",
    name: "Flight ticket",
    mandatory: true,
  },
  {
    id: "pan-card",
    name: "Pan Card",
    mandatory: true,
  },
  {
    id: "hotel-booking",
    name: "Hotel Booking",
    mandatory: true,
  },
  {
    id: "passport-photo",
    name: "Passport size Photo",
    mandatory: true,
  },
];

export const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "Common Reasons for UK Visa Rejection and How to Avoid Them",
    answer:
      "Common reasons for UK visa rejection include insufficient financial proof, incomplete documentation, unclear travel plans, previous immigration violations, and providing false information. To avoid rejection, ensure all documents are complete, accurate, and properly translated if needed. Maintain strong financial records, provide clear evidence of ties to your home country, and be honest in all your applications.",
  },
  {
    id: "faq-2",
    question: "Why Choose to Go Kite Tours for Your UK Visa Application?",
    answer:
      "Go Kite Tours offers expert guidance throughout your UK visa application process. Our experienced team ensures your documents are properly prepared, reviews your application for accuracy, provides personalized consultation, and tracks your application status. We have a high success rate and offer comprehensive support to maximize your chances of approval.",
  },
  {
    id: "faq-3",
    question: "UK Family Visa",
    answer:
      "This visa category enables Indian citizens to join eligible family members already living in the UK, such as a spouse, civil partner, fiancé, child, or, in certain exceptional circumstances, an adult-dependent relative. It facilitates family reunification and establishes a shared life in the UK.\n\nDuration: The initial partner visa is typically granted for 2 years and 9 months. An extension is usually required for another 2 years and 9 months. Once you have finished 5 years on this route, you may be permitted to apply for Indefinite Leave to Remain (ILR). Some routes are shorter, and some are longer.\n\nRequirement: You must have an Indian passport, strong evidence of a real and continuing family relationship with your UK-based family member (for example, marriage certificates, proof of sharing funds and evidence of living together) and show English language skills (normally CEFR A1 level for the first application). Requirements differ depending on the kind of family relationship.",
  },
  {
    id: "faq-4",
    question: "Essential UK Visa Requirements from India",
    answer:
      "Essential UK visa requirements from India include a valid passport (with at least 6 months validity), completed visa application form, recent passport-sized photographs, proof of financial stability, travel itinerary, accommodation details, travel insurance, and supporting documents specific to your visa type. Additional requirements may include proof of employment, bank statements, invitation letters, and evidence of ties to India.",
  },
];
