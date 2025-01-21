import useEthBalance from '../contract_hooks/useEthBalance';
import useStrkBalance from '../contract_hooks/useStrkBalance';
import { useAccount } from '@starknet-react/core';

export const useTokenBalances = () => {
  const { address } = useAccount();
  const { data: ethBalance } = useEthBalance({ address });
  const { data: strkBalance } = useStrkBalance({ address });

  console.log("Token balances:", { eth: ethBalance, strk: strkBalance });

  return {
    ethBalance,
    strkBalance,
  };
};