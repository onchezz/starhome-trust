import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import WalletActions from "./WalletActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[]
  });

  const handleGoogleSignIn = () => {
    if (address) {
      console.log("Adding Google account");
      toast.success("Google account added successfully");
    } else {
      console.log("Signing in with Google");
      toast.success("Signed in with Google successfully");
    }
  };

  const handleConnectWallet = async () => {
    try {
      console.log("Connecting StarkNet wallet");
      const { connector } = await starknetkitConnectModal();
      
      if (!connector) {
        console.log("No connector selected");
        return;
      }

      await connect({ connector });
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigation = [
    { label: "Home", href: "/", isPage: true },
    { label: "Properties", href: "/properties", isPage: true },
    { label: "Contact Us", href: "/#contact" },
    { label: "About Us", href: "/#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            StarHomes
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Invest</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleGoogleSignIn}>
                  {address ? "Add Google Account" : "Sign in with Google"}
                </DropdownMenuItem>
                {!address ? (
                  <DropdownMenuItem onClick={handleConnectWallet}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </DropdownMenuItem>
                ) : (
                  <>
                    <div className="p-2 text-sm text-gray-500">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                    <div className="p-2">
                      <WalletActions />
                    </div>
                    <DropdownMenuItem onClick={handleDisconnect}>
                      Disconnect
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">Invest</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleGoogleSignIn}>
                    {address ? "Add Google Account" : "Sign in with Google"}
                  </DropdownMenuItem>
                  {!address ? (
                    <DropdownMenuItem onClick={handleConnectWallet}>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <div className="p-2 text-sm text-gray-500">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </div>
                      <div className="p-2">
                        <WalletActions />
                      </div>
                      <DropdownMenuItem onClick={handleDisconnect}>
                        Disconnect
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;