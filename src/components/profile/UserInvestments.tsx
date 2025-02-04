import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentListingCard } from "../investment/InvestmentListingCard";
import { useInvestorBalance } from "@/hooks/contract_interactions/useInvestmentReads";
import { useInvestmentWithdraw } from "@/hooks/contract_interactions/useInvestmentWithdraw";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Wallet, ListChecks } from "lucide-react";
import { toast } from "sonner";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { userInvestments, investmentProperties, isLoading } = useInvestmentAssetsRead();
  const { handleWithdraw } = useInvestmentWithdraw();
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");

  console.log("Investment data:", {
    userInvestments,
    investmentProperties,
    isLoading,
  });

  const userOwnedInvestments = userInvestments?.filter((investment) => {
    if (!investment?.owner || !address) return false;
    return investment.owner.toLowerCase() === address.toLowerCase();
  });

  const userListedInvestments = investmentProperties?.filter((investment) => {
    if (!investment?.investor_id || !address) return false;
    return investment.investor_id.toLowerCase() === address.toLowerCase();
  });

  const handleWithdrawClick = async (investmentId: string) => {
    try {
      if (!withdrawalAmount) {
        toast.error("Please enter a withdrawal amount");
        return;
      }
      await handleWithdraw(investmentId, Number(withdrawalAmount));
      toast.success("Withdrawal successful");
      setWithdrawalAmount("");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to process withdrawal");
    }
  };

  const InvestmentCard = ({ investment }: { investment: any }) => {
    const { balance, isLoading: balanceLoading } = useInvestorBalance(investment.id);

    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            {investment.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Your Investment</span>
              <span className="font-medium">
                {balanceLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  `$${balance?.toLocaleString() || 0}`
                )}
              </span>
            </div>
            
            {balance > 0 && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount to withdraw"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min={0}
                  max={balance}
                />
                <Button 
                  className="w-full" 
                  onClick={() => handleWithdrawClick(investment.id)}
                  disabled={!withdrawalAmount || Number(withdrawalAmount) > balance}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card
        className={cn(
          "backdrop-blur-xl border transition-all duration-300",
          theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
        )}
      >
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

  const hasNoInvestments =
    (!userOwnedInvestments || userOwnedInvestments.length === 0) &&
    (!userListedInvestments || userListedInvestments.length === 0);

  if (hasNoInvestments) {
    return (
      <Card
        className={cn(
          "backdrop-blur-xl border transition-all duration-300",
          theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
        )}
      >
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
    <Card
      className={cn(
        "backdrop-blur-xl border transition-all duration-300",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      )}
    >
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
                <InvestmentCard key={investment.id} investment={investment} />
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
                  asset_value={investment.asset_value}
                  expected_roi={investment.expected_roi}
                  images={investment.images}
                  {...investment}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};