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
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { Card } from "./ui/card";

const WalletActions = () => {
  const { address } = useAccount();
  const { balances, isLoading } = useTokenBalances();
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapToken, setSwapToken] = useState("ETH");

  const formatBalance = (balance: any) => {
    if (!balance) return "0.0000";
    return Number(balance.formatted).toFixed(4);
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

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Wallet className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Balances</DialogTitle>
            <DialogDescription>Your current token balances</DialogDescription>
          </DialogHeader>
          <Card className="p-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading balances...</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>ETH</span>
                  <span className="font-mono">{formatBalance(balances.ETH)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>USDT</span>
                  <span className="font-mono">{formatBalance(balances.USDT)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>STRK</span>
                  <span className="font-mono">{formatBalance(balances.STRK)}</span>
                </div>
              </div>
            )}
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Tokens</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label>Recipient Address</Label>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <Button onClick={handleSend} className="w-full">
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Address QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <QRCodeSVG value={address} size={200} />
          </div>
          <p className="text-center text-sm text-gray-500 break-all">{address}</p>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Repeat className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Swap Tokens</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label>Token</Label>
              <select
                className="w-full border rounded-md p-2"
                value={swapToken}
                onChange={(e) => setSwapToken(e.target.value)}
              >
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <Button onClick={handleSwap} className="w-full">
              Swap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletActions;
