import { useScaffoldWriteContract } from '../contract_hooks/useStarHomesWriteContract';
import { toast } from 'sonner';

export const useStakingWrite = () => {
  const { writeAsync: stake, isPending: isStakePending } = useScaffoldWriteContract({
    contractName: "StarhomesContract",
    functionName: "invest_in_property",
    args: ["0", "0"], // Default args, will be replaced when calling
  });

  const handleStake = async (propertyId: string, amount: bigint) => {
    try {
      console.log("Staking:", { propertyId, amount });
      await stake({ args: [propertyId, amount] });
      toast.success("Investment successful!");
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Investment failed. Please try again.");
      throw error;
    }
  };

  const withdraw = async (propertyId: string, amount: bigint) => {
    // TODO: Implement withdraw functionality
    console.log("Withdraw:", { propertyId, amount });
  };

  const claimRewards = async (propertyId: string) => {
    // TODO: Implement claim rewards functionality
    console.log("Claim rewards:", { propertyId });
  };

  return {
    handleStake,
    withdraw,
    claimRewards,
    isStakePending,
    loading: isStakePending
  };
};