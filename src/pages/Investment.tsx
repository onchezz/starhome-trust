import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  TrendingUp,
  Building,
  DollarSign,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useConnect } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import { toast } from "sonner";
import { useStakingContract } from "@/hooks/staker/useStakingContract";
import { useInvestmentData } from "@/hooks/useInvestmentData";
import { formatUnits } from "ethers";

const Investment = () => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [investmentAmounts, setInvestmentAmounts] = useState<{
    [key: string]: string;
  }>({});

  const { connect } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal();
  const { handleStake, isStakePending } = useStakingContract();
  const { properties, balances, isLoading, address } = useInvestmentData();

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const calculateProgress = (current: number, total: number) => {
    return (current / total) * 100;
  };

  const handleConnectWallet = async () => {
    try {
      console.log("Connecting StarkNet wallet");
      const { connector } = await starknetkitConnectModal();

      if (!connector) {
        console.log("No connector selected");
        return;
      }

      await connect({ connector });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleInvest = async (propertyId: string) => {
    try {
      const amount = investmentAmounts[propertyId];
      console.log(`Investing ${amount} in property ${propertyId}`);

      if (!amount || isNaN(Number(amount))) {
        toast.error("Please enter a valid investment amount");
        return;
      }

      const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** 18));
      await handleStake(propertyId, amountBigInt);

      toast.success("Investment transaction initiated");
    } catch (error) {
      console.error("Investment error:", error);
      toast.error("Investment failed");
    }
  };

  const handleAmountChange = (propertyId: string, value: string) => {
    setInvestmentAmounts((prev) => ({
      ...prev,
      [propertyId]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-24">
          <div className="text-center">Loading investment properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatUnits(balances.ETH.value || 0n, 18)} ETH
              </div>
              <p className="text-xs text-muted-foreground">
                ${((Number(formatUnits(balances.ETH.value || 0n, 18))) * balances.ETH.price).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">STRK Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatUnits(balances.STRK.value || 0n, 18)} STRK
              </div>
              <p className="text-xs text-muted-foreground">
                ${((Number(formatUnits(balances.STRK.value || 0n, 18))) * balances.STRK.price).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  properties.reduce((acc, prop) => acc + Number(formatUnits(BigInt(prop.price.toString()), 18)), 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card key={property.id.toString()} className="overflow-hidden">
              <img
                src={property.images_id.toString()}
                alt={property.title.toString()}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{property.title.toString()}</CardTitle>
                <p className="text-sm text-gray-500">
                  {property.city}, {property.state}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Investment Progress</span>
                      <span>
                        {formatCurrency(Number(formatUnits(BigInt(property.price.toString()), 18)) * 0.4)} of{" "}
                        {formatCurrency(Number(formatUnits(BigInt(property.price.toString()), 18)))}
                      </span>
                    </div>
                    <Progress
                      value={40}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Number of Investors</p>
                      <p className="font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Minimum Investment</p>
                      <p className="font-semibold">
                        {formatCurrency(Number(formatUnits(BigInt(property.price.toString()), 18)) * 0.1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected ROI</p>
                      <p className="font-semibold">{property.annual_growth_rate.toString()}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Property Type</p>
                      <p className="font-semibold">{property.property_type.toString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Collapsible
                      className="flex-1"
                      open={expandedCardId === property.id.toString()}
                      onOpenChange={(open) =>
                        setExpandedCardId(open ? property.id.toString() : null)
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <Button className="w-full" disabled={isStakePending}>
                          {isStakePending
                            ? "Processing..."
                            : address
                            ? "Invest Now"
                            : "Connect Wallet"}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-4">
                        <Input
                          type="number"
                          placeholder={`Min. ${formatCurrency(Number(formatUnits(BigInt(property.price.toString()), 18)) * 0.1)}`}
                          value={investmentAmounts[property.id.toString()] || ""}
                          onChange={(e) =>
                            handleAmountChange(property.id.toString(), e.target.value)
                          }
                          min={Number(formatUnits(BigInt(property.price.toString()), 18)) * 0.1}
                          disabled={isStakePending}
                        />
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={
                            address
                              ? () => handleInvest(property.id.toString())
                              : handleConnectWallet
                          }
                          disabled={isStakePending}
                        >
                          {isStakePending ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <Wallet className="mr-2 h-4 w-4" />
                              {address ? "Invest" : "Connect Wallet"}
                            </>
                          )}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Investment;