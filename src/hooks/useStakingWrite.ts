import { useStarHomeWriteContract } from "./contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";

export const useStakingWrite = () => {
  const { sendAsync: stakeAsync, isPending: isStakePending } = useStarHomeWriteContract({
    functionName: "stake",
  });

  const { sendAsync: withdrawAsync, isPending: isWithdrawPending } = useStarHomeWriteContract({
    functionName: "withdraw",
  });

  const { sendAsync: claimRewardsAsync, isPending: isClaimPending } = useStarHomeWriteContract({
    functionName: "claim_rewards",
  });

  const stake = async (amount: bigint) => {
    try {
      await stakeAsync({ args: [amount] });
      toast.success("Successfully staked tokens");
    } catch (error) {
      console.error("Stake error:", error);
      toast.error("Failed to stake tokens");
      throw error;
    }
  };

  const withdraw = async (amount: bigint) => {
    try {
      await withdrawAsync({ args: [amount] });
      toast.success("Successfully withdrawn tokens");
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error("Failed to withdraw tokens");
      throw error;
    }
  };

  const claimRewards = async () => {
    try {
      await claimRewardsAsync({ args: [] });
      toast.success("Successfully claimed rewards");
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
    loading: isStakePending || isWithdrawPending || isClaimPending,
  };
};