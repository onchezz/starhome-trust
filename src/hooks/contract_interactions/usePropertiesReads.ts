import { Property, PropertyConverter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';

// Cache time for better performance
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export const usePropertyRead = () => {
  const salePropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log("[usePropertyRead] Contract hook result:", salePropertiesHook);
      
      if (salePropertiesHook.error) {
        console.error("[usePropertyRead] Error fetching properties:", salePropertiesHook.error);
        throw salePropertiesHook.error;
      }
      
      return salePropertiesHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !salePropertiesHook.isLoading,
  });

  const saleProperties = Array.isArray(propertiesData) ? propertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  return {
    saleProperties,
    isLoading,
    error,
  };
};

export const usePropertyReadById = (propertyId: string) => {
  const propertyHook = useStarHomeReadContract({
    functionName: "get_property",
    args: propertyId ? [propertyId] : undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      if (propertyHook.error) {
        throw propertyHook.error;
      }
      return propertyHook.data ? PropertyConverter.fromStarknetProperty(propertyHook.data) : null;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!propertyId && !propertyHook.isLoading,
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

  const { data: investmentPropertiesData, isLoading: allInvestmentsLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: async () => {
      if (investmentPropertiesHook.error) {
        throw investmentPropertiesHook.error;
      }
      return investmentPropertiesHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !investmentPropertiesHook.isLoading,
  });

  const { data: userInvestmentsData, isLoading: userInvestmentsLoading, error: userInvestmentsError } = useQuery({
    queryKey: ['user_investments', address],
    queryFn: async () => {
      if (userInvestmentsHook.error) {
        throw userInvestmentsHook.error;
      }
      console.log(`user investment data is :${userInvestmentsHook.data}`)
      return userInvestmentsHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!address && !userInvestmentsHook.isLoading,
  });

  const investmentProperties = Array.isArray(investmentPropertiesData) 
    ? investmentPropertiesData.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
    : [];

  const userInvestments = Array.isArray(userInvestmentsData)
    ? userInvestmentsData.map(InvestmentAssetConverter.fromStarknetProperty).filter(Boolean)
    : [];

  return {
    investmentProperties,
    userInvestments,
    isLoading: allInvestmentsLoading || userInvestmentsLoading,
    error: investmentPropertiesError || userInvestmentsError,
    investmentPropertiesError,
  };
};

export const useInvestmentAssetReadById = (investmentId: string) => {
  console.log("[useInvestmentAssetReadById] Fetching investment with ID:", investmentId);
  
  const investmentHook = useStarHomeReadContract({
    functionName: "get_investment", // Updated from get_investment_by_id to get_investment
    args: investmentId ? [investmentId] : undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['investment', investmentId],
    queryFn: async () => {
      console.log("[useInvestmentAssetReadById] Raw data:", investmentHook.data);
      if (investmentHook.error) {
        console.error("[useInvestmentAssetReadById] Error:", investmentHook.error);
        throw investmentHook.error;
      }
      return investmentHook.data ? InvestmentAssetConverter.fromStarknetProperty(investmentHook.data) : null;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!investmentId && !investmentHook.isLoading,
  });

  return {
    investment: data,
    isLoading,
    error,
  };
};

export const useAgentProperties = (agentId: string) => {
  console.log("[useAgentProperties] Fetching properties for agent:", agentId);
  
  const agentPropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentId ? [agentId] : undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['agent_properties', agentId],
    queryFn: async () => {
      console.log("[useAgentProperties] Raw contract data:", agentPropertiesHook.data);
      
      if (agentPropertiesHook.error) {
        console.error("[useAgentProperties] Error:", agentPropertiesHook.error);
        throw agentPropertiesHook.error;
      }
      
      return agentPropertiesHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !!agentId && !agentPropertiesHook.isLoading,
  });

  const properties = Array.isArray(data) 
    ? data.map((prop: any) => {
        console.log("[useAgentProperties] Converting property:", prop);
        try {
          return PropertyConverter.fromStarknetProperty(prop);
        } catch (error) {
          console.error("[useAgentProperties] Error converting property:", error);
          return null;
        }
      }).filter(Boolean)
    : [];

  console.log("[useAgentProperties] Converted properties:", properties);

  return {
    properties,
    isLoading,
    error,
  };
};
