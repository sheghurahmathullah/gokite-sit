export interface VisaCountry {
  id: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  price: number;
  currency: string;
  visaType: string;
  visaTime: string;
  image: string;
  perAdult?: boolean;
  offer?: string;
  eVisa?: boolean;
}

export const popularVisaCountries: VisaCountry[] = [
  {
    id: "us-1",
    country: "US Visa",
    countryCode: "US",
    price: 160500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "15-20 Days",
    image: "/images/visa/usa.jpg",
    perAdult: true,
  },
  {
    id: "india-1",
    country: "India",
    countryCode: "IN",
    price: 160500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "3-5 Days",
    image: "/images/visa/india.jpg",
    perAdult: true,
    eVisa: true,
  },
  {
    id: "singapore-1",
    country: "Singapore",
    countryCode: "SG",
    price: 160500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5-7 Days",
    image: "/images/visa/singapore.jpg",
    perAdult: true,
  },
  {
    id: "switzerland-1",
    country: "Switzerland",
    countryCode: "CH",
    price: 160500,
    currency: "₹",
    visaType: "Schengen Visa",
    visaTime: "10-15 Days",
    image: "/images/visa/switzerland.jpg",
    perAdult: true,
  },
  {
    id: "spain-1",
    country: "Spain",
    countryCode: "ES",
    price: 160500,
    currency: "₹",
    visaType: "Schengen Visa",
    visaTime: "10-15 Days",
    image: "/images/visa/spain.jpg",
    perAdult: true,
  },
  {
    id: "turkey-1",
    country: "Turkey",
    countryCode: "TR",
    price: 160500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "1-2 Days",
    image: "/images/visa/turkey.jpg",
    perAdult: true,
    eVisa: true,
  },
];

export const trendingCountries: VisaCountry[] = [
  {
    id: "sri-lanka-1",
    country: "Sri Lanka",
    countryCode: "LK",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "24 Hours",
    image: "/images/visa/sri-lanka.jpg",
    perAdult: true,
    eVisa: true,
  },
  {
    id: "singapore-2",
    country: "Singapore",
    countryCode: "SG",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "48 Hours",
    image: "/images/visa/singapore.jpg",
    perAdult: true,
    eVisa: true,
  },
  {
    id: "australia-1",
    country: "Australia",
    countryCode: "AU",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "24 Hours",
    image: "/images/visa/australia.jpg",
    perAdult: true,
    eVisa: true,
  },
  {
    id: "bangladesh-1",
    country: "Bangladesh",
    countryCode: "BD",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "24 Hours",
    image: "/images/visa/bangladesh.jpg",
    perAdult: true,
    eVisa: true,
  },
];

export const allVisaCountries: VisaCountry[] = [
  {
    id: "uae-1",
    country: "United Arab Emirates",
    countryCode: "AE",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "3 Days",
    image: "/images/visa/dubai.jpg",
    offer: "Visa in 3 Days",
  },
  {
    id: "singapore-3",
    country: "Singapore",
    countryCode: "SG",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image: "/images/visa/singapore.jpg",
    offer: "Visa in 5 Days",
  },
  {
    id: "japan-1",
    country: "Japan",
    countryCode: "JP",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "7 Days",
    image: "/images/visa/japan.jpg",
    offer: "Hurry! Offer ends in 47 Days",
  },
  {
    id: "sri-lanka-2",
    country: "Srilanka",
    countryCode: "LK",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "3 Days",
    image: "/images/visa/sri-lanka.jpg",
    offer: "Visa in 3 Days",
  },
  {
    id: "africa-1",
    country: "Africa",
    countryCode: "ZA",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image: "/images/visa/africa.jpg",
    offer: "Visa in 5 Days",
  },
  {
    id: "australia-2",
    country: "Australia",
    countryCode: "AU",
    price: 6500,
    currency: "₹",
    visaType: "e-Visa",
    visaTime: "5 Days",
    image: "/images/visa/australia.jpg",
    offer: "Visa in 5 Days",
  },
  {
    id: "thailand-1",
    country: "Thailand",
    countryCode: "TH",
    price: 6500,
    currency: "₹",
    visaType: "Visa on Arrival",
    visaTime: "5 Days",
    image: "/images/visa/thailand.jpg",
    offer: "Visa in 5 Days",
  },
  {
    id: "russia-1",
    country: "Russia",
    countryCode: "RU",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "5 Days",
    image: "/images/visa/russia.jpg",
    offer: "Visa in 5 Days",
  },
  {
    id: "uk-1",
    country: "United Kingdom",
    countryCode: "GB",
    price: 6500,
    currency: "₹",
    visaType: "Tourist Visa",
    visaTime: "7 Days",
    image: "/images/visa/uk.jpg",
    offer: "Visa in 7 Days",
  },
];

export interface VisaRuleAnnouncement {
  id: string;
  country: string;
  countryCode: string;
  title: string;
  description: string;
  date: string;
  cardImage?: string;
  logoImage?: string;
}

export const visaRules: VisaRuleAnnouncement[] = [
  {
    id: "thailand-rule-1",
    country: "Thailand",
    countryCode: "TH",
    title: "Thailand Visa Update",
    description:
      "Starting 1 May, all travelers to Thailand must apply for the Thailand Digital Arrival Card online before departure.",
    date: "2025-04-15",
  },
];
