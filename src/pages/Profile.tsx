import { useAccount } from "@starknet-react/core";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileShimmer } from "@/components/profile/ProfileShimmer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileWallet } from "@/components/profile/ProfileWallet";
import { ContactDetails } from "@/components/profile/ContactDetails";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";
import { useState, useEffect } from "react";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const { handleEditUser, contractStatus } = useUserWrite();
  const {
    user,
    isLoading: isLoadingUser,
    error,
  } = useUserReadByAddress(address || "");

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleUpdateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      await handleEditUser({ ...user, ...data });
      setIsRefreshing(true);
    } catch (error) {
      console.error("Error updating user:", error);
    }
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
            "backdrop-blur-xl border transition-all duration-300 mb-6",
            theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
          )}>
            <div className="p-6">
              <ProfileHeader user={user} />
              <ProfileActions user={user} isLoading={isLoadingUser} />
            </div>
          </Card>

          <ContactDetails 
            user={user} 
            onUpdate={handleUpdateUser}
            isLoading={contractStatus.isPending}
          />

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
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;