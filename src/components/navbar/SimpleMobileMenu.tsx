import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

interface NavigationItem {
  label: string;
  href: string;
  isPage?: boolean;
}

interface SimpleMobileMenuProps {
  navigation: NavigationItem[];
  onNavigate?: (item: NavigationItem) => void;
}

const SimpleMobileMenu = ({ navigation, onNavigate }: SimpleMobileMenuProps) => {
  const { address } = useAccount();
  const { user } = useUserReadByAddress(address || "");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

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
          {address && user && (
            <div className="p-4 space-y-4 border-b">
              <div className="flex items-center space-x-4">
                {user.profile_image && (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(user.phone)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground break-all">
                {address}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={() => handleCopy(address)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </p>
            </div>
          )}
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                )}
                onClick={() => {
                  if (onNavigate) onNavigate(item);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SimpleMobileMenu;