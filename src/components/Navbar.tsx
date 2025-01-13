import { useState } from "react";
import { Link } from "react-router-dom";
import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { toast } from "sonner";
import NavigationLinks from "./navbar/NavigationLinks";
import WalletDropdown from "./navbar/WalletDropdown";
import MobileMenu from "./navbar/MobileMenu";

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
    { label: "Properties", href: "/properties", isPage: true },
    { label: "Investment", href: "/investment", isPage: true },
    { label: "Blogs", href: "/blogs", isPage: true },
    { label: "Contact Us", href: "/#contact" },
    { label: "About Us", href: "/#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#33C3F0] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            StarHomes
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationLinks
              items={navigation}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            />
            <WalletDropdown
              address={address}
              handleGoogleSignIn={handleGoogleSignIn}
              handleConnectWallet={handleConnectWallet}
              handleDisconnect={handleDisconnect}
            />
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isOpen}
            toggleMenu={toggleMenu}
            navigation={navigation}
            address={address}
            handleGoogleSignIn={handleGoogleSignIn}
            handleConnectWallet={handleConnectWallet}
            handleDisconnect={handleDisconnect}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;