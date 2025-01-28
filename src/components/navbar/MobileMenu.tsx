import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationLinks from "./NavigationLinks";
import WalletDropdown from "./WalletDropdown";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { useAccount } from "@starknet-react/core";

interface NavigationItem {
  label: string;
  href: string;
  isPage?: boolean;
}

interface MobileMenuProps {
  navigation: NavigationItem[];
  address?: `0x${string}`;
  handleConnectWallet: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  onNavigate?: (item: NavigationItem) => void;
}

const MobileMenu = ({
  navigation,
  address,
  handleConnectWallet,
  handleDisconnect,
  onNavigate,
}: MobileMenuProps) => {
  const { balances } = useTokenBalances();
  const { address: userAddress } = useAccount();
  const { user } = useUserReadByAddress(userAddress || "");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center md:hidden"
          size="icon"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
        <nav className="flex flex-col gap-4">
          <div className="space-y-4">
            {address && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Wallet</p>
                <p className="text-xs text-muted-foreground break-all mb-4">
                  {address}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">ETH</span>
                    <span className="text-sm font-mono">
                      {Number(balances.ETH?.formatted || 0).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">USDT</span>
                    <span className="text-sm font-mono">
                      {Number(balances.USDT?.formatted || 0).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">STRK</span>
                    <span className="text-sm font-mono">
                      {Number(balances.STRK?.formatted || 0).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <NavigationLinks
              items={navigation}
              className="block px-2 py-1 text-lg"
              onNavigate={onNavigate}
            />
          </div>
          <WalletDropdown
            address={address}
            handleConnectWallet={handleConnectWallet}
            handleDisconnect={handleDisconnect}
            className="w-full"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;