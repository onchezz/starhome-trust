import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "../investment/ImageGallery";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Property } from "@/types/property";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";

export interface PropertyCardProps {
  property: Property;
  withdraw;
  showUpdateButton?: boolean;
}

export const PropertyCard = ({
  property,
  withdraw,
  showUpdateButton,
}: PropertyCardProps) => {
  console.log("PropertyCard imagesUrl:", property.imagesId);
  const { withdrawPropertyPayment, contractStatus } = usePropertyWrite();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <ImageGallery imagesId={property.imagesId} />

        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
          {property.status}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-1">
          {property.title}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          {`${property.city}, ${property.state}, ${property.country}`}
        </p>
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <p className="text-lg font-bold text-primary grid-cols-1">
              <p className="text-sm text-gray-500">Asking:</p>$
              {property.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              Annual growth : {property.annualGrowthRate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{property.propertyType}</p>
            <p className="text-xs text-gray-500">
              {property.interestedClients} interested
            </p>
          </div>
        </div>

        <div className="p-1">
          <Link to={`/properties/${property.id}`} state={{ property }}>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              More Details
            </Button>
          </Link>
        </div>

        {showUpdateButton ? (
          <>
            <div className="p-1">
              <Link
                to={`/properties/${property.id}/requests`}
                state={{ id: property.id }}
              >
                <Button className="w-full" variant="outline">
                  View Visit Requests
                </Button>
              </Link>
            </div>
            <div className="p-1">
              <Link to={`/properties/${property.id}/edit`}>
                <Button className="w-full" variant="outline">
                  Update Property
                </Button>
              </Link>
            </div>

            {property.status === "sold" ? (
              <div className="p-1">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  // variant="outline"
                  onClick={() => withdrawPropertyPayment(property.id)}
                >
                  Withdraw Payments
                </Button>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
};
