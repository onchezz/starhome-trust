import { useState } from "react";
import { Send, QrCode, Repeat, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@starknet-react/core";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { useTokenBalances } from "@/hooks/contract_interactions/useTokenBalances";
import { Card } from "./ui/card";
import { Shimmer } from "./ui/shimmer";
import { motion } from "framer-motion";

const WalletActions = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapToken, setSwapToken] = useState("ETH");

  // const formatBalance = (balance: any) => {
  //   if (!balance) return "0.0000";
  //   return Number(balance.formatted).toFixed(4);
  // };
  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";

    // Convert to number and fix to 4 decimal places
    const numberValue = Number(balance.formatted);
    const withDecimals = numberValue.toFixed(4);

    // Split number into integer and decimal parts
    const [integerPart, decimalPart] = withDecimals.split(".");

    // Add thousand separators to integer part
    const formattedInteger = parseInt(integerPart).toLocaleString("en-US");

    // Combine back with decimal part
    return `${formattedInteger}.${decimalPart}`;
  };

  const handleSend = () => {
    console.log("Sending", sendAmount, "to", recipientAddress);
    toast.success("Transaction initiated");
  };

  const handleSwap = () => {
    console.log("Swapping", swapAmount, swapToken);
    toast.success("Swap initiated");
  };

  if (!address) return null;

  const BalanceItem = ({
    label,
    value,
    isLoading,
  }: {
    label: string;
    value: string;
    isLoading: boolean;
  }) => (
    <div className="flex justify-between items-center p-2">
      <span className="text-sm sm:text-base">{label}</span>
      {isLoading ? (
        <Shimmer className="h-5 sm:h-6 w-20 sm:w-24 rounded-md" />
      ) : (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm sm:text-base"
        >
          {value}
        </motion.span>
      )}
    </div>
  );

  return (
    <div className="flex justify-around gap-1 sm:gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Wallet Balances
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Your current token balances
            </DialogDescription>
          </DialogHeader>
          <Card className="p-3 sm:p-4">
            <div className="space-y-2">
              <BalanceItem
                label="ETH"
                value={formatBalance(balances.ETH)}
                isLoading={isLoading}
              />
              <BalanceItem
                label="USDT"
                value={formatBalance(balances.USDT)}
                isLoading={isLoading}
              />
              <BalanceItem
                label="STRK"
                value={formatBalance(balances.STRK)}
                isLoading={isLoading}
              />
              <BalanceItem
                label="USDC"
                value={formatBalance(balances.USDC)}
                isLoading={isLoading}
              />
            </div>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Send Tokens
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm sm:text-base">Amount</Label>
              <Input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.0"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Label className="text-sm sm:text-base">Recipient Address</Label>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="text-sm sm:text-base"
              />
            </div>
            <Button
              onClick={handleSend}
              className="w-full text-sm sm:text-base"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Wallet Address QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-3 sm:p-4">
            <QRCodeSVG value={address} size={200} />
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-500 break-all">
            {address}
          </p>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Repeat className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Swap Tokens
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm sm:text-base">Amount</Label>
              <Input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="0.0"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <Label className="text-sm sm:text-base">Token</Label>
              <select
                className="w-full border rounded-md p-2 text-sm sm:text-base"
                value={swapToken}
                onChange={(e) => setSwapToken(e.target.value)}
              >
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <Button
              onClick={handleSwap}
              className="w-full text-sm sm:text-base"
            >
              Swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletActions;
