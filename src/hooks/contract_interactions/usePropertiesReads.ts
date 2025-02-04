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

  return useQuery({
    queryKey: [CACHE_KEYS.PROPERTIES],
    queryFn: fetchProperties,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
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

  return useQuery({
    queryKey: [CACHE_KEYS.PROPERTY(propertyId)],
    queryFn: fetchProperty,
    enabled: !!propertyId,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
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

  return useQuery({
    queryKey: [CACHE_KEYS.AGENT_PROPERTIES, agentAddress],
    queryFn: fetchAgentProperties,
    enabled: !!agentAddress,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
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

  const { data: investmentPropertiesData, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: fetchInvestmentProperties,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: userInvestmentsData, isLoading: userInvestmentsLoading, error: userInvestmentsError } = useQuery({
    queryKey: ['user_investments', address],
    queryFn: fetchUserInvestments,
    enabled: !!address,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    investmentProperties: investmentPropertiesData || [],
    userInvestments: userInvestmentsData || [],
    isLoading: investmentPropertiesLoading || userInvestmentsLoading,
    error: investmentPropertiesError || userInvestmentsError,
    investmentPropertiesError // Add this to fix the type error in Investment.tsx
  };
};

export const useInvestmentAssetReadById = (id?: string) => {
  const fetchInvestmentAsset = async () => {
    if (!id) return null;
    
    const cacheKey = `investment_asset_${id}`;
    const cachedData = getLocalCache(cacheKey);
    if (cachedData) {
      console.log('Using cached investment asset data for:', id);
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investment_property",
      args: [id],
    });

    if (data) {
      const asset = InvestmentAssetConverter.fromStarknetProperty(data);
      setLocalCache(cacheKey, asset);
      return asset;
    }

    return null;
  };

  return useQuery({
    queryKey: [CACHE_KEYS.INVESTMENT_ASSET(id || '')],
    queryFn: fetchInvestmentAsset,
    enabled: !!id,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};