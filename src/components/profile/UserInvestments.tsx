import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentListingCard } from "./InvestmentListingCard";
import {
  useInvestmentAssetsRead,
  useInvestorBalance,
} from "@/hooks/contract_interactions/useInvestmentReads";
import { useInvestmentWrite } from "@/hooks/contract_interactions/useInvestmentWrite";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { InvestmentAsset } from "@/types/investment";
import { findMatchingToken } from "@/utils/tokenMatching";
import { ImageGallery } from "../investment/ImageGallery";
import { useInvestment } from "@/hooks/useInvestment";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { investmentProperties, userInvestments, isLoading } =
    useInvestmentAssetsRead();
  const { handleWithdraw } = useInvestmentWrite();
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  console.log("User investments data:", {
    address,
    userInvestments,
    isLoading,
  });

  useEffect(() => {
    const getPropertied = async () => {
      const userInvest = await userInvestments;
      console.log(`user fetched investments  =  ${userInvest}`);
    };
    getPropertied();
  }, []);

  const handleWithdrawClick = async (
    investmentId: string,
    inputValue: string
  ) => {
    try {
      if (!inputValue) {
        toast.error("Please enter a withdrawal amount");
        return;
      }

      const amount = Number(inputValue);
      if (isNaN(amount)) {
        toast.error("Please enter a valid number");
        return;
      }
      setIsLoadingTransaction(true);
      const txStatus = await handleWithdraw(investmentId, amount);
      setIsLoadingTransaction(false);

      if (txStatus.status.isSuccess) {
        setIsLoadingTransaction(false);
        toast.success("Withdrawal successful");
      }
    } catch (error) {
      setIsLoadingTransaction(false);
      console.error("Withdrawal error:", error);
      toast.error("Failed to process withdrawal");
    }
  };

  if (!address) {
    return <div>Wallet not connected</div>;
  }
  const InvestmentCard = ({ investment }: { investment: InvestmentAsset }) => {
    const { balance, isLoading: balanceLoading } = useInvestorBalance(
      investment.id
    );
    const matchingToken = findMatchingToken(investment.investment_token);
    const {
      investmentAmount,
      setInvestmentAmount,
      handleInvest,
      approveAndInvest,
      allowance,
      refreshTokenData,
    } = useInvestment(matchingToken.address);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");

    const handleInvestClick = async (investmentId: string) => {
      if (!address) {
        handleConnectWallet();
        return;
      }
      await refreshTokenData();

      await handleInvest(investmentId);
    };
    if (balance == 0){
      return (<div></div>)
    }

    return (
      <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <ImageGallery imagesId={investment.images} />
        <CardHeader>
          <CardTitle className="text-lg">{investment.name}</CardTitle>
          <div>
            <p className="text-sm text-gray-500">
              {`${investment.location.address}, ${investment.location.city}, ${investment.location.country}`}
            </p>
          </div>
          {/* <span className="text-sm  ">
            Investment Token {matchingToken.symbol}
          </span> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {balance <= 0 ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    current Investment
                  </span>
                  <span className="font-medium text-sm">
                    {balanceLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <span className="font-medium text-xs">
                        {`${balance} ${matchingToken.symbol}`}
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    current Investment
                  </span>
                  <span className="font-medium text-sm">
                    {balanceLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <span className="font-medium text-xs">
                        {`${balance} ${matchingToken.symbol}`}
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
            {balance <= 0 ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount to invest"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={investment.min_investment_amount}
                  // max={balance}
                  ref={inputRef}
                />
                <Button
                  className="w-full"
                  onClick={() => handleInvestClick(investment.id)}
                  disabled={!investmentAmount || isLoading}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoadingTransaction ? "Loading tx ...." : "invest more "}
                </Button>
              </div>
            ) : (
              <></>
            )}

            {balance > 0 && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Amount to withdraw"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  min={0}
                  max={balance}
                  ref={inputRef}
                />
                <Button
                  className="w-full"
                  onClick={() => handleWithdrawClick(investment.id, inputValue)}
                  disabled={
                    !inputValue || Number(inputValue) > balance || isLoading
                  }
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isLoadingTransaction ? "Loading tx ...." : "Withdraw Funds"}
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
    (!userInvestments || userInvestments.length === 0) &&
    (!investmentProperties || investmentProperties.length === 0);

  if (!address) {
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
          <p className="text-muted-foreground">
            Please connect your wallet to view your investments.
          </p>
        </CardContent>
      </Card>
    );
  }

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
              {/* {userInvestments?.map((investment) => ( */}
              {investmentProperties?.map((investment) => (
                
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listed">
            {(!userInvestments.flatMap)? (
              <div>
                <Card
                  className={cn(
                    "backdrop-blur-xl border transition-all duration-300",
                    theme === "dark"
                      ? "bg-black/40 border-white/10"
                      : "bg-white"
                  )}
                >
                  <CardHeader>
                    <CardTitle>Your Investments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No investments found.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {userInvestments?.map((investment) => (
                  <InvestmentListingCard key={investment.id} {...investment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
function useCallback(arg0: () => Promise<void>, arg1: any[]) {
  throw new Error("Function not implemented.");
}

function handleConnectWallet() {
  throw new Error("Function not implemented.");
}
