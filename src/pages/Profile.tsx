import { useAccount } from "@starknet-react/core";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet } from "lucide-react";
import { useStarHomeReadContract } from "@/hooks/contract_hooks/useStarHomeReadContract";

const Profile = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();

  // Fetch user assets using the contract hook
  const { data: userAssets } = useStarHomeReadContract({
    functionName: 'get_user_assets',
    args: [address],
  });

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    return Number(balance.formatted).toFixed(4);
  };

  // Dummy user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    isVerified: true,
    isInvestor: true,
    isAgent: true,
    assets: userAssets || [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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
                  <label className="text-sm font-medium text-gray-500">Wallet Address</label>
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
                    <span className="font-mono">{formatBalance(balances.ETH)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>USDT</span>
                    <span className="font-mono">{formatBalance(balances.USDT)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>STRK</span>
                    <span className="font-mono">{formatBalance(balances.STRK)}</span>
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
                {userData.assets.length === 0 ? (
                  <p className="text-gray-500">No assets found</p>
                ) : (
                  userData.assets.map((asset: any) => (
                    <div key={asset.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{asset.name}</h4>
                        <p className="text-sm text-gray-500">{asset.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.value}</p>
                        <p className="text-sm text-gray-500">ROI: {asset.roi}%</p>
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