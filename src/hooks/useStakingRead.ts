import { useStarHomeReadContract } from './contract_hooks/useStarHomeReadContract';

export const useStakingRead = () => {
  const { data: rewards, isLoading: isLoadingRewards } = useStarHomeReadContract({
    functionName: 'get_staking_rewards',
    args: [],
  });

  return {
    rewards,
    isLoadingRewards,
  };
};