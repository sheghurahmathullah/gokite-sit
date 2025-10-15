import { Badge } from "@/components/ui/badge";

interface TourHeroProps {
  images: {
    main: string;
    side1: string;
    side2: string;
  };
}

const TourHero = ({ images }: TourHeroProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Main Image */}
      <div className="md:col-span-2 relative group">
        <img
          src={images.main}
          alt="Bromo Mountain Main"
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <Badge className="absolute top-4 left-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          RECOMMENDED
        </Badge>
      </div>

      {/* Side Images */}
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <img
            src={images.side1}
            alt="Bromo Mountain View"
            className="w-full h-[193px] object-cover rounded-lg"
          />
        </div>
        <div className="relative group">
          <img
            src={images.side2}
            alt="Bromo Flowers"
            className="w-full h-[193px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default TourHero;
