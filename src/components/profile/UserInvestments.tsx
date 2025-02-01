import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAccount } from "@starknet-react/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserInvestments = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { userInvestments, investmentProperties, isLoading } =
    useInvestmentAssetsRead();

  // Filter investments where the owner matches the user's address
  const userOwnedInvestments = userInvestments?.filter((investment) => {
    if (!investment?.owner || !address) return false;

    // Normalize both addresses by removing '0x' prefix and converting to lowercase
    const normalizeAddress = (addr: string) =>
      addr.toLowerCase().replace("0x", "");
    const investmentOwnerNormalized = investment.owner.trimEnd.toString;
    const userAddressNormalized = address.trimEnd.toString;

    console.log("[UserInvestments] Comparing normalized addresses:", {
      investmentOwner: investmentOwnerNormalized,
      userAddress: userAddressNormalized,
      isMatch: investmentOwnerNormalized === userAddressNormalized,
    });

    return investmentOwnerNormalized === userAddressNormalized;
  });

  // Filter investments where the lister (investor_id) matches the user's address
  const userListedInvestments = investmentProperties?.filter((investment) => {
    if (!investment?.investor_id || !address) return false;

    const normalizeAddress = (addr: string) =>
      addr.toLowerCase().replace("0x", "");
    const investorIdNormalized = normalizeAddress(investment.investor_id);
    const userAddressNormalized = normalizeAddress(address);

    console.log("[UserInvestments] Comparing lister addresses:", {
      investorId: investorIdNormalized,
      userAddress: userAddressNormalized,
      isMatch: investorIdNormalized === userAddressNormalized,
    });

    return investorIdNormalized === userAddressNormalized;
  });

  console.log("[UserInvestments] User address:", address);
  console.log("[UserInvestments] All investments:", userInvestments);
  console.log(
    "[UserInvestments] User owned investments:",
    userOwnedInvestments
  );
  console.log(
    "[UserInvestments] User listed investments:",
    userListedInvestments
  );

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
    !userOwnedInvestments?.length && !userListedInvestments?.length;

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
            <div className="space-y-4 mt-4">
              {userOwnedInvestments?.map((investment) => (
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
                      <span>
                        Value: ${investment.asset_value.toLocaleString()}
                      </span>
                      <span>ROI: {investment.expected_roi}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="listed">
            <div className="space-y-4 mt-4">
              {userListedInvestments?.map((investment) => (
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
                      <span>
                        Value: ${investment.asset_value.toLocaleString()}
                      </span>
                      <span>ROI: {investment.expected_roi}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
