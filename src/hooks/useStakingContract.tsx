import { useContract, useReadContract, useSendTransaction, useAccount } from "@starknet-react/core";
import abi from "../data/abi";
import { toast } from "sonner";

export const STAKING_CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useStakingContract() {
  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi
  });

  const { address } = useAccount();

  const { data: rewards, isPending: isLoadingRewards } = useReadContract({
    functionName: "get_property",
    args: address ? [address] : undefined,
    address: STAKING_CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
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

  const handleStake = async (amount: bigint) => {
    console.log("Staking amount:", amount);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendStake([
        contract.populate("invest_in_property", [amount])
      ]);
      toast.success("Stake transaction sent successfully");
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Failed to stake tokens");
      throw error;
    }
  };

  const withdraw = async (amount: bigint) => {
    console.log("Withdrawing amount:", amount);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendWithdraw([
        contract.populate("list_property_for_investment", [amount])
      ]);
      toast.success("Withdrawal transaction sent successfully");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw tokens");
      throw error;
    }
  };

  const claimRewards = async () => {
    console.log("Claiming rewards");
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendClaimRewards([
        contract.populate("get_property", [])
      ]);
      toast.success("Claim rewards transaction sent successfully");
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Failed to claim rewards");
      throw error;
    }
  };

  return {
    contract,
    rewards,
    isLoadingRewards,
    handleStake,
    withdraw,
    claimRewards,
    isStakePending,
    isWithdrawPending,
    isClaimRewardsPending,
    loading: isStakePending || isWithdrawPending || isClaimRewardsPending || isLoadingRewards
  };
}