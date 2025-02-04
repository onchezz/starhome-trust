import { useQuery } from '@tanstack/react-query';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { useAccount } from '@starknet-react/core';
import { CACHE_KEYS, getLocalCache, setLocalCache } from '@/utils/cacheUtils';

export const useInvestorsForInvestment = (investmentId: string) => {
  const fetchInvestors = async () => {
    const cacheKey = `investors_${investmentId}`;
    const cachedData = getLocalCache(cacheKey);
    
    if (cachedData) {
      console.log('Using cached investors data for:', investmentId);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investors_for_investment",
      args: [investmentId],
    });

    if (data) {
      setLocalCache(cacheKey, data);
    }

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [...CACHE_KEYS.INVESTMENT(investmentId), 'investors'],
    queryFn: fetchInvestors,
    enabled: !!investmentId,
  });

  return {
    investors: data,
    isLoading,
    error,
  };
};

export const useInvestorBalance = (investmentId: string, investorAddress?: string) => {
  const { address } = useAccount();
  const userAddress = investorAddress || address;

  const fetchBalance = async () => {
    if (!userAddress) return 0;

    const cacheKey = `balance_${investmentId}_${userAddress}`;
    const cachedData = getLocalCache(cacheKey);
    
    if (cachedData !== null) {
      console.log('Using cached balance data for:', investmentId, userAddress);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investor_balance_in_investment",
      args: [investmentId, userAddress],
    });

    const balance = data ? Number(data)/Math.pow(10,6) : 0;
    setLocalCache(cacheKey, balance);
    
    return balance;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [...CACHE_KEYS.INVESTMENT(investmentId), 'balance', userAddress || ''],
    queryFn: fetchBalance,
    enabled: !!investmentId && !!userAddress,
  });

  return {
    balance: data || 0,
    isLoading,
    error,
  };
};