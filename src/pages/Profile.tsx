import { useAccount } from "@starknet-react/core";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/useTokenBalances";

const Profile = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    return Number(balance.formatted).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Wallet Address</label>
                  <p className="text-sm font-mono break-all">{address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  );
};

export default Profile;