import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import WalletDropdown from "./WalletDropdown";
import MobileMenuItems from "./MobileMenuItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-[calc(100vw-32px)] mt-2 p-4 bg-white/95 backdrop-blur-md border-none shadow-lg"
          align="end"
        >
          <div className="flex flex-col space-y-4">
            <MobileMenuItems items={navigation} onClick={handleClose} />
            <div className="pt-2 border-t border-gray-200">
              <WalletDropdown
                address={address}
                handleGoogleSignIn={handleGoogleSignIn}
                handleConnectWallet={handleConnectWallet}
                handleDisconnect={handleDisconnect}
                className="w-full"
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;