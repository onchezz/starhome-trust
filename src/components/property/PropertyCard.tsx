import { Property } from "@/types/property";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  propertyData: Property;
}

const PropertyCard = ({ propertyData }: PropertyCardProps) => {
  return (
    <Card className="p-4">
      <Link to={`/properties/${propertyData.id}`}>
        <h2 className="text-lg font-bold">{propertyData.title}</h2>
        <p className="text-sm text-gray-500">{propertyData.description}</p>
        <p className="text-md font-semibold">${propertyData.price}</p>
      </Link>
    </Card>
  );
};

export default PropertyCard;
