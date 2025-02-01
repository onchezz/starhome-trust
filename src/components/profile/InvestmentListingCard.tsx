import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { parseImagesData } from "@/utils/imageUtils";
import { useNavigate } from "react-router-dom";

interface InvestmentListingCardProps {
  investment: {
    id: string;
    name: string;
    description: string;
    asset_value: number;
    expected_roi: number;
    images: string;
  };
}

export const InvestmentListingCard = ({ investment }: InvestmentListingCardProps) => {
  const navigate = useNavigate();
  const { imageUrls } = parseImagesData(investment.images);

  const handleUpdate = () => {
    navigate(`/investment/edit/${investment.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={imageUrls[0] || '/placeholder.svg'}
          alt={investment.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{investment.name}</h3>
            <p className="text-sm text-muted-foreground">
              {investment.description.slice(0, 100)}...
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleUpdate}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm">
          <span>Value: ${investment.asset_value.toLocaleString()}</span>
          <span>ROI: {investment.expected_roi}%</span>
        </div>
      </CardContent>
    </Card>
  );
};