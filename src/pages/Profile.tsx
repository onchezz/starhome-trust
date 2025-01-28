import { useAccount } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Loader2 } from "lucide-react";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ProfileActions } from "@/components/profile/ProfileActions";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const {
    user,
    isLoading: isLoadingUser,
    error,
  } = useUserReadByAddress(address || "");

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 text-red-500 flex justify-center items-center min-h-screen text-sm sm:text-base">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 px-2 sm:px-4 md:px-6",
      theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
    )}>
      <div className="container mx-auto py-12 sm:py-16 md:py-24">
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
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className={cn(
                  "text-lg sm:text-xl md:text-2xl",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  Profile Details
                </span>
                <div className="flex flex-wrap gap-2">
                  {user?.is_verified && (
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {user?.is_investor && (
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      <Wallet className="w-3 h-3 mr-1" />
                      Investor
                    </Badge>
                  )}
                  {user?.is_agent && (
                    <Badge className="text-xs sm:text-sm">
                      <Building2 className="w-3 h-3 mr-1" />
                      Agent
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6 sm:space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-start gap-4"
                >
                  <img
                    src={user?.profile_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"}
                    alt="Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h3 className={cn(
                      "text-base sm:text-lg md:text-xl font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>{user?.name || "Not Registered"}</h3>
                    <p className={cn(
                      "text-sm sm:text-base",
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    )}>{user?.email || "No email provided"}</p>
                    <p className={cn(
                      "text-sm sm:text-base",
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    )}>{user?.phone || "No phone provided"}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "p-3 sm:p-4 rounded-lg",
                    theme === "dark" ? "bg-white/5" : "bg-gray-50"
                  )}
                >
                  <label className={cn(
                    "text-xs sm:text-sm font-medium",
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  )}>
                    Wallet Address
                  </label>
                  <p className="text-xs sm:text-sm font-mono break-all mt-1">{address}</p>
                </motion.div>

                <ProfileActions user={user} isLoading={isLoadingUser} />
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
                      <span className="font-mono">{Number(balances?.ETH?.formatted || 0).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === "dark" ? "text-gray-300" : ""}>USDT</span>
                      <span className="font-mono">{Number(balances?.USDT?.formatted || 0).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme === "dark" ? "text-gray-300" : ""}>STRK</span>
                      <span className="font-mono">{Number(balances?.STRK?.formatted || 0).toFixed(4)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;