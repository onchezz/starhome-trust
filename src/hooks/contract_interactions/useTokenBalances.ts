import { useCallback, useEffect, useState } from "react";
import { useBalance, useAccount } from "@starknet-react/core";
import {
  universalEthAddress,
  universalStrkAddress,
  usdcTokenAddress,
  usdTTokenAddress,
} from "@/utils/constants";

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

const BALANCE_CACHE_KEY = 'token_balances_cache';

export function useTokenBalances() {
  const { address } = useAccount();
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [cachedBalances, setCachedBalances] = useState<CachedBalances>({
    USDT: null,
    USDC: null,
    STRK: null,
    ETH: null,
  });

  const shouldRefetch = useCallback(() => {
    return Date.now() - lastFetchTime > 30000; // 30 seconds
  }, [lastFetchTime]);

  const { 
    data: usdtBalance, 
    isLoading: isLoadingUsdt,
    refetch: refetchUsdt
  } = useBalance({
    address,
    token: tokenAddresses.USDT,
    watch: false,
    enabled: !!address && shouldRefetch(),
  });

  const { 
    data: usdcBalance, 
    isLoading: isLoadingUsdc,
    refetch: refetchUsdc
  } = useBalance({
    address,
    token: tokenAddresses.USDC,
    watch: false,
    enabled: !!address && shouldRefetch(),
  });

  const { 
    data: strkBalance, 
    isLoading: isLoadingStrk,
    refetch: refetchStrk
  } = useBalance({
    address,
    token: tokenAddresses.STRK,
    watch: false,
    enabled: !!address && shouldRefetch(),
  });

  const { 
    data: ethBalance, 
    isLoading: isLoadingEth,
    refetch: refetchEth
  } = useBalance({
    address,
    token: tokenAddresses.ETH,
    watch: true,
    enabled: !!address && shouldRefetch(),
  });

  const serializeBalance = (balance: any): TokenBalance | null => {
    if (!balance) return null;
    return {
      decimals: balance.decimals,
      formatted: balance.formatted,
      symbol: balance.symbol,
      value: balance.value.toString(),
    };
  };

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(BALANCE_CACHE_KEY);
    if (cached) {
      const { balances, timestamp } = JSON.parse(cached);
      setCachedBalances(balances);
      setLastFetchTime(timestamp);
    }
  }, []);

  const saveToCache = useCallback((balances: CachedBalances) => {
    const cacheData = {
      balances,
      timestamp: Date.now()
    };
    localStorage.setItem(BALANCE_CACHE_KEY, JSON.stringify(cacheData));
  }, []);

  useEffect(() => {
    if (address) {
      loadFromCache();
    }
  }, [address, loadFromCache]);

  useEffect(() => {
    if (usdtBalance || usdcBalance || strkBalance || ethBalance) {
      const newBalances = {
        USDT: serializeBalance(usdtBalance),
        USDC: serializeBalance(usdcBalance),
        STRK: serializeBalance(strkBalance),
        ETH: serializeBalance(ethBalance),
      };
      setCachedBalances(newBalances);
      setLastFetchTime(Date.now());
      saveToCache(newBalances);
    }
  }, [usdtBalance, usdcBalance, strkBalance, ethBalance, saveToCache]);

  const forceRefresh = async () => {
    if (address) {
      await Promise.all([
        refetchUsdt(),
        refetchUsdc(),
        refetchStrk(),
        refetchEth()
      ]);
    }
  };

  return {
    balances: {
      USDT: cachedBalances.USDT || usdtBalance,
      USDC: cachedBalances.USDC || usdcBalance,
      STRK: cachedBalances.STRK || strkBalance,
      ETH: cachedBalances.ETH || ethBalance,
    },
    isLoading: isLoadingUsdt || isLoadingUsdc || isLoadingStrk || isLoadingEth,
    refresh: forceRefresh
  };
}