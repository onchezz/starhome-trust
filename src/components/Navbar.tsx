import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Wallet, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useStarknetkitConnectModal } from "starknetkit";
import { useConnect, useAccount } from "@starknet-react/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { toast } = useToast();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({ connectors });

  const handleGoogleSignIn = () => {
    console.log("Signing in with Google");
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
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address?.slice(0, 6)}...${address?.slice(-4)}`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
      });
    }
  };

  const menuItems = [
    { label: "About Us", href: "/#about" },
    { label: "Properties", href: "/properties", isPage: true },
    { label: "Investment", href: "/investment", isPage: true },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            starhomes
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-navy hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-navy hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  {address ? (
                    <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                  ) : (
                    "Invest Now"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={handleConnectWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  {address ? "Connected" : "Connect Wallet"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGoogleSignIn}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                item.isPage ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-navy hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-navy hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full">
                    {address ? (
                      <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                    ) : (
                      "Invest Now"
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={handleConnectWallet}>
                    <Wallet className="mr-2 h-4 w-4" />
                    {address ? "Connected" : "Connect Wallet"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGoogleSignIn}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </DropdownMenuItem>
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