import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { ImageGallery } from "../investment/ImageGallery";
import { useNavigate } from "react-router-dom";
import { InvestmentAsset } from "@/types/investment";

interface InvestmentListingCardProps
  extends Omit<Partial<InvestmentAsset>, "expected_roi"> {
  id: string;
  name: string;
  description: string;
  asset_value: number;
  expected_roi: string;
  images: string;
}

export const InvestmentListingCard = ({
  id,
  name,
  description,
  asset_value,
  expected_roi,
  images,
  ...rest
}: InvestmentListingCardProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Convert ROI to number for display, fallback to 0 if invalid
  const roiValue =
    typeof expected_roi === "string"
      ? parseFloat(expected_roi) || 0
      : expected_roi;

  const handleEdit = () => {
    // Combine all props into a single investment object
    const investmentData: InvestmentAsset = {
      id,
      name,
      description,
      asset_value,
      expected_roi,
      images,
      ...rest,
    } as InvestmentAsset;

    // Navigate to AddInvestment with state
    navigate(`/investment/${id}/edit`, {
      state: {
        mode: "edit",
        investmentData,
      },
    });
  };

  return (
    <Card
      className={cn(
        "backdrop-blur-xl border transition-all duration-300 hover:scale-105",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white/80"
      )}
    >
      <CardHeader className="p-0">
        <ImageGallery imagesId={images} />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                Value: ${asset_value.toLocaleString()}
              </p>
              <p className="text-sm font-medium">ROI: {roiValue}%</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
