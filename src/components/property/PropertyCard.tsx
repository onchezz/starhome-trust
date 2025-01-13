import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";

interface PropertyCardProps {
  id: string | number;
  title: string;
  location: {
    city: string;
    state: string;
  };
  price: number;
  askingPrice: number;
  interestedClients: number;
  annualGrowthRate: number;
  images: string[];
  propertyType: string;
}

export const PropertyCard = ({
  id,
  title,
  location,
  price,
  askingPrice,
  interestedClients,
  annualGrowthRate,
  images,
  propertyType,
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-4 right-4 bg-green-500 text-white hover:bg-green-600"
        >
          For Sale
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {location.city}, {location.state}
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(askingPrice)}
            </div>
            <div className="text-sm text-muted-foreground">
              Market Value: {formatPrice(price)}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {interestedClients} interested
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                {annualGrowthRate}% /year
              </span>
            </div>
          </div>

          <Badge variant="outline" className="bg-secondary">
            {propertyType}
          </Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/properties/${id}`} className="w-full">
          <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
            View Details
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};