import { Property, PropertyConverter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { CACHE_KEYS, getLocalCache, setLocalCache } from '@/utils/cacheUtils';

interface PropertyReadResponse {
  saleProperties: Property[];
  salePropertiesLoading: boolean;
  error?: Error;
}

interface PropertyByIdResponse {
  property: Property | null;
  isLoading: boolean;
  error?: Error;
}

interface AgentPropertiesResponse {
  properties: Property[];
  isLoading: boolean;
  error?: Error;
}

interface InvestmentAssetResponse {
  investment: InvestmentAsset | null;
  isLoading: boolean;
  error?: Error;
}

interface InvestmentAssetsReadResponse {
  investmentProperties: InvestmentAsset[];
  userInvestments: InvestmentAsset[];
  isLoading: boolean;
  error: Error | null;
  investmentPropertiesError?: Error;
}

export const useInvestmentAssetsRead = (): InvestmentAssetsReadResponse => {
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

    const properties = Array.isArray(data) 
      ? data.map((prop: any) => InvestmentAssetConverter.fromStarknetProperty(prop)).filter(Boolean)
      : [];
    
    setLocalCache('investment_properties', properties);
    return properties;
  };

  const fetchUserInvestments = async () => {
    if (!address) return [];

    const cachedData = getLocalCache(`user_investments_${address}`);
    if (cachedData) {
      console.log('Using cached user investments data');
      return cachedData;
    }

    const { data } = await useStarHomeReadContract({
      functionName: "get_investment_properties_by_lister",
      args: [address],
    });

    const investments = Array.isArray(data) 
      ? data.map((inv: any) => InvestmentAssetConverter.fromStarknetProperty(inv)).filter(Boolean)
      : [];
    
    setLocalCache(`user_investments_${address}`, investments);
    return investments;
  };

  const { data: investmentProperties, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: [CACHE_KEYS.INVESTMENT_PROPERTIES],
    queryFn: fetchInvestmentProperties,
    gcTime: 1000 * 60 * 10,
  });

  const { data: userInvestments, isLoading: userInvestmentsLoading, error: userInvestmentsError } = useQuery({
    queryKey: [CACHE_KEYS.USER_INVESTMENTS, address],
    queryFn: fetchUserInvestments,
    enabled: !!address,
    gcTime: 1000 * 60 * 10,
  });

  return {
    investmentProperties: investmentProperties || [],
    userInvestments: userInvestments || [],
    isLoading: investmentPropertiesLoading || userInvestmentsLoading,
    error: userInvestmentsError,
    investmentPropertiesError,
  };
};

export const usePropertyRead = (): PropertyReadResponse => {
  const { data, isLoading: salePropertiesLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTIES],
    queryFn: async () => {
      const cachedData = getLocalCache('sale_properties');
      if (cachedData) {
        console.log('Using cached sale properties data');
        return { saleProperties: cachedData };
      }

      const { data } = await useStarHomeReadContract({
        functionName: "get_sale_properties",
      });

      const properties = Array.isArray(data) 
        ? data.map((prop: any) => PropertyConverter.fromStarknetProperty(prop)).filter(Boolean)
        : [];
      
      setLocalCache('sale_properties', properties);
      return { saleProperties: properties };
    },
    gcTime: 1000 * 60 * 10,
  });

  return {
    saleProperties: data?.saleProperties || [],
    salePropertiesLoading,
    error,
  };
};

export const usePropertyReadById = (propertyId: string): PropertyByIdResponse => {
  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTY(propertyId)],
    queryFn: async () => {
      const cacheKey = `property_${propertyId}`;
      const cachedData = getLocalCache(cacheKey);
      if (cachedData) {
        console.log('Using cached property data for:', propertyId);
        return { property: cachedData };
      }

      const { data } = await useStarHomeReadContract({
        functionName: "get_property",
        args: propertyId ? [propertyId] : undefined,
      });

      if (data) {
        const property = PropertyConverter.fromStarknetProperty(data);
        setLocalCache(cacheKey, property);
        return { property };
      }

      return { property: null };
    },
    enabled: !!propertyId,
    gcTime: 1000 * 60 * 10,
  });

  return {
    property: data?.property || null,
    isLoading,
    error,
  };
};

export const useAgentProperties = (agentAddress: string): AgentPropertiesResponse => {
  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.AGENT_PROPERTIES, agentAddress],
    queryFn: async () => {
      if (!agentAddress) return { properties: [] };
      
      const cacheKey = `agent_properties_${agentAddress}`;
      const cachedData = getLocalCache(cacheKey);
      if (cachedData) {
        console.log('Using cached agent properties data for:', agentAddress);
        return { properties: cachedData };
      }

      const { data } = await useStarHomeReadContract({
        functionName: "get_sale_properties_by_agent",
        args: [agentAddress],
      });

      const properties = Array.isArray(data) 
        ? data.map((prop: any) => PropertyConverter.fromStarknetProperty(prop)).filter(Boolean)
        : [];
      
      setLocalCache(cacheKey, properties);
      return { properties };
    },
    enabled: !!agentAddress,
    gcTime: 1000 * 60 * 10,
  });

  return {
    properties: data?.properties || [],
    isLoading,
    error,
  };
};

export const useInvestmentAssetReadById = (id?: string): InvestmentAssetResponse => {
  const { data, isLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.INVESTMENT_ASSET(id || '')],
    queryFn: async () => {
      if (!id) return { investment: null };
      
      const cacheKey = `investment_asset_${id}`;
      const cachedData = getLocalCache(cacheKey);
      if (cachedData) {
        console.log('Using cached investment asset data for:', id);
        return { investment: cachedData };
      }

      const { data } = await useStarHomeReadContract({
        functionName: "get_investment",
        args: [id],
      });

      if (data) {
        const asset = InvestmentAssetConverter.fromStarknetProperty(data);
        setLocalCache(cacheKey, asset);
        return { investment: asset };
      }

      return { investment: null };
    },
    enabled: !!id,
    gcTime: 1000 * 60 * 10,
  });

  return {
    investment: data?.investment || null,
    isLoading,
    error,
  };
};
