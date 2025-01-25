import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationLinks from "./NavigationLinks";
import WalletDropdown from "./WalletDropdown";
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
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <NavigationLinks
            items={navigation}
            className="block px-2 py-1 text-lg"
          />
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
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import NavigationLinks from "./NavigationLinks";
// import WalletDropdown from "./WalletDropdown";

// interface MobileMenuProps {
//   navigation: Array<{ label: string; href: string; isPage?: boolean }>;
//   address: string | undefined;
//   handleConnectWallet: () => void;
//   handleDisconnect: () => void;
// }

// const MobileMenu = ({
//   navigation,
//   address,
//   handleConnectWallet,
//   handleDisconnect,
// }: MobileMenuProps) => {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           variant="ghost"
//           className="inline-flex items-center md:hidden"
//           size="icon"
//         >
//           <Menu className="h-6 w-6" />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="right" className="w-[300px] sm:w-[400px]">
//         <nav className="flex flex-col gap-4">
//           <NavigationLinks
//             items={navigation}
//             className="block px-2 py-1 text-lg"
//           />
//           <WalletDropdown
//             address={address}
//             handleConnectWallet={handleConnectWallet}
//             handleDisconnect={handleDisconnect}
//             className="w-full"
//           />
//         </nav>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default MobileMenu;
