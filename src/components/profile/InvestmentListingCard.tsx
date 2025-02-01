import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

interface InvestmentListingCardProps {
  id: string;
  name: string;
  description: string;
  asset_value: number;
  expected_roi: string | number;  // Updated to accept both string and number
  images: string;
}

export const InvestmentListingCard = ({
  id,
  name,
  description,
  asset_value,
  expected_roi,
  images,
}: InvestmentListingCardProps) => {
  const { theme } = useTheme();

  // Convert ROI to number for display, fallback to 0 if invalid
  const roiValue = typeof expected_roi === 'string' 
    ? parseFloat(expected_roi) || 0 
    : expected_roi;

  return (
    <Card
      className={cn(
        "backdrop-blur-xl border transition-all duration-300 hover:scale-105",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white/80"
      )}
    >
      <CardHeader className="p-0">
        <img
          src={images || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Value: ${asset_value.toLocaleString()}</p>
              <p className="text-sm font-medium">ROI: {roiValue}%</p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};