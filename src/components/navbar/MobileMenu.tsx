import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavigationLinks from "./NavigationLinks";
import WalletDropdown from "./WalletDropdown";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

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
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="drawer-content">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#33C3F0] bg-clip-text text-transparent">
              StarHomes
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 py-4 flex flex-col space-y-4">
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
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileMenu;