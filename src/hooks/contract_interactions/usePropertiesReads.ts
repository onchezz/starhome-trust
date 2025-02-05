import { Property, PropertyConverter } from '@/types/property';
import { useQuery } from '@tanstack/react-query';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { 
  initDB,
  getCachedProperties, 
  cacheProperties,
  getCachedInvestments,
  cacheInvestments 
} from '@/utils/indexedDb';

// Initialize IndexedDB when the app starts
initDB().catch(console.error);

// Cache time for better performance
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export const usePropertyRead = () => {
  const salePropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log("[usePropertyRead] Starting property fetch");
      
      try {
        // Try to get cached properties first
        const cachedProperties = await getCachedProperties();
        if (cachedProperties && cachedProperties.length > 0) {
          console.log("[usePropertyRead] Using cached properties:", cachedProperties);
          return cachedProperties;
        }

        if (salePropertiesHook.error) {
          console.error("[usePropertyRead] Error fetching properties:", salePropertiesHook.error);
          throw salePropertiesHook.error;
        }
        
        const properties = salePropertiesHook.data || [];
        
        // Convert and cache the properties
        const convertedProperties = (Array.isArray(properties) ? properties : []).map((prop: any) => {
          try {
            return PropertyConverter.fromStarknetProperty(prop);
          } catch (error) {
            console.error("[usePropertyRead] Error converting property:", error, prop);
            return null;
          }
        }).filter((prop: any) => prop !== null);

        await cacheProperties(convertedProperties);
        return convertedProperties;
      } catch (error) {
        console.error("[usePropertyRead] Error in property fetch:", error);
        throw error;
      }
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !salePropertiesHook.isLoading,
  });

  return {
    saleProperties: propertiesData || [],
    isLoading,
    error,
  };
};

export const usePropertyReadById = (id: string) => {
  const { saleProperties, isLoading, error } = usePropertyRead();
  
  return {
    property: saleProperties?.find((p: Property) => p.id === id),
    isLoading,
    error
  };
};

export const useAgentProperties = (address: string) => {
  const { saleProperties, isLoading, error } = usePropertyRead();
  
  return {
    properties: saleProperties?.filter((p: Property) => p.agentId === address) || [],
    isLoading,
    error
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  console.log("Using address for investment assets:", address);

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
      // Try to get cached investments first
      const cachedInvestments = await getCachedInvestments();
      if (cachedInvestments && cachedInvestments.length > 0) {
        console.log("[useInvestmentAssetsRead] Using cached investments:", cachedInvestments);
        return cachedInvestments;
      }

      if (investmentPropertiesHook.error) {
        console.error("Error fetching investment properties:", investmentPropertiesHook.error);
        throw investmentPropertiesHook.error;
      }

      const investments = investmentPropertiesHook.data || [];
      const convertedInvestments = (Array.isArray(investments) ? investments : [])
        .map((inv: any) => InvestmentAssetConverter.fromStarknetProperty(inv))
        .filter((inv: any) => inv !== null);

      await cacheInvestments(convertedInvestments);
      return convertedInvestments;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    enabled: !investmentPropertiesHook.isLoading,
  });

  return {
    investmentProperties: investmentPropertiesData || [],
    userInvestments: Array.isArray(userInvestmentsHook.data) ? userInvestmentsHook.data : [],
    isLoading: allInvestmentsLoading || userInvestmentsHook.isLoading,
    error: investmentPropertiesError || userInvestmentsHook.error,
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();
  
  return {
    investment: investmentProperties?.find((inv: InvestmentAsset) => inv.id === id),
    isLoading,
    error
  };
};