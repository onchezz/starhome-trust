import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Wallet } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  isPage?: boolean;
}

interface SimpleMobileMenuProps {
  navigation: NavigationItem[];
  onNavigate: (item: NavigationItem) => void;
  address?: string;
  handleConnectWallet: () => void;
  handleDisconnect: () => void;
}

const SimpleMobileMenu = ({
  navigation,
  onNavigate,
  address,
  handleConnectWallet,
  handleDisconnect,
}: SimpleMobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: NavigationItem) => {
    onNavigate(item);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden"
          size="icon"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <nav className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Menu</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.isPage ? item.href : "#"}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  "border-b border-gray-200 dark:border-gray-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="p-4 border-t space-y-4">
            <Button 
              className="w-full"
              onClick={address ? handleDisconnect : handleConnectWallet}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {address ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SimpleMobileMenu;