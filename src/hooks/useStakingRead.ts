import { useStarHomeReadContract } from "./contract_hooks/useStarHomeReadContract";

export const useStakingRead = () => {
  const { data: rewards, isLoading: isLoadingRewards, error } = useStarHomeReadContract({
    functionName: "get_rewards",
    args: [],
  });

  return {
    rewards,
    isLoadingRewards,
    error,
  };
};