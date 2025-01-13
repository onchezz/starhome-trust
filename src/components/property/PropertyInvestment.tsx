import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import propertiesData from "@/data/properties.json";
import investmentsData from "@/data/investments.json";

interface PropertyInvestmentProps {
  propertyId: string;
}

export const PropertyInvestment = ({ propertyId }: PropertyInvestmentProps) => {
  // Find the property data
  const property = propertiesData.properties.find(p => p.id === propertyId);
  
  // Find the corresponding investment data
  const investment = investmentsData.investments.find(
    i => i.propertyId === parseInt(propertyId.replace('P', ''))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = () => {
    toast.success("Proceeding to payment...");
  };

  if (!property || !investment) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Minimum Investment</span>
          <span className="font-semibold">{formatPrice(investment.minAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Investors</span>
          <span className="font-semibold">{investment.totalInvestors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expected ROI</span>
          <span className="font-semibold text-green-600">{investment.returns.projected}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Historical ROI</span>
          <span className="font-semibold text-blue-600">{investment.returns.historical}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Investment Required</span>
          <span className="font-semibold">{formatPrice(investment.totalAmount)}</span>
        </div>
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          size="lg"
          onClick={handleBuyNow}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </Button>
      </div>
    </Card>
  );
};