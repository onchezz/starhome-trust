import useEthBalance from '../contract_hooks/useEthBalance';
import useStrkBalance from '../contract_hooks/useStrkBalance';
import { useAccount } from '@starknet-react/core';
import { formatUnits } from 'ethers';

export const useTokenBalances = () => {
  const { address } = useAccount();
  const ethBalance = useEthBalance({ address });
  const strkBalance = useStrkBalance({ address });

  console.log("Token balances:", { eth: ethBalance, strk: strkBalance });

  const balances = {
    ETH: {
      formatted: ethBalance?.formatted || "0",
      value: ethBalance?.value || 0n
    },
    USDT: {
      formatted: "0",
      value: 0n
    },
    STRK: {
      formatted: strkBalance?.formatted || "0",
      value: strkBalance?.value || 0n
    }
  };

  return {
    balances,
    isLoading: ethBalance?.isLoading || strkBalance?.isLoading
  };
};