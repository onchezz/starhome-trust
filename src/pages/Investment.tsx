import { InvestmentCard } from "@/components/investment/InvestmentCard";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import { PageLoader } from "@/components/ui/page-loader";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shimmer } from "@/components/ui/shimmer";
import { formatCurrency } from "@/utils/utils";
import { inView } from "framer-motion";
import { Building, Users, TrendingUp, DollarSign } from "lucide-react";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/useInvestmentReads";
import { useWalletConnect } from "@/hooks/useWalletConnect";

export const Investment = () => {
  const { address } = useAccount();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
  const { connectWallet } = useWalletConnect();

  // useEffect(() => {
  //   if (!address) {
  //     connectWallet();
  //   }
  //   // Set initial loading to false after properties are fetched
  // }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageLoader />;
      </div>
    );
  }

  if (error) {
    console.error("Error loading investments:", error);
    return <div>Error loading investments</div>;
  }

  if (!investmentProperties?.length) {
    return <EmptyInvestmentState />;
  }
  const totalStats = {
    totalInvestors:
      investmentProperties?.reduce(
        (acc, property) => acc + Number(property.investors || 0),
        0
      ) || 0,
    averageROI:
      investmentProperties?.reduce(
        (acc, property) => acc + Number(property.expected_roi || 0),
        0
      ) || 0,
    totalInvestment:
      investmentProperties?.reduce(
        (acc, property) => acc + Number(property.asset_value || 0),
        0
      ) || 0,
  };

  const averageROI = investmentProperties?.length
    ? (totalStats.averageROI / investmentProperties.length).toFixed(1)
    : "0";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-24">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentProperties.map((property) => (
          <InvestmentCard
            key={property.id}
            property={property}
            expandedCardId={expandedCardId}
            setExpandedCardId={setExpandedCardId}
            // handleConnectWallet={handleConnectWallet}
          />
        ))}
      </div>
    </div>
  );
};

export default Investment;
