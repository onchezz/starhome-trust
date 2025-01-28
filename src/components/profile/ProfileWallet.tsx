import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ProfileWalletProps {
  address: string;
  balances: any;
  isLoadingBal: boolean;
}

export function ProfileWallet({ address, balances, isLoadingBal }: ProfileWalletProps) {
  const { theme } = useTheme();
  
  return (
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
        <div className={cn(
          "p-3 sm:p-4 rounded-lg mb-4",
          theme === "dark" ? "bg-white/5" : "bg-gray-50"
        )}>
          <label className={cn(
            "text-xs sm:text-sm font-medium",
            theme === "dark" ? "text-gray-300" : "text-gray-500"
          )}>
            Wallet Address
          </label>
          <p className="text-xs sm:text-sm font-mono break-all mt-1">{address}</p>
        </div>

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
  );
}