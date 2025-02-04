import { useQuery } from "@tanstack/react-query";
import { Contract, RpcProvider } from "starknet";
import { universalTokenAbi } from "@/data/universalTokenabi";
import { CACHE_KEYS, getLocalCache, setLocalCache } from "@/utils/cacheUtils";

interface TokenBalances {
  ETH?: { formatted: string };
  USDT?: { formatted: string };
  STRK?: { formatted: string };
}

const rpcProvider = new RpcProvider({
  nodeUrl: "https://starknet-goerli.infura.io/v3/your-project-id"
});

export const useTokenBalances = (address?: string, tokens: string[] = []) => {
  const fetchBalances = async () => {
    if (!address) return {};

    const cacheKey = `token_balances_${address}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached token balances for:', address);
      return cachedData;
    }

    const balances: TokenBalances = {};
    
    try {
      // Mock data for development
      balances.ETH = { formatted: "0.0000" };
      balances.USDT = { formatted: "0.0000" };
      balances.STRK = { formatted: "0.0000" };

      setLocalCache(cacheKey, balances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }

    return balances;
  };

  return useQuery({
    queryKey: [CACHE_KEYS.TOKEN_BALANCES, address, tokens],
    queryFn: fetchBalances,
    enabled: !!address,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};