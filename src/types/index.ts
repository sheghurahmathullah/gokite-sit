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
  getOn?: {
    date: string;
    price: string;
  };
}
