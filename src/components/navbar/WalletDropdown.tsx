import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletActions from "../WalletActions";

interface WalletDropdownProps {
  address: string | undefined;
  handleGoogleSignIn: () => void;
  handleConnectWallet: () => void;
  handleDisconnect: () => void;
  className?: string;
}

const WalletDropdown = ({
  address,
  handleGoogleSignIn,
  handleConnectWallet,
  handleDisconnect,
  className,
}: WalletDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className}>Invest</Button>
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
  );
};

export default WalletDropdown;