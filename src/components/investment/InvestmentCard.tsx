import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { InvestmentAsset } from "@/types/investment";
import { ImageGallery } from "./ImageGallery";
import { useInvestment } from "@/hooks/useInvestment";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface InvestmentCardProps {
  property: InvestmentAsset;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  handleConnectWallet: () => void;
  address?: string;
}

export const InvestmentCard = ({
  property,
  expandedCardId,
  setExpandedCardId,
  handleConnectWallet,
  address,
}: InvestmentCardProps) => {
  // Always call hooks at the top level, regardless of conditions
  const { 
    investmentAmount, 
    setInvestmentAmount, 
    handleInvest,
    approveAndInvest 
  } = useInvestment(property.investment_token);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (current: number, total: number) => {
    return (current / total) * 100;
  };

  const progress = calculateProgress(
    property.asset_value - property.available_staking_amount,
    property.asset_value
  );

  const handleInvestClick = async () => {
    if (!address) {
      handleConnectWallet();
      return;
    }
    await handleInvest(property.id);
  };

  return (
    <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <ImageGallery imagesId={property.images} />
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <p className="text-sm text-gray-500">
          {`${property.location.address}, ${property.location.city}, ${property.location.country}`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Investment Progress</span>
              <span>
                {formatCurrency(property.asset_value - property.available_staking_amount)}{" "}
                of {formatCurrency(property.asset_value)}
              </span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Number of Investors</p>
              <p className="font-semibold">0</p>
            </div>
            <div>
              <p className="text-gray-500">Minimum Investment</p>
              <p className="font-semibold">
                {formatCurrency(property.min_investment_amount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Expected ROI</p>
              <p className="font-semibold">{property.expected_roi}%</p>
            </div>
            <div>
              <p className="text-gray-500">Property Type</p>
              <p className="font-semibold">{property.investment_type}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Collapsible
              className="flex-1"
              open={expandedCardId === property.id}
              onOpenChange={(open) =>
                setExpandedCardId(open ? property.id : null)
              }
            >
              <CollapsibleTrigger asChild>
                <Button className="w-full">
                  {address ? "Invest Now" : "Invest in this property"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <Input
                  type="number"
                  placeholder={`Min. ${formatCurrency(
                    property.min_investment_amount
                  )}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={property.min_investment_amount}
                />
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleInvestClick}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {address ? "Invest" : "Connect Wallet"}
                </Button>
              </CollapsibleContent>
            </Collapsible>

            <Link to={`/investment/${property.id}`}>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                More Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};