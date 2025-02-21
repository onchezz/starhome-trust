import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "../investment/ImageGallery";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Property } from "@/types/property";

export interface PropertyCardProps {
  property: Property;
  // id: string;
  // title: string;
  // location: {
  //   city: string;
  //   state: string;
  //   country: string;
  // };
  // price: number;
  // askingPrice: number;
  // interestedClients: number;
  // annualGrowthRate: number;
  // imagesUrl: string;
  // propertyType: string;
  // status: string;
  showUpdateButton?: boolean;
}

export const PropertyCard = ({
  property,
  // id,
  // title,
  // location,
  // price,
  // askingPrice,
  // interestedClients,
  // annualGrowthRate,
  // imagesUrl,
  // propertyType,
  // status,
  showUpdateButton,
}: PropertyCardProps) => {
  console.log("PropertyCard imagesUrl:", property.imagesId);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <ImageGallery imagesId={property.imagesId} />
        {/* <img
          src={imagesUrl?.[0] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        /> */}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium">
          {status}
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
        {showUpdateButton ? (
          <div className="p-1">
            <Link to={`/properties/${property.id}/edit`}>
              <Button className="w-full" variant="outline">
                Update Property
              </Button>
            </Link>
          </div>
        ) : (
          <div></div>
        )}
        <div className="p-1">
          <Link to={`/properties/${property.id}`} state={{ property }}>
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              More Details
            </Button>
          </Link>
        </div>

        {showUpdateButton ? (
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
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
};
