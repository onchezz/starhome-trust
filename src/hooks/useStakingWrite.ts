import { useStarHomeWriteContract } from './contract_hooks/useStarHomeWriteContract';

export const useStakingWrite = () => {
  const { write: stake, loading: stakeLoading } = useStarHomeWriteContract({
    functionName: 'stake',
  });

  const { write: withdraw, loading: withdrawLoading } = useStarHomeWriteContract({
    functionName: 'withdraw',
  });

  const { write: claimRewards, loading: claimLoading } = useStarHomeWriteContract({
    functionName: 'claim_rewards',
  });

  return {
    stake,
    withdraw,
    claimRewards,
    loading: stakeLoading || withdrawLoading || claimLoading,
  };
};