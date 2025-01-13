import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyInvestmentProps {
  minInvestment: number;
  investors: number;
  roi: string;
}

export const PropertyInvestment = ({ minInvestment, investors, roi }: PropertyInvestmentProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Minimum Investment</span>
          <span className="font-semibold">{formatPrice(minInvestment)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Investors</span>
          <span className="font-semibold">{investors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expected ROI</span>
          <span className="font-semibold text-green-600">{roi}</span>
        </div>
        <Button className="w-full" size="lg">
          Invest Now
        </Button>
      </div>
    </Card>
  );
};