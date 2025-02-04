import { useQuery } from "@tanstack/react-query";
import { Contract, RpcProvider } from "starknet";
import { universalTokenAbi } from "@/data/universalTokenabi";
import { CACHE_KEYS, getLocalCache, setLocalCache } from "@/utils/cacheUtils";

const rpcProvider = new RpcProvider({
  nodeUrl: "https://starknet-goerli.infura.io/v3/your-project-id"
});

export const useTokenBalances = (address: string, tokens: string[]) => {
  const fetchBalances = async () => {
    if (!address || !tokens.length) return {};

    const cacheKey = `token_balances_${address}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached token balances for:', address);
      return cachedData;
    }

    const balances: { [key: string]: string } = {};

    for (const tokenAddress of tokens) {
      try {
        const contract = new Contract(universalTokenAbi, tokenAddress, rpcProvider);
        const balance = await contract.balanceOf(address);
        balances[tokenAddress] = balance.toString();
      } catch (error) {
        console.error(`Error fetching balance for token ${tokenAddress}:`, error);
        balances[tokenAddress] = "0";
      }
    }

    setLocalCache(cacheKey, balances);
    return balances;
  };

  return useQuery({
    queryKey: [CACHE_KEYS.TOKEN_BALANCES, address, tokens],
    queryFn: fetchBalances,
    enabled: !!address && tokens.length > 0,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};