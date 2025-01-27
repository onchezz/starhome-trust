/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAccount } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet } from "lucide-react";
import { useStarHomeReadContract } from "@/hooks/contract_hooks/useStarHomeReadContract";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useContractReads";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";

const Profile = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();

  // Fetch user assets using the contract hook
  const { data: userAssets, isLoading: assetsLoading } =
    useStarHomeReadContract({
      functionName: "get_user_assets",
      args: [address],
    });

  const {
    agent: agentInfo,
    isLoading: isLoadingAgent,
    error,
  } = useUserReadByAddress(address);

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    console.log("datetime" + Math.floor(Date.now() / 1000));
    return Number(balance.formatted).toFixed(4);
  };
  const { handleSignAsAgent } = useUserWrite();

  const userData = {
    name: agentInfo.name || "John Doe",
    email: agentInfo.email || "j@gmail.com",
    phone: agentInfo.phone || "123",
    profileImage:
      agentInfo.profile_image ||
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    isVerified: agentInfo.is_verified,
    isInvestor: agentInfo.is_investor,
    isAgent: agentInfo.is_agent,
    assets: Array.isArray(userAssets) ? userAssets : [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Details
                <div className="flex gap-2">
                  {userData.isVerified && (
                    <Badge variant="secondary">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {userData.isInvestor && (
                    <Badge variant="outline">
                      <Wallet className="w-3 h-3 mr-1" />
                      Investor
                    </Badge>
                  )}
                  {userData.isAgent && (
                    <Badge>
                      <Building2 className="w-3 h-3 mr-1" />
                      Agent
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{userData.name}</h3>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                    <p className="text-sm text-gray-500">{userData.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Wallet Address
                  </label>
                  <p className="text-sm font-mono break-all">{address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balances Card */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading balances...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>ETH</span>
                    <span className="font-mono">
                      {formatBalance(balances.ETH)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>USDT</span>
                    <span className="font-mono">
                      {formatBalance(balances.USDT)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>STRK</span>
                    <span className="font-mono">
                      {formatBalance(balances.STRK)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/create-property">
                  <Button className="w-full">Create Property</Button>
                </Link>
                {/* <Link to="/create-agent">
                  <Button className="w-full">Register As Agent</Button>
                </Link> */}
                <Button onClick={handleSignAsAgent} className="w-full">
                  Register As Agent
                </Button>

                <Link to="/add-investment">
                  <Button className="w-full">Create Investment</Button>
                </Link>
                <Link to="/create-user">
                  <Button className="w-full">Update Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* User Assets Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>My Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetsLoading ? (
                  <p>Loading assets...</p>
                ) : userData.assets.length === 0 ? (
                  <p className="text-gray-500">No assets found</p>
                ) : (
                  userData.assets.map((asset: any) => (
                    <div
                      key={asset.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{asset.name}</h4>
                        <p className="text-sm text-gray-500">{asset.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.value}</p>
                        <p className="text-sm text-gray-500">
                          ROI: {asset.roi}%
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
