import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useStakingRead } from "../hooks/staker/useStakingRead";
import { useStakingWrite } from "../hooks/staker/useStakingWrite";

export function StakingInterface() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { rewards, isLoadingRewards } = useStakingRead();
  const { handleStake, withdraw, claimRewards, loading } = useStakingWrite();

  const handleStakeSubmit = async () => {
    try {
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      await handleStake("1", bigIntAmount); // Using "1" as default propertyId
      setAmount("");
    } catch (err) {
      console.error("Stake error:", err);
    }
  };

  const handleWithdraw = async () => {
    try {
      const bigIntAmount = BigInt(Number(amount) * 10 ** 18);
      await withdraw("1", bigIntAmount);
      setAmount("");
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards("1");
    } catch (err) {
      console.error("Claim rewards error:", err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Staking Interface</h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Your Current Rewards</p>
          <p className="text-lg font-bold">
            {isLoadingRewards ? "Loading..." : `${rewards || "0"} tokens`}
          </p>
        </div>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full"
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleStakeSubmit}
            disabled={loading || !amount || !address}
          >
            {loading ? "Processing..." : "Stake"}
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={loading || !amount || !address}
            variant="outline"
          >
            {loading ? "Processing..." : "Withdraw"}
          </Button>
        </div>

        <Button
          onClick={handleClaimRewards}
          disabled={loading || !address || !rewards}
          variant="secondary"
          className="w-full"
        >
          {loading ? "Processing..." : "Claim Rewards"}
        </Button>

        {!address && (
          <p className="text-sm text-red-500">
            Please connect your wallet to interact with the staking contract.
          </p>
        )}
      </div>
    </div>
  );
}