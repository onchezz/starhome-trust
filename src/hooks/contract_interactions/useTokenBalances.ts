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

const CACHE_DURATION = 30000; // 30 seconds
const CACHE_KEY = 'token_balances';

interface SerializedBalance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: string; // BigInt as string
}

interface CachedBalances {
  USDT: SerializedBalance | null;
  USDC: SerializedBalance | null;
  STRK: SerializedBalance | null;
  ETH: SerializedBalance | null;
}

export function useTokenBalances() {
  const { address } = useAccount();
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [cachedBalances, setCachedBalances] = useState<CachedBalances>({
    USDT: null,
    USDC:null,
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
    data: usdcBalance, 
    isLoading: isLoadingUsdc,
    refetch: refetchUsdc
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

  const serializeBalance = (balance: any): SerializedBalance | null => {
    if (!balance) return null;
    return {
      decimals: balance.decimals,
      formatted: balance.formatted,
      symbol: balance.symbol,
      value: balance.value.toString(), // Convert BigInt to string
    };
  };

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { balances, timestamp } = JSON.parse(cached);
        setCachedBalances(balances);
        setLastFetchTime(timestamp);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
  }, []);

  const saveToCache = useCallback((balances: CachedBalances) => {
    try {
      const cacheData = {
        balances,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, []);

  useEffect(() => {
    if (address) {
      loadFromCache();
    }
  }, [address, loadFromCache]);

  useEffect(() => {
    if (usdtBalance || strkBalance || ethBalance) {
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
  }, [usdtBalance,usdcBalance, strkBalance, ethBalance, saveToCache]);

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
    balances: {
      USDT:cachedBalances.USDT|| usdtBalance ,
      USDC:  cachedBalances.USDC||usdtBalance ,
      STRK: cachedBalances.STRK||strkBalance ,
      ETH: cachedBalances.ETH||ethBalance ,
    },
    isLoading: isLoadingUsdt ||  isLoadingUsdc ||isLoadingStrk || isLoadingEth,
    refresh: forceRefresh
  };
}