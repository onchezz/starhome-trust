import { useCallback, useEffect, useState } from "react";
import { useBalance, useAccount } from "@starknet-react/core";
import {
  universalEthAddress,
  universalStrkAddress,
  usdTTokenAddress,
} from "@/utils/constants";

export const tokenAddresses = {
  USDT: usdTTokenAddress,
  STRK: universalStrkAddress,
  ETH: universalEthAddress,
} as const;

const CACHE_DURATION = 30000; // 30 seconds
const CACHE_KEY = 'token_balances';

export function useTokenBalances() {
  const { address } = useAccount();
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [cachedBalances, setCachedBalances] = useState({
    USDT: null,
    STRK: null,
    ETH: null,
  });

  const shouldRefetch = useCallback(() => {
    return Date.now() - lastFetchTime > CACHE_DURATION;
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
    watch: false,
    enabled: !!address && shouldRefetch(),
  });

  const loadFromCache = useCallback(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { balances, timestamp } = JSON.parse(cached);
      setCachedBalances(balances);
      setLastFetchTime(timestamp);
    }
  }, []);

  const saveToCache = useCallback((balances: any) => {
    const cacheData = {
      balances,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  }, []);

  useEffect(() => {
    if (address) {
      loadFromCache();
    }
  }, [address, loadFromCache]);

  useEffect(() => {
    if (usdtBalance || strkBalance || ethBalance) {
      const newBalances = {
        USDT: usdtBalance,
        STRK: strkBalance,
        ETH: ethBalance,
      };
      setCachedBalances(newBalances);
      setLastFetchTime(Date.now());
      saveToCache(newBalances);
    }
  }, [usdtBalance, strkBalance, ethBalance, saveToCache]);

  const forceRefresh = async () => {
    if (address) {
      await Promise.all([
        refetchUsdt(),
        refetchStrk(),
        refetchEth()
      ]);
    }
  };

  return {
    balances: cachedBalances,
    isLoading: isLoadingUsdt || isLoadingStrk || isLoadingEth,
    refresh: forceRefresh
  };
}