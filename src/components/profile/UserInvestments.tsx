import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentListingCard } from "./InvestmentListingCard";
import { useInvestmentAssetsRead, useInvestorBalance } from "@/hooks/contract_interactions/useInvestmentReads";
import { useInvestmentWrite } from "@/hooks/contract_interactions/useInvestmentWrite";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useRef } from "react";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { investmentProperties, userInvestments, isLoading } = useInvestmentAssetsRead();
  const { handleWithdraw } = useInvestmentWrite();
  
  // Create a map to store withdrawal amounts for each investment
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<{ [key: string]: string }>({});

  console.log("Investment data:", {
    investmentProperties,
    userInvestments,
    isLoading,
  });

  const handleWithdrawClick = async (investmentId: string) => {
    try {
      const amount = withdrawalAmounts[investmentId];
      if (!amount) {
        toast.error("Please enter a withdrawal amount");
        return;
      }
      await handleWithdraw(investmentId, Number(amount));
      
      // Clear only this investment's withdrawal amount after successful withdrawal
      setWithdrawalAmounts(prev => ({
        ...prev,
        [investmentId]: ""
      }));
      
      toast.success("Withdrawal successful");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to process withdrawal");
    }
  };

  const handleInputChange = (investmentId: string, value: string) => {
    // Only update if the value is a valid number or empty string
    if (value === "" || !isNaN(Number(value))) {
      setWithdrawalAmounts(prev => ({
        ...prev,
        [investmentId]: value
      }));
    }
  };

  const InvestmentCard = ({ investment }: { investment: any }) => {
    const { balance, isLoading: balanceLoading } = useInvestorBalance(investment.id);
    const inputRef = useRef<HTMLInputElement>(null);

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
                  value={withdrawalAmounts[investment.id] || ""}
                  onChange={(e) => handleInputChange(investment.id, e.target.value)}
                  min={0}
                  max={balance}
                  ref={inputRef}
                />
                <Button 
                  className="w-full" 
                  onClick={() => handleWithdrawClick(investment.id)}
                  disabled={!withdrawalAmounts[investment.id] || Number(withdrawalAmounts[investment.id]) > balance}
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