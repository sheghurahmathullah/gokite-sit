import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const VisaBookingCard = () => {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 lg:p-8 card-shadow">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Get Visa</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Destination Input Field */}
        <div className="lg:col-span-6 flex flex-col p-4 bg-white border border-gray-200 rounded-xl min-h-[60px]">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm text-gray-600 mb-1">Where are you going?</p>
            <p className="text-sm text-gray-500">Select Destination</p>
          </div>
        </div>

        {/* Date Input Field */}
        <div className="lg:col-span-4 flex flex-col p-4 bg-white border border-gray-200 rounded-xl min-h-[60px]">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-sm font-semibold text-foreground">January</p>
            <p className="text-xs text-gray-500">11-Wednesday, 2025</p>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <Button className="bg-black text-white hover:bg-black/90 rounded-xl px-6 py-4 h-auto w-full lg:w-auto min-h-[60px] text-sm">
            <Search className="w-4 h-4 mr-2" />
            Visa Types
          </Button>
        </div>
      </div>

      {/* Google Reviews Badge */}
      <div className="mt-4 flex justify-end">
        <div className="hero-google-powered google-powered text-xs text-muted-foreground flex items-center gap-2">
          <span>Powered by</span>
          <svg
            className="hero-google-logo google-logo w-16 h-5"
            viewBox="0 0 272 92"
            fill="none"
          >
            <path
              d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              fill="#EA4335"
            />
            <path
              d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
              fill="#FBBC05"
            />
            <path
              d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
              fill="#34A853"
            />
            <path d="M225 3v65h-9.5V3h9.5z" fill="#EA4335" />
            <path
              d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
              fill="#FBBC05"
            />
            <path
              d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
              fill="#4285F4"
            />
          </svg>
          <span>Reviews</span>
          <div className="flex items-center ml-1">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="ml-1">4.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaBookingCard;
