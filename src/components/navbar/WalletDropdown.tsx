import { Button } from "@/components/ui/button";
import { Wallet, Check, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletActions from "../WalletActions";
// import { useTokenBalances } from "@/hooks/staker/useTokenBalances";
import { Link } from "react-router-dom";

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
  // const { balances, isLoading } = useTokenBalances();
  //  const { balances, isLoading } = useStrkBalance();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${className} ${
            !address ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90" : ""
          }`}
          variant={address ? "default" : "outline"}
          style={{ backgroundColor: address ? "#0066FF" : undefined }}
        >
          {address ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Disconnect
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Invest
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleGoogleSignIn}>
          {address ? "Add Google Account" : "Sign in with Google"}
        </DropdownMenuItem>
        {address && (
          <DropdownMenuItem asChild>
            <Link to="/add-property" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </DropdownMenuItem>
        )}
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
            {/* {isLoading ? (
              <div className="p-2 text-sm">Loading balances...</div>
            ) : (
              <div className="p-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ETH</span>
                  <span>{balances.ETH?.formatted || "0"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>USDT</span>
                  <span>{balances.USDT?.formatted || "0"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>STRK</span>
                  <span>{balances.STRK?.formatted || "0"}</span>
                </div>
              </div>
            )} */}
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
