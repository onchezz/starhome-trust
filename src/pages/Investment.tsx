import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shimmer } from "@/components/ui/shimmer";
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
import { useConnect, useAccount } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { InvestmentAssetConverter } from "@/types/investment";
import { num } from "starknet";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";

const Investment = () => {
  const { investmentProperties, investmentPropertiesLoading, investmentPropertiesError } =
      usePropertyRead();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [investmentAmounts, setInvestmentAmounts] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();
  const { connect } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Simulate loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  });

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

      const amountBigInt = BigInt(Number(amount) * 10 ** 18);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-24">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Shimmer className="h-6 w-24" />
                  <Shimmer className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Shimmer className="h-8 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {[
                {
                  title: "Total Properties",
                  value: investmentProperties.length,
                  icon: Building,
                },
                { title: "Total Investors", value: "243", icon: Users },
                { title: "Average ROI", value: "15%", icon: TrendingUp },
                { title: "Total Investment", value: "$25M", icon: DollarSign },
              ].map((stat, index) => (
                <Card
                  key={stat.title}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translateY(0)"
                      : `translateY(${20 + index * 10}px)`,
                    transition: `all 0.5s ease-out ${index * 0.1}s`,
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Investment Cards */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden animate-pulse"
              >
                <Shimmer className="w-full h-48" />
                <CardHeader>
                  <Shimmer className="h-6 w-3/4 mb-2" />
                  <Shimmer className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Shimmer className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Shimmer className="h-4 w-24 mb-2" />
                        <Shimmer className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Shimmer className="h-10 w-full" />
                    <Shimmer className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : investmentProperties.length > 0 ? (
            investmentProperties.map((investmentProperty, index) => {
              const property = InvestmentAssetConverter.fromStarknetProperty(investmentProperty);
              const propertyId = num.toHex(property.id);
              
              const displayData = {
                ...property,
                currentInvestment: property.available_staking_amount,
                totalInvestment: property.asset_value,
                minInvestment: property.min_investment_amount,
                roi: property.expected_roi,
                type: property.investment_type,
                title: property.name,
                image: property.images
              };

              return (
                <Card
                  key={propertyId}
                  className="overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translateY(0)"
                      : `translateY(${20 + index * 10}px)`,
                    transition: `all 0.5s ease-out ${index * 0.1}s`,
                  }}
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={displayData.image}
                      alt={displayData.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle>{displayData.title}</CardTitle>
                    <p className="text-sm text-gray-500">{property.location}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Investment Progress</span>
                          <span>
                            {formatCurrency(displayData.currentInvestment)} of{" "}
                            {formatCurrency(displayData.totalInvestment)}
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(
                            displayData.currentInvestment,
                            displayData.totalInvestment
                          )}
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
                            {formatCurrency(displayData.minInvestment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Expected ROI</p>
                          <p className="font-semibold">{displayData.roi}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Property Type</p>
                          <p className="font-semibold">{displayData.type}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Collapsible
                          className="flex-1"
                          open={expandedCardId === propertyId}
                          onOpenChange={(open) =>
                            setExpandedCardId(open ? propertyId : null)
                          }
                        >
                          <CollapsibleTrigger asChild>
                            <Button className="w-full">
                              {address
                                ? "Invest Now"
                                : "invest in this property"}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-4 space-y-4">
                            <Input
                              type="number"
                              placeholder={`Min. ${formatCurrency(
                                displayData.minInvestment
                              )}`}
                              value={investmentAmounts[propertyId] || ""}
                              onChange={(e) =>
                                handleAmountChange(propertyId, e.target.value)
                              }
                              min={displayData.minInvestment}
                            />
                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={
                                address
                                  ? () => handleInvest(propertyId)
                                  : handleConnectWallet
                              }
                            >
                              <Wallet className="mr-2 h-4 w-4" />
                              {address ? "Invest" : "Connect Wallet"}
                            </Button>
                          </CollapsibleContent>
                        </Collapsible>

                        <Link to={`/investment/${propertyId}`}>
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
            })
          ) : (
            <div className="col-span-full">
              <EmptyInvestmentState error={!!investmentPropertiesError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;
