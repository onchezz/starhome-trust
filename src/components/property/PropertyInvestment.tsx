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

  if (!property) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Asking Price</span>
          <span className="font-semibold">{formatPrice(property.askingPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Interested Clients</span>
          <span className="font-semibold">{property.interestedClients}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Annual Growth Rate</span>
          <span className="font-semibold text-green-600">{property.annualGrowthRate}%</span>
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