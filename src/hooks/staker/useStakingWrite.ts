import { useScaffoldWriteContract } from '../contract_hooks/useStarHomesWriteContract';
import { toast } from 'sonner';

export const useStakingWrite = () => {
  const { sendAsync: stake, isPending } = useScaffoldWriteContract({
    contractName: "StarhomesContract",
    functionName: "invest_in_property",
    args: [],
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

  return {
    handleStake,
    isStakePending: isPending,
  };
};