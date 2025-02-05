
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentListingCard } from "./InvestmentListingCard";
import { useInvestorBalance } from "@/hooks/contract_interactions/useInvestmentReads";
import { useInvestmentWithdraw } from "@/hooks/contract_interactions/useInvestmentWrite";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { investmentProperties, userInvestments, isLoading } = useInvestmentAssetsRead();
  const { handleWithdraw } = useInvestmentWithdraw();
  
  console.log("Rendering UserInvestments with:", {
    investmentProperties,
    userInvestments,
    isLoading,
  });

  const InvestmentCard = ({ investment }: { investment: any }) => {
    // Move withdrawal amount state inside the card component
    const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
    const { balance, isLoading: balanceLoading } = useInvestorBalance(investment.id);

    const handleWithdrawClick = async () => {
      try {
        if (!withdrawalAmount) {
          toast.error("Please enter a withdrawal amount");
          return;
        }
        await handleWithdraw(investment.id, Number(withdrawalAmount));
        setWithdrawalAmount(""); // Reset only this card's input
        toast.success("Withdrawal successful");
      } catch (error) {
        console.error("Withdrawal error:", error);
        toast.error("Failed to process withdrawal");
      }
    };

    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">{investment.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Your Investment</span>
              <span className="font-medium">
                {balanceLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  `${balance} USDT`
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
                  onClick={handleWithdrawClick}
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

  const hasNoInvestments = (!userInvestments || userInvestments.length === 0) && 
                          (!investmentProperties || investmentProperties.length === 0);

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
              {userInvestments?.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {investmentProperties?.map((investment) => (
                <InvestmentListingCard key={investment.id} {...investment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
