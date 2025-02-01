import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAccount } from "@starknet-react/core";
import { num } from "starknet";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { userInvestments, isLoading } = useInvestmentAssetsRead();

  // Filter investments where the owner matches the user's address
  const userOwnedInvestments = userInvestments?.filter((investment) => {
    if (!investment?.owner || !address) return false;

    // Convert both addresses to lowercase hex strings for comparison
    const investmentOwnerHex = num.toHex(investment.owner);
    const userAddressHex = address.toLowerCase();

    console.log("[UserInvestments] Comparing addresses:", {
      investmentOwner: investmentOwnerHex,
      userAddress: userAddressHex,
      isMatch: investmentOwnerHex.toLowerCase() === userAddressHex
    });
    
    return investmentOwnerHex.toLowerCase() === userAddressHex;
  });

  console.log("[UserInvestments] User address:", address);
  console.log("[UserInvestments] All investments:", userInvestments);
  console.log("[UserInvestments] Filtered investments:", userOwnedInvestments);

  if (isLoading) {
    return (
      <Card className={cn(
        "backdrop-blur-xl border transition-all duration-300",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Your Listed Investments</CardTitle>
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

  if (!userOwnedInvestments?.length) {
    return (
      <Card className={cn(
        "backdrop-blur-xl border transition-all duration-300",
        theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Your Listed Investments</CardTitle>
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
        <CardTitle>Your Listed Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userOwnedInvestments.map((investment) => (
            <Link 
              key={investment.id} 
              to={`/investment/${investment.id}`}
              className="block hover:opacity-80 transition-opacity"
            >
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold">{investment.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {investment.description.slice(0, 100)}...
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Value: ${investment.asset_value.toLocaleString()}</span>
                  <span>ROI: {investment.expected_roi}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};