import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { parseImagesData } from "@/utils/imageUtils";

interface PropertyCardProps {
  id: string | number;
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
  imagesUrl: string;
  propertyType: string;
  status: string;
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
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Parse the imagesUrl to get the first image URL
  const { imageUrls } = parseImagesData(imagesUrl);
  const displayImageUrl = imageUrls[0] || "/placeholder.svg";

  console.log("Property Card Image URL:", displayImageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group bg-card text-card-foreground hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <img
            src={displayImageUrl}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {status}
          </Badge>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {location.city}, {location.state}, {location.country}
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
            <Button 
              className="w-full"
              variant="default"
            >
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};