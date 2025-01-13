import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bed, Bath, Car, Maximize } from "lucide-react";

interface PropertyAboutProps {
  description: string;
  features: string[];
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  dateListed: string;
  propertyType: string;
  status: string;
  interestedClients: number;
}

export const PropertyAbout = ({
  description,
  features,
  bedrooms,
  bathrooms,
  parkingSpaces,
  area,
  dateListed,
  propertyType,
  status,
  interestedClients,
}: PropertyAboutProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">About This Property</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold">{bedrooms}</div>
            <div className="text-sm text-gray-600">Bedrooms</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold">{bathrooms}</div>
            <div className="text-sm text-gray-600">Bathrooms</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold">{parkingSpaces}</div>
            <div className="text-sm text-gray-600">Parking</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Maximize className="w-5 h-5 text-gray-600" />
          <div>
            <div className="font-semibold">{area}</div>
            <div className="text-sm text-gray-600">Sq Ft</div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 whitespace-pre-line mb-6">{description}</p>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Property Features</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Property Details</h3>
          <div className="space-y-2 text-gray-600">
            <p>Listed: {new Date(dateListed).toLocaleDateString()}</p>
            <p>Property Type: {propertyType}</p>
            <p>Status: {status}</p>
            <p>Interested Clients: {interestedClients}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};