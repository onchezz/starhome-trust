import { useQuery } from "@tanstack/react-query";
import { RpcProvider } from "starknet";
import { CACHE_KEYS, getLocalCache, setLocalCache } from "@/utils/cacheUtils";

interface TokenBalances {
  ETH?: { formatted: string };
  USDT?: { formatted: string };
  STRK?: { formatted: string };
}

interface TokenBalancesResponse {
  balances: TokenBalances;
  isLoading: boolean;
  error: Error | null;
}

const rpcProvider = new RpcProvider({
  nodeUrl: "https://starknet-goerli.infura.io/v3/your-project-id"
});

export const useTokenBalances = (address?: string, tokens: string[] = []): TokenBalancesResponse => {
  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.TOKEN_BALANCES, address, tokens],
    queryFn: async () => {
      if (!address) return { balances: {} };

      const cacheKey = `token_balances_${address}`;
      const cachedData = getLocalCache(cacheKey);
      if (cachedData) {
        console.log('Using cached token balances for:', address);
        return { balances: cachedData };
      }

      const balances: TokenBalances = {
        ETH: { formatted: "0.0000" },
        USDT: { formatted: "0.0000" },
        STRK: { formatted: "0.0000" }
      };

      setLocalCache(cacheKey, balances);
      return { balances };
    },
    enabled: !!address,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    balances: data?.balances || {},
    isLoading,
    error
  };
};