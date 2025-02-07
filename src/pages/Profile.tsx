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
import { AgentProperties } from "@/components/profile/AgentProperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { emptyUser } from "@/types/user";
import { UserRegistrationModal } from "@/components/profile/UserRegistrationModal";
import { UserX } from "lucide-react";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
  const { user, isLoading: isLoadingUser } = useUserReadByAddress(
    address || ""
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  console.log(`current user ${JSON.stringify(user)}`);
  if (isLoadingUser || isRefreshing) {
    return <ProfileShimmer />;
  }

   if (JSON.stringify(user) === JSON.stringify(emptyUser)) {
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


  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        // if (JSON.stringify(user) === JSON.stringify(emptyUser)) {
        //   return (
        //     <Card
        //       className={cn(
        //         "backdrop-blur-xl border transition-all duration-300 w-full",
        //         theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
        //       )}
        //     >
        //       <CardContent className="p-6 space-y-6">
        //         {/* <ProfileHeader user={user} /> */}
        //         <ProfileActions user={user} isLoading={isLoadingUser} />
        //       </CardContent>
        //     </Card>
        //   );
        // }
        return (
          <Card
            className={cn(
              "backdrop-blur-xl border transition-all duration-300 w-full",
              theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
            )}
          >
            <CardContent className="p-6 space-y-6">
              <ProfileHeader user={user} />
              <ProfileActions user={user} isLoading={isLoadingUser} />
            </CardContent>
          </Card>
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
      case "properties":
        return user?.is_agent ? <AgentProperties /> : null;
      // case "settings":
      //   return (
      //     <Card className={cn(
      //       "backdrop-blur-xl border transition-all duration-300",
      //       theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
      //     )}>
      //       <CardContent className="p-6">
      //         <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      //         <p className="text-muted-foreground">Settings coming soon...</p>
      //       </CardContent>
      //     </Card>
      //   );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 mt-16",
        theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
      )}
    >
      <div className="container mx-auto py-6">
        <div className="flex gap-6">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isAgent={user?.is_agent}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 w-full"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
