import { useContract, useSendTransaction } from "@starknet-react/core";
import { STAKING_CONTRACT_ADDRESS } from "./useStakingContract";
import abi from "../data/abi";
import { toast } from "sonner";
import { Uint256 } from "starknet";

export function useStakingWrite() {
  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi
  });

  const { send: sendStake, isPending: isStakePending } = useSendTransaction({
    calls: contract ? [] : undefined
  });

  const { send: sendWithdraw, isPending: isWithdrawPending } = useSendTransaction({
    calls: contract ? [] : undefined
  });

  const { send: sendClaimRewards, isPending: isClaimRewardsPending } = useSendTransaction({
    calls: contract ? [] : undefined
  });

  const stake = async (propertyId: string, amount: bigint) => {
    console.log("Staking amount:", amount, "for property:", propertyId);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendStake([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "invest_in_property",
        calldata: [propertyId, amount]
      }]);
      toast.success("Stake transaction sent successfully");
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Failed to stake tokens");
      throw error;
    }
  };

  const withdraw = async (propertyId: string, amount: bigint, tokenAddress: string) => {
    console.log("Withdrawing amount:", amount);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendWithdraw([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "list_property_for_investment",
        calldata: [propertyId, amount, tokenAddress]
      }]);
      toast.success("Withdrawal transaction sent successfully");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw tokens");
      throw error;
    }
  };

  const claimRewards = async (propertyId: string) => {
    console.log("Claiming rewards for property:", propertyId);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendClaimRewards([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "get_property",
        calldata: [propertyId]
      }]);
      toast.success("Claim rewards transaction sent successfully");
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Failed to claim rewards");
      throw error;
    }
  };

  return {
    stake,
    withdraw,
    claimRewards,
    isStakePending,
    isWithdrawPending,
    isClaimRewardsPending,
    loading: isStakePending || isWithdrawPending || isClaimRewardsPending
  };
}