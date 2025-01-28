import { Link, useLocation } from "react-router-dom";
import { useStarknetkitConnectModal, StarknetkitConnector } from "starknetkit";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import { toast } from "sonner";
import NavigationLinks from "./navbar/NavigationLinks";
import WalletDropdown from "./navbar/WalletDropdown";
import SimpleMobileMenu from "./navbar/SimpleMobileMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";
import { Home } from "lucide-react";

const navigation = [
  { label: "Home", href: "/", isPage: true },
  { label: "Properties", href: "/properties", isPage: true },
  { label: "Investment", href: "/investment", isPage: true },
  { label: "Blogs", href: "/blogs", isPage: true },
  { label: "Contact Us", href: "/#contact" },
  { label: "About Us", href: "/#about" },
];

const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const location = useLocation();

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
  });

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleNavigation = (item) => {
    if (item.href.startsWith("/#")) {
      const sectionId = item.href.substring(2);
      handleScroll(sectionId);
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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
      <div className="max-w-[2520px] mx-auto">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#33C3F0] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              StarHomes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationLinks
              items={navigation}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors px-3 py-1 rounded-md"
              onNavigate={handleNavigation}
            />
            <ThemeToggle />
            <WalletDropdown
              address={address}
              handleConnectWallet={handleConnectWallet}
              handleDisconnect={handleDisconnect}
            />
          </div>

          {/* Mobile Menu */}
          <SimpleMobileMenu
            navigation={navigation}
            onNavigate={handleNavigation}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;