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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    property: data,
    isLoading,
    error,
  };
};

export const useAgentProperties = (agentAddress: string) => {
  const fetchAgentProperties = async () => {
    if (!agentAddress) return [];
    
    const cacheKey = `agent_properties_${agentAddress}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached agent properties data for:', agentAddress);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_sale_properties_by_agent",
      args: [agentAddress],
    });

    if (data) {
      const properties = Array.isArray(data) 
        ? data.map((prop: any) => PropertyConverter.fromStarknetProperty(prop)).filter(Boolean)
        : [];
      setLocalCache(cacheKey, properties);
      return properties;
    }

    return [];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTIES, agentAddress],
    queryFn: fetchAgentProperties,
    enabled: !!agentAddress,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    properties: data || [],
    isLoading,
    error,
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();

  const fetchInvestmentProperties = async () => {
    const cachedData = getLocalCache('investment_properties');
    if (cachedData) {
      console.log('Using cached investment properties data');
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investment_properties",
    });

    if (data) {
      const properties = Array.isArray(data) 
        ? data.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
        : [];
      setLocalCache('investment_properties', properties);
      return properties;
    }

    return [];
  };

  const fetchUserInvestments = async () => {
    if (!address) return [];
    
    const cacheKey = `user_investments_${address}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached user investments data for:', address);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investment_properties_by_lister",
      args: [address],
    });

    if (data) {
      const investments = Array.isArray(data) 
        ? data.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
        : [];
      setLocalCache(cacheKey, investments);
      return investments;
    }

    return [];
  };

  const { data: investmentPropertiesData, isLoading: allInvestmentsLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: fetchInvestmentProperties,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: userInvestmentsData, isLoading: userInvestmentsLoading, error: userInvestmentsError } = useQuery({
    queryKey: ['user_investments', address],
    queryFn: fetchUserInvestments,
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    investmentProperties: investmentPropertiesData || [],
    userInvestments: userInvestmentsData || [],
    isLoading: allInvestmentsLoading || userInvestmentsLoading,
    error: investmentPropertiesError || userInvestmentsError,
  };
};