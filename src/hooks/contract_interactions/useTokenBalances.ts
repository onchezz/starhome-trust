import { useCallback, useEffect } from "react";
import { useBalance, useAccount } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import {
  universalEthAddress,
  universalStrkAddress,
  usdcTokenAddress,
  usdTTokenAddress,
} from "@/utils/constants";
import { CACHE_KEYS, getLocalCache, setLocalCache } from "@/utils/cacheUtils";

export const tokenAddresses = {
  USDT: usdTTokenAddress,
  USDC: usdcTokenAddress,
  STRK: universalStrkAddress,
  ETH: universalEthAddress,
} as const;

interface TokenBalance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: string;
}

interface CachedBalances {
  USDT: TokenBalance | null;
  USDC: TokenBalance | null;
  STRK: TokenBalance | null;
  ETH: TokenBalance | null;
}

export function useTokenBalances() {
  const { address } = useAccount();

  const fetchBalances = useCallback(async () => {
    if (!address) return null;
    
    const cachedData = getLocalCache(`balances_${address}`);
    if (cachedData) {
      console.log('Using cached balance data for:', address);
      return cachedData;
    }

    // Fetch fresh data if no cache
    const balances = await Promise.all([
      fetch(`${rpcProvideUr}/balance/${address}/${tokenAddresses.USDT}`),
      fetch(`${rpcProvideUr}/balance/${address}/${tokenAddresses.USDC}`),
      fetch(`${rpcProvideUr}/balance/${address}/${tokenAddresses.STRK}`),
      fetch(`${rpcProvideUr}/balance/${address}/${tokenAddresses.ETH}`),
    ]);

    const data = {
      USDT: await balances[0].json(),
      USDC: await balances[1].json(),
      STRK: await balances[2].json(),
      ETH: await balances[3].json(),
    };

    setLocalCache(`balances_${address}`, data);
    return data;
  }, [address]);

  const { data: balances, isLoading, refetch } = useQuery({
    queryKey: [...CACHE_KEYS.USER_BALANCE(address || ''), 'balances'],
    queryFn: fetchBalances,
    enabled: !!address,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    balances: balances || {
      USDT: null,
      USDC: null,
      STRK: null,
      ETH: null,
    },
    isLoading,
    refresh: refetch,
  };
}