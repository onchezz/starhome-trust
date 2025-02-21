import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Property } from "@/types/property";
import { useProperty } from "@/hooks/useProperty";

interface PropertyInvestmentProps {
  property: Property;
  handlePayForProperty;
  isLoadingTx: boolean;
  status;
}

export const PropertyInvestment = ({
  property,
  handlePayForProperty,
  isLoadingTx,
}: PropertyInvestmentProps) => {
  // const { handlePayForProperty } = useProperty();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = async () => {
    const tx = await handlePayForProperty(property.id, property.asking_price);

    toast.success("Proceeding to ", tx);
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
          <span className="font-semibold">
            {formatPrice(property.asking_price)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Interested Clients</span>
          <span className="font-semibold">{property.interestedClients}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Annual Growth Rate</span>
          <span className="font-semibold text-green-600">
            {property.annualGrowthRate}%
          </span>
        </div>
        {property.status === "sold" ? (
          <Button
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            disabled={true}
          >
            {/* <ShoppingCart className="h-4 w-4" /> */}
            Sold
          </Button>
        ) : (
          <Button
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            onClick={handleBuyNow}
            disabled={isLoadingTx}
          >
            <ShoppingCart className="h-4 w-4" />
            {isLoadingTx ? "Loading transaction ..." : "Buy Now"}
          </Button>
        )}
        {/* <Button
          className="w-full flex items-center justify-center gap-2"
          size="lg"
          onClick={handleBuyNow}
          disabled={isLoadingTx}
        >
          <ShoppingCart className="h-4 w-4" />
          {isLoadingTx ? "Loading transaction ..." : "Buy Now"}
        </Button> */}
      </div>
    </Card>
  );
};
