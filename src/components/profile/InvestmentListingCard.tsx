import { InvestmentAsset } from "@/types/investment";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { parseImagesData } from "@/utils/imageUtils";

interface InvestmentListingCardProps {
  investment: InvestmentAsset;
}

export const InvestmentListingCard = ({ investment }: InvestmentListingCardProps) => {
  const { imageUrls } = parseImagesData(investment.images);
  const firstImage = imageUrls[0] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={firstImage} 
          alt={investment.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold">{investment.name}</h3>
        <p className="text-sm text-muted-foreground">
          {investment.description.slice(0, 100)}...
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Value</p>
            <p className="font-medium">${investment.asset_value.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="font-medium">{investment.expected_roi}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" asChild>
          <Link to={`/investment/${investment.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to={`/investment/edit/${investment.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};