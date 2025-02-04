import { Property, PropertyConverter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { CACHE_KEYS } from '@/utils/cacheUtils';

interface PropertyReadResponse {
  saleProperties: Property[];
  salePropertiesLoading: boolean;
  error?: Error;
}

export const usePropertyRead = (): PropertyReadResponse => {
  console.log('[usePropertyRead] Starting property read hook');
  
  const { data: contractData, isLoading: contractLoading, error: contractError } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const { data, isLoading: queryLoading, error } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTIES],
    queryFn: async () => {
      console.log('[usePropertyRead] Processing contract data:', contractData);
      
      if (!contractData) {
        console.log('[usePropertyRead] No contract data available');
        return { saleProperties: [] };
      }

      try {
        const properties = Array.isArray(contractData) 
          ? contractData.map((prop: any) => {
              console.log('[usePropertyRead] Converting property:', prop);
              return PropertyConverter.fromStarknetProperty(prop);
            }).filter(Boolean)
          : [];
        
        console.log('[usePropertyRead] Converted properties:', properties);
        return { saleProperties: properties };
      } catch (err) {
        console.error('[usePropertyRead] Error converting properties:', err);
        throw err;
      }
    },
    enabled: !!contractData && !contractError,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    saleProperties: data?.saleProperties || [],
    salePropertiesLoading: contractLoading || queryLoading,
    error: error || contractError,
  };
};

// Separate hook for property by ID
export const usePropertyReadById = (propertyId: string) => {
  console.log('[usePropertyReadById] Reading property:', propertyId);
  
  const { data: contractData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: propertyId ? [propertyId] : undefined,
  });

  const { data } = useQuery({
    queryKey: [CACHE_KEYS.PROPERTY(propertyId)],
    queryFn: async () => {
      if (!contractData) return null;
      
      try {
        const property = PropertyConverter.fromStarknetProperty(contractData);
        console.log('[usePropertyReadById] Converted property:', property);
        return property;
      } catch (err) {
        console.error('[usePropertyReadById] Error converting property:', err);
        throw err;
      }
    },
    enabled: !!contractData && !!propertyId && !error,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    property: data,
    isLoading,
    error,
  };
};

// Separate hook for agent properties
export const useAgentProperties = (agentAddress: string) => {
  console.log('[useAgentProperties] Reading properties for agent:', agentAddress);
  
  const { data: contractData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentAddress ? [agentAddress] : undefined,
  });

  const { data } = useQuery({
    queryKey: [CACHE_KEYS.AGENT_PROPERTIES, agentAddress],
    queryFn: async () => {
      if (!contractData) return [];
      
      try {
        const properties = Array.isArray(contractData)
          ? contractData.map(prop => PropertyConverter.fromStarknetProperty(prop)).filter(Boolean)
          : [];
        console.log('[useAgentProperties] Converted properties:', properties);
        return properties;
      } catch (err) {
        console.error('[useAgentProperties] Error converting properties:', err);
        throw err;
      }
    },
    enabled: !!contractData && !!agentAddress && !error,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    properties: data || [],
    isLoading,
    error,
  };
};