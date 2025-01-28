import { useAccount } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Loader2 } from "lucide-react";
import { useStarHomeReadContract } from "@/hooks/contract_hooks/useStarHomeReadContract";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const {
    user,
    isLoading: isLoadingUser,
    error,
  } = useUserReadByAddress(address);
  const { handleSignAsAgent } = useUserWrite();

  const { data: userAssets, isLoading: assetsLoading } = useStarHomeReadContract({
    functionName: "get_user_assets",
    args: [address],
  });

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 flex justify-center items-center min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        No user found
      </div>
    );
  }

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    return Number(balance.formatted).toFixed(4);
  };

  const userData = {
    name: user.name || "John Doe",
    email: user.email || "j@gmail.com",
    phone: user.phone || "123",
    profileImage:
      user.profile_image ||
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    isVerified: user.is_verified,
    isInvestor: user.is_investor,
    isAgent: user.is_agent,
    assets: Array.isArray(user) ? user : [],
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
    )}>
      <div className="container mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className={cn(
            "backdrop-blur-xl border transition-all duration-300",
            theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
          )}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
                  Profile Details
                </span>
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
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h3 className={cn(
                      "font-medium text-xl",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>{userData.name}</h3>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>{userData.email}</p>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>{userData.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "p-4 rounded-lg",
                    theme === "dark" ? "bg-white/5" : "bg-gray-50"
                  )}
                >
                  <label className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  )}>
                    Wallet Address
                  </label>
                  <p className="text-sm font-mono break-all mt-1">{address}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Link to="/create-property">
                    <Button className="w-full">Create Property</Button>
                  </Link>
                  <Button onClick={handleSignAsAgent} className="w-full">
                    Register As Agent
                  </Button>
                  <Link to="/add-investment">
                    <Button className="w-full">Create Investment</Button>
                  </Link>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className={cn(
              "backdrop-blur-xl border transition-all duration-300",
              theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={theme === "dark" ? "text-white" : ""}>
                  Wallet Balances
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBal ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={theme === "dark" ? "text-gray-300" : ""}>ETH</span>
                      <span className="font-mono">{formatBalance(balances.ETH)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === "dark" ? "text-gray-300" : ""}>USDT</span>
                      <span className="font-mono">{formatBalance(balances.USDT)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === "dark" ? "text-gray-300" : ""}>STRK</span>
                      <span className="font-mono">{formatBalance(balances.STRK)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={cn(
              "backdrop-blur-xl border transition-all duration-300",
              theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={theme === "dark" ? "text-white" : ""}>
                  My Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : userData.assets.length === 0 ? (
                    <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                      No assets found
                    </p>
                  ) : (
                    userData.assets.map((asset: any) => (
                      <div
                        key={asset.id}
                        className={cn(
                          "flex justify-between items-center p-4 rounded-lg",
                          theme === "dark" ? "bg-white/5" : "bg-gray-50"
                        )}
                      >
                        <div>
                          <h4 className={theme === "dark" ? "text-white" : "text-gray-900"}>
                            {asset.name}
                          </h4>
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                            {asset.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${asset.value}</p>
                          <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                            ROI: {asset.roi}%
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;