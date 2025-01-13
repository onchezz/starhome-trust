import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationLinks from "./NavigationLinks";
import WalletDropdown from "./WalletDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileMenuProps {
  navigation: Array<{ label: string; href: string; isPage?: boolean }>;
  address: string | undefined;
  handleGoogleSignIn: () => void;
  handleConnectWallet: () => void;
  handleDisconnect: () => void;
}

const MobileMenu = ({
  navigation,
  address,
  handleGoogleSignIn,
  handleConnectWallet,
  handleDisconnect,
}: MobileMenuProps) => {
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[calc(100vw-32px)] mt-2 p-4 bg-white/95 backdrop-blur-md border-none shadow-lg"
          align="end"
        >
          <div className="flex flex-col space-y-4">
            <div className="text-xl mb-2">
              Home
            </div>
            <NavigationLinks
              items={navigation}
              className="text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200 px-3 py-2 rounded-md block"
            />
            <WalletDropdown
              address={address}
              handleGoogleSignIn={handleGoogleSignIn}
              handleConnectWallet={handleConnectWallet}
              handleDisconnect={handleDisconnect}
              className="w-full"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;