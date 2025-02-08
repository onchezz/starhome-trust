import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ProfileShimmer = () => {
  const { address } = useAccount();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // if (!address) {
  //   toast.error("Wallet disconnected. Redirecting to home page...");
  //   navigate("/");
  // }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 px-2 sm:px-4 md:px-6",
        theme === "dark" ? "bg-[#1A1F2C]" : "bg-gray-50"
      )}
    >
      <div className="container mx-auto py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Card
            className={cn(
              "backdrop-blur-xl border transition-all duration-300",
              theme === "dark" ? "bg-black/40 border-white/10" : "bg-white"
            )}
          >
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
