export interface Destination {
  id: string;
  name: string;
  image: string;
  rating: number;
  days: number;
  nights: number;
  flights: number;
  hotels: number;
  transfers: number;
  activities: number;
  features: string[];
  originalPrice: number;
  finalPrice: number;
  currency: string;
}

export interface VisaDestination {
  id: string;
  country: string;
  image: string;
  fastTrack:
    | string
    | {
        originalPrice: string;
        extraCharges: string;
        totalPrice: string;
        date: string;
      };
  priceRange: {
    currency: string;
    min: number;
    max: number;
  };
  price: number;
  departureDate: string;
  departureTime: string;
  flightsAvailable: number;
  getOn?: {
    date: string;
    price: string;
  };
}
