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
import { useState, useEffect } from "react";
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
import {
  useInvestmentAssetsRead,
  usePropertyRead,
} from "@/hooks/contract_interactions/usePropertiesReads";
import { InvestmentAsset } from "@/types/investment";
import { num } from "starknet";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import { parseImagesData } from "@/utils/imageUtils";

const ImageGallery = ({ imagesId }: { imagesId: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { imageUrls } = parseImagesData(imagesId);

  useEffect(() => {
    setIsLoading(true);
  }, [imagesId]);

  if (!imageUrls.length) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden group h-48">
      {isLoading && (
        <div className="absolute inset-0">
          <Shimmer className="w-full h-full" />
        </div>
      )}
      <img
        src={imageUrls[currentImageIndex]}
        alt={`Property ${currentImageIndex + 1}`}
        className={`w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImageIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const Investment = () => {
  const {
    investmentProperties,
    isLoading: investmentPropertiesLoading,
    investmentPropertiesError,
  } = useInvestmentAssetsRead();
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

  // Calculate total statistics
  const totalStats = investmentProperties?.reduce(
    (acc, property) => {
      return {
        totalInvestors: acc.totalInvestors + 0, // This would come from contract
        averageROI: acc.averageROI + Number(property.expected_roi || 0),
        totalInvestment:
          acc.totalInvestment + Number(property.asset_value || 0),
      };
    },
    { totalInvestors: 0, averageROI: 0, totalInvestment: 0 }
  );

  const averageROI = totalStats
    ? (totalStats.averageROI / (investmentProperties?.length || 1)).toFixed(1)
    : "0";

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
                  value: investmentProperties?.length || 0,
                  icon: Building,
                },
                {
                  title: "Total Investors",
                  value: totalStats?.totalInvestors || 0,
                  icon: Users,
                },
                {
                  title: "Average ROI",
                  value: `${averageROI}%`,
                  icon: TrendingUp,
                },
                {
                  title: "Total Investment",
                  value: formatCurrency(totalStats?.totalInvestment || 0),
                  icon: DollarSign,
                },
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
              <Card key={index} className="overflow-hidden animate-pulse">
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
          ) : investmentProperties?.length > 0 ? (
            investmentProperties.map((property: InvestmentAsset, index) => {
              const displayData = {
                ...property,
                currentInvestment: property.available_staking_amount,
                totalInvestment: property.asset_value,
                minInvestment: property.min_investment_amount,
                roi: property.expected_roi,
                type: property.investment_type,
                title: property.name,
                image: property.images,
              };

              const progress = calculateProgress(
                displayData.asset_value - displayData.available_staking_amount,
                displayData.asset_value
              );

              return (
                <Card
                  key={property.id}
                  className="overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translateY(0)"
                      : `translateY(${20 + index * 10}px)`,
                    transition: `all 0.5s ease-out ${index * 0.1}s`,
                  }}
                >
                  <ImageGallery imagesId={displayData.image} />
                  <CardHeader>
                    <CardTitle>{displayData.title}</CardTitle>
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
                            {formatCurrency(
                              displayData.asset_value -
                                displayData.available_staking_amount
                            )}{" "}
                            of {formatCurrency(displayData.asset_value)}
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
                          open={expandedCardId === property.id}
                          onOpenChange={(open) =>
                            setExpandedCardId(open ? property.id : null)
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
                              value={investmentAmounts[property.id] || ""}
                              onChange={(e) =>
                                handleAmountChange(property.id, e.target.value)
                              }
                              min={displayData.minInvestment}
                            />
                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={
                                address
                                  ? () => handleInvest(property.id)
                                  : handleConnectWallet
                              }
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
