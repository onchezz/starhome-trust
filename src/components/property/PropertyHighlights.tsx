import { Card } from "@/components/ui/card";
import { Bed, Bath, Car, Maximize } from "lucide-react";
import propertiesData from "@/data/properties.json";
import { useParams } from "react-router-dom";

export const PropertyHighlights = () => {
  const { id } = useParams<{ id: string }>();
  const property = propertiesData.properties.find(p => p.id === id);

  if (!property) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Property Highlights</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-gray-600" />
          <div>
            <div className="font-semibold">{property.bedrooms}</div>
            <div className="text-sm text-gray-600">Bedrooms</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 text-gray-600" />
          <div>
            <div className="font-semibold">{property.bathrooms}</div>
            <div className="text-sm text-gray-600">Bathrooms</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-gray-600" />
          <div>
            <div className="font-semibold">{property.parkingSpaces}</div>
            <div className="text-sm text-gray-600">Parking</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Maximize className="h-5 w-5 text-gray-600" />
          <div>
            <div className="font-semibold">{property.area}</div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
        </div>
      </div>
    </Card>
  );
};