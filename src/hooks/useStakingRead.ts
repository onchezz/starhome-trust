import { useStarHomeReadContract } from "./contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";

export const useStakingRead = () => {
  const { address } = useAccount();
  
  const { data: rewards, isLoading: isLoadingRewards, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [address],
  });

  return {
    rewards,
    isLoadingRewards,
    error,
  };
};