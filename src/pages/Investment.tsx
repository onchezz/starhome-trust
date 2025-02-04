import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ui/shimmer";
import { Users, TrendingUp, Building, DollarSign } from "lucide-react";
import { useState } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import { InvestmentCard } from "@/components/investment/InvestmentCard";

const Investment = () => {
  const {
    investmentProperties,
    isLoading: investmentPropertiesLoading,
    error
  } = useInvestmentAssetsRead();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();
  const { connect } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  // Calculate total statistics
  const totalStats = {
    totalInvestors: investmentProperties?.reduce((acc, property) => acc + 0, 0) || 0,
    averageROI: investmentProperties?.reduce((acc, property) => acc + Number(property.expected_roi || 0), 0) || 0,
    totalInvestment: investmentProperties?.reduce((acc, property) => acc + Number(property.asset_value || 0), 0) || 0,
  };

  const averageROI = investmentProperties?.length 
    ? (totalStats.averageROI / investmentProperties.length).toFixed(1)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-24">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
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
                  value: totalStats.totalInvestors || 0,
                  icon: Users,
                },
                {
                  title: "Average ROI",
                  value: `${averageROI}%`,
                  icon: TrendingUp,
                },
                {
                  title: "Total Investment",
                  value: formatCurrency(totalStats.totalInvestment || 0),
                  icon: DollarSign,
                },
              ].map((stat, i) => (
                <Card
                  key={stat.title}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView
                      ? "translateY(0)"
                      : `translateY(${20 + i * 10}px)`,
                    transition: `all 0.5s ease-out ${i * 0.1}s`,
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
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <Shimmer className="w-full h-48" />
                <CardHeader>
                  <Shimmer className="h-6 w-3/4 mb-2" />
                  <Shimmer className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Shimmer className="h-4 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j}>
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
            investmentProperties.map((property) => (
              <InvestmentCard
                key={property.id}
                property={property}
                expandedCardId={expandedCardId}
                setExpandedCardId={setExpandedCardId}
                handleConnectWallet={handleConnectWallet}
                address={address}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyInvestmentState error={!!error} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;