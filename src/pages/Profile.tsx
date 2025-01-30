import { useAccount, useDisconnect } from "@starknet-react/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { UserX } from "lucide-react";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { UserRegistrationModal } from "@/components/profile/UserRegistrationModal";
import { ProfileShimmer } from "@/components/profile/ProfileShimmer";
import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileWallet } from "@/components/profile/ProfileWallet";
import { AgentProperties } from "@/components/profile/AgentProperties";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { disconnect, error: disconnectError } = useDisconnect({});
  const navigate = useNavigate();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const {
    user,
    isLoading: isLoadingUser,
    error,
  } = useUserReadByAddress(address || "");

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!address) {
      toast.error("Wallet disconnected. Redirecting to home page...");
      navigate("/");
    }
  }, [address, navigate]);

  useEffect(() => {
    if (disconnectError) {
      console.error("Disconnect error:", disconnectError);
      toast.error("Error disconnecting wallet");
    }
  }, [disconnectError]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRefreshing) {
      intervalId = setInterval(() => {
        if (user && !isLoadingUser) {
          setIsRefreshing(false);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRefreshing, user, isLoadingUser]);

  const isUnregistered = (userData: any) => {
    return (
      !userData ||
      userData.name === "0" ||
      userData.name === 0 ||
      userData.name === "" ||
      userData.phone === "0" ||
      userData.phone === 0 ||
      userData.phone === "" ||
      userData.email === "0" ||
      userData.email === 0 ||
      userData.email === ""
    );
  };

  if (isLoadingUser || isRefreshing) {
    return <ProfileShimmer />;
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 text-red-500 flex justify-center items-center min-h-screen text-sm sm:text-base">
        Error: {error.message}
      </div>
    );
  }

  if (isUnregistered(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card
          className={cn(
            "max-w-md w-full backdrop-blur-xl border transition-all duration-300",
            theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
          )}
        >
          <CardHeader className="text-center">
            <UserX className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <CardTitle className="text-xl">Not Registered</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-500">
              You haven't registered your profile yet. Create an account to
              access all features.
            </p>
            <UserRegistrationModal />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 px-2 sm:px-4 md:px-6",
        theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
      )}
    >
      <div className="container mx-auto py-12 sm:py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card
            className={cn(
              "backdrop-blur-xl border transition-all duration-300",
              theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
            )}
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl md:text-2xl">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-6 sm:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ProfileHeader user={user} />
                </motion.div>

                <ProfileActions user={user} isLoading={isLoadingUser} />
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <ProfileWallet
              address={address || ""}
              balances={balances}
              isLoadingBal={isLoadingBal}
            />
          </motion.div>

          {user?.is_agent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6"
            >
              <AgentProperties />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;