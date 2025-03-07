import { Card } from "@/components/ui/card";
import propertiesData from "@/data/properties.json";
import { Link } from "react-router-dom";

interface SimilarPropertiesProps {
  currentPropertyId: string;  // Changed from number to string to match the data
}

export const SimilarProperties = ({ currentPropertyId }: SimilarPropertiesProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {propertiesData.properties
          .filter(p => p.id !== currentPropertyId)
          .slice(0, 3)
          .map(similarProperty => (
            <Link to={`/properties/${similarProperty.id}`} key={similarProperty.id}>
              <Card className="overflow-hidden">
                <img
                  src={similarProperty.images[0]}
                  alt={similarProperty.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{similarProperty.title}</h3>
                  <p className="text-sm text-gray-600">
                    {similarProperty.location.city}, {similarProperty.location.state}
                  </p>
                  <div className="mt-2 font-bold text-primary">
                    {formatPrice(similarProperty.price)}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};