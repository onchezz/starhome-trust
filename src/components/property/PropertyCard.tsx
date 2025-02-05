import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

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
  return (
    <Card className="p-4">
      <Link to={`/properties/${id}`}>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-gray-500">{`${location.city}, ${location.state}, ${location.country}`}</p>
        <p className="text-md font-semibold">${price}</p>
        <p className="text-sm text-gray-600">Asking Price: ${askingPrice}</p>
        <p className="text-sm text-gray-600">Type: {propertyType}</p>
        <p className="text-sm text-gray-600">Status: {status}</p>
      </Link>
    </Card>
  );
};