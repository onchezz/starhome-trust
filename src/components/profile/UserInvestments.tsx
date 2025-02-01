import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentListingCard } from "./InvestmentListingCard";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { userInvestments, investmentProperties, isLoading } = useInvestmentAssetsRead();

  console.log("Investment data:", { userInvestments, investmentProperties, isLoading });

  const userOwnedInvestments = userInvestments?.filter((investment) => {
    if (!investment?.owner || !address) return false;
    return investment.owner.toLowerCase() === address.toLowerCase();
  });

  const userListedInvestments = investmentProperties?.filter((investment) => {
    if (!investment?.investor_id || !address) return false;
    return investment.investor_id.toLowerCase() === address.toLowerCase();
  });

  console.log("Filtered investments:", { userOwnedInvestments, userListedInvestments });

  if (isLoading) {
    return (
      <Card className={cn(
        "backdrop-blur-xl border transition-all duration-300",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasNoInvestments = (!userOwnedInvestments || userOwnedInvestments.length === 0) && 
                          (!userListedInvestments || userListedInvestments.length === 0);

  if (hasNoInvestments) {
    return (
      <Card className={cn(
        "backdrop-blur-xl border transition-all duration-300",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No investments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "backdrop-blur-xl border transition-all duration-300",
      theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
    )}>
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owned">Investments Made</TabsTrigger>
            <TabsTrigger value="listed">Investments Listed</TabsTrigger>
          </TabsList>
          <TabsContent value="owned">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {userOwnedInvestments?.map((investment) => (
                <InvestmentListingCard
                  key={investment.id}
                  id={investment.id}
                  name={investment.name}
                  description={investment.description}
                  asset_value={Number(investment.asset_value)}
                  expected_roi={investment.expected_roi}
                  images={investment.images}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {userListedInvestments?.map((investment) => (
                <InvestmentListingCard
                  key={investment.id}
                  id={investment.id}
                  name={investment.name}
                  description={investment.description}
                  asset_value={Number(investment.asset_value)}
                  expected_roi={investment.expected_roi}
                  images={investment.images}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};