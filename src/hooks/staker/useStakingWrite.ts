import { useScaffoldWriteContract } from '../contract_hooks/useStarHomesWriteContract';
import { toast } from 'sonner';
import { BigNumberish } from 'starknet';

export const useStakingWrite = () => {
  const { writeAsync: investAsync, isPending: isStakePending } = useScaffoldWriteContract({
    contractName: "StarhomesContract",
    functionName: "invest_in_property",
  });

  const handleStake = async (propertyId: string, amount: BigNumberish) => {
    try {
      console.log("Staking:", { propertyId, amount });
      await investAsync({ args: [propertyId, amount] });
      toast.success("Investment successful!");
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Investment failed. Please try again.");
      throw error;
    }
  };

  const withdraw = async (propertyId: string, amount: BigNumberish) => {
    console.log("Withdraw:", { propertyId, amount });
    // TODO: Implement withdraw functionality
  };

  const claimRewards = async (propertyId: string) => {
    console.log("Claim rewards:", { propertyId });
    // TODO: Implement claim rewards functionality
  };

  return {
    handleStake,
    withdraw,
    claimRewards,
    isStakePending,
    loading: isStakePending
  };
};