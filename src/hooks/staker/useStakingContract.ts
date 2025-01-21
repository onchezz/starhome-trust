import { useStakingWrite } from './useStakingWrite';

export const useStakingContract = () => {
  const { handleStake, isStakePending } = useStakingWrite();

  return {
    handleStake,
    isStakePending,
  };
};