import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  price: number;
  askingPrice: number;
  interestedClients: number;
  annualGrowthRate: number;
  imagesUrl: string[];
  propertyType: string;
  status: string;
  showUpdateButton?: boolean;
}

export const PropertyCard = ({ 
  id,
  title,
  location,
  price,
  askingPrice,
  interestedClients,
  annualGrowthRate,
  imagesUrl,
  propertyType,
  status,
  showUpdateButton 
}: PropertyCardProps) => {
  console.log("PropertyCard imagesUrl:", imagesUrl);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imagesUrl?.[0] || '/placeholder.svg'} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
          {status}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          {`${location.city}, ${location.state}, ${location.country}`}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-bold text-primary">${price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Asking: ${askingPrice.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{propertyType}</p>
            <p className="text-xs text-gray-500">{interestedClients} interested</p>
          </div>
        </div>
        <Link to={`/properties/${id}`}>
          <Button className="w-full" variant="outline">
            View More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};