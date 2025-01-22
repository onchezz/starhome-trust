import { useAccount } from "@starknet-react/core";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const Profile = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    return Number(balance.formatted).toFixed(4);
  };

  // Dummy user data - in a real app this would come from your backend
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    isVerified: true,
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
                {userData.isVerified && (
                  <Badge variant="secondary" className="ml-2">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default Profile;