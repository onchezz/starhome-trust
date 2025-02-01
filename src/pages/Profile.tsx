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
import { UserInvestments } from "@/components/profile/UserInvestments";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

const Profile = () => {
  const { theme } = useTheme();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const { balances, isLoading: isLoadingBal } = useTokenBalances();
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ProfileSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div
            className={cn(
              "container mx-auto transition-colors duration-300",
              theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <section id="overview">
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
              </section>

              <section id="wallet">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ProfileWallet
                    address={address || ""}
                    balances={balances}
                    isLoadingBal={isLoadingBal}
                  />
                </motion.div>
              </section>

              <section id="investments">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <UserInvestments />
                </motion.div>
              </section>

              {user?.is_agent && (
                <section id="properties">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <AgentProperties />
                  </motion.div>
                </section>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;