import { useContract, useReadContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { Contract } from "starknet";
import abi from "../data/abi";
import { toast } from "sonner";

// Contract address for the staking contract
export const STAKING_CONTRACT_ADDRESS = "0x06711323c3dae0c666a108be21ded892463c1abe08ed77157ff19fb343de7800";

export function useStakingContract() {
  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi
  });

  const { address } = useAccount();

  // Read Operations
  const { data: rewards, isPending: isLoadingRewards } = useReadContract({
    functionName: "get_rewards",
    args: address ? [address] : undefined,
    address: STAKING_CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
  });

  // Write Operations
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
        contract.populate("stake", [amount])
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
        contract.populate("withdraw", [amount])
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
        contract.populate("claim_rewards", [])
      ]);
      toast.success("Claim rewards transaction sent successfully");
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Failed to claim rewards");
      throw error;
    }
  };

  return {
    // Contract instance
    contract,
    
    // Read operations
    rewards,
    isLoadingRewards,
    
    // Write operations
    handleStake,
    withdraw,
    claimRewards,
    
    // Loading states
    isStakePending,
    isWithdrawPending,
    isClaimRewardsPending,
    
    // Combined loading state
    loading: isStakePending || isWithdrawPending || isClaimRewardsPending || isLoadingRewards
  };
}