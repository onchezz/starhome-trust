import { useStarHomeWriteContract } from './contract_hooks/useStarHomeWriteContract';

export const useStakingWrite = () => {
  const { sendAsync: stake, isPending: stakeLoading } = useStarHomeWriteContract({
    functionName: 'stake',
  });

  const { sendAsync: withdraw, isPending: withdrawLoading } = useStarHomeWriteContract({
    functionName: 'withdraw',
  });

  const { sendAsync: claimRewards, isPending: claimLoading } = useStarHomeWriteContract({
    functionName: 'claim_rewards',
  });

  return {
    stake: ({ args }: { args: any[] }) => stake({ args }),
    withdraw: ({ args }: { args: any[] }) => withdraw({ args }),
    claimRewards: ({ args }: { args: any[] }) => claimRewards({ args }),
    loading: stakeLoading || withdrawLoading || claimLoading,
  };
};