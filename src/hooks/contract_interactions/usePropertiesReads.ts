import { Property, PropertyConverter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { CACHE_KEYS, getLocalCache, setLocalCache } from '@/utils/cacheUtils';

export const usePropertyRead = () => {
  const fetchProperties = async () => {
    const cachedData = getLocalCache('sale_properties');
    if (cachedData) {
      console.log('Using cached sale properties data');
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_sale_properties",
    });

    if (data) {
      const properties = Array.isArray(data) 
        ? data.map((prop: any) => PropertyConverter.fromStarknetProperty(prop)).filter(Boolean)
        : [];
      setLocalCache('sale_properties', properties);
      return properties;
    }

    return [];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTIES],
    queryFn: fetchProperties,
  });

  return {
    saleProperties: data || [],
    salePropertiesLoading: isLoading,
    error,
  };
};

export const usePropertyReadById = (propertyId: string) => {
  const fetchProperty = async () => {
    const cacheKey = `property_${propertyId}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached property data for:', propertyId);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_property",
      args: propertyId ? [propertyId] : undefined,
    });

    if (data) {
      const property = PropertyConverter.fromStarknetProperty(data);
      setLocalCache(cacheKey, property);
      return property;
    }

    return null;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTY(propertyId)],
    queryFn: fetchProperty,
    enabled: !!propertyId,
  });

  return {
    property: data,
    isLoading,
    error,
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const investmentPropertiesHook = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const userInvestmentsHook = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: address ? [address] : undefined,
  });

  const fetchInvestmentProperties = async () => {
    const cachedData = getLocalCache('investment_properties');
    if (cachedData) {
      console.log('Using cached investment properties data');
      return cachedData;
    }

    const { data } = await investmentPropertiesHook;
    const properties = Array.isArray(data) 
      ? data.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
      : [];
    setLocalCache('investment_properties', properties);
    return properties;
  };

  const fetchUserInvestments = async () => {
    const cachedData = getLocalCache(`user_investments_${address}`);
    if (cachedData) {
      console.log('Using cached user investments data for:', address);
      return cachedData;
    }

    const { data } = await userInvestmentsHook;
    const investments = Array.isArray(data) 
      ? data.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
      : [];
    setLocalCache(`user_investments_${address}`, investments);
    return investments;
  };

  const { data: investmentPropertiesData, isLoading: allInvestmentsLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: fetchInvestmentProperties,
    enabled: !investmentPropertiesHook.isLoading,
  });

  const { data: userInvestmentsData, isLoading: userInvestmentsLoading, error: userInvestmentsError } = useQuery({
    queryKey: ['user_investments', address],
    queryFn: fetchUserInvestments,
    enabled: !!address && !userInvestmentsHook.isLoading,
  });

  const investmentProperties = Array.isArray(investmentPropertiesData) 
    ? investmentPropertiesData
    : [];

  const userInvestments = Array.isArray(userInvestmentsData)
    ? userInvestmentsData
    : [];

  return {
    investmentProperties,
    userInvestments,
    isLoading: allInvestmentsLoading || userInvestmentsLoading,
    error: investmentPropertiesError || userInvestmentsError,
  };
};

export const useInvestmentAssetReadById = (investmentId: string) => {
  const fetchInvestment = async () => {
    const cacheKey = `investment_${investmentId}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached investment data for:', investmentId);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investment", // Updated from get_investment_by_id to get_investment
      args: investmentId ? [investmentId] : undefined,
    });

    if (data) {
      const investment = InvestmentAssetConverter.fromStarknetProperty(data);
      setLocalCache(cacheKey, investment);
      return investment;
    }

    return null;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.INVESTMENT(investmentId)],
    queryFn: fetchInvestment,
    enabled: !!investmentId,
  });

  return {
    investment: data,
    isLoading,
    error,
  };
};
