import { Button } from "@/components/ui/button";
import { Wallet, Check, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WalletActions from "../WalletActions";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { Link } from "react-router-dom";
import ErrorBoundary from "../errrorBoundary";

interface WalletDropdownProps {
  address: string | undefined;
  handleConnectWallet: () => void;
  handleDisconnect: () => void;
  className?: string;
}

const WalletDropdown = ({
  address,
  handleConnectWallet,
  handleDisconnect,
  className,
}: WalletDropdownProps) => {
  const { balances, isLoading } = useTokenBalances();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${className} ${
            !address ? "bg-[#0066FF] text-white hover:bg-[#0066FF]/90" : ""
          }`}
          variant={address ? "default" : "outline"}
          style={{ backgroundColor: address ? "#0066FF" : undefined }}
          onClick={!address ? handleConnectWallet : undefined}
        >
          {address ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Wallet Connected
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Invest
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      {address && (
        <DropdownMenuContent className="w-56">
          <div className="p-2 text-sm text-gray-500">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Loading balances...</div>
          ) : (
            <div className="p-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>ETH</span>
                <span>{Number(balances.ETH?.formatted || 0).toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>USDT</span>
                <span>{Number(balances.USDT?.formatted || 0).toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>STRK</span>
                <span>{Number(balances.STRK?.formatted || 0).toFixed(4)}</span>
              </div>
            </div>
          )}
          <div className="p-2">
            <WalletActions />
          </div>
          <Link to="/profile">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
          </Link>
          {/* <Link to="/create-property">
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create Property
            </DropdownMenuItem>
          </Link> */}
          <DropdownMenuItem onClick={handleDisconnect}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default WalletDropdown;
