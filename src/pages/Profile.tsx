import { useAccount } from "@starknet-react/core";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileWallet } from "@/components/profile/ProfileWallet";
import { UserInvestments } from "@/components/profile/UserInvestments";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileShimmer } from "@/components/profile/ProfileShimmer";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const { user, isLoading: isLoadingUser } = useUserReadByAddress(address || "");
  const [activeTab, setActiveTab] = useState("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isLoadingUser || isRefreshing) {
    return <ProfileShimmer />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfileHeader user={user} />
            <ProfileActions user={user} isLoading={isLoadingUser} />
          </div>
        );
      case "wallet":
        return (
          <ProfileWallet
            address={address || ""}
            balances={balances}
            isLoadingBal={isLoadingBal}
          />
        );
      case "investments":
        return <UserInvestments />;
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <p className="text-muted-foreground">Settings coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
      )}
    >
      <div className="container mx-auto py-6">
        <div className="flex gap-6">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;