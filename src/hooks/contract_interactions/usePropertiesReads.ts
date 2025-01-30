import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property, PropertyConverter } from '@/types/property';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { num, shortString } from 'starknet';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const usePropertyRead = () => {
  const { address } = useAccount();
  const salePropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const investmentPropertiesHook = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const { data: propertiesData, isLoading: salePropertiesLoading, error: salePropertiesError } = useQuery({
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

  const { data: investmentPropertiesData, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties', address],
    queryFn: async () => {
      console.log("[usePropertyRead] Raw investment properties data:", investmentPropertiesHook);
      
      if (investmentPropertiesHook.error) {
        console.error("[usePropertyRead] Error fetching investment properties:", investmentPropertiesHook.error);
        throw investmentPropertiesHook.error;
      }
      
      const investments = investmentPropertiesHook.data || [];
      console.log("[usePropertyRead] Fetched investments:", investments);
      return investments;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !investmentPropertiesHook.isLoading && !!address,
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

  const investmentProperties = Array.isArray(investmentPropertiesData) ? investmentPropertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting investment property:", prop);
    try {   
      return InvestmentAssetConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting investment property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  // Filter investments by the current user's address
  const userInvestments = investmentProperties.filter(inv => 
    inv?.owner?.toLowerCase() === address?.toLowerCase()
  );

  console.log("[usePropertyRead] Final properties:", {
    saleProperties,
    investmentProperties,
    userInvestments,
    salePropertiesLoading,
    investmentPropertiesLoading,
    userAddress: address
  });

  return {
    saleProperties,
    salePropertiesLoading,
    salePropertiesError,
    investmentProperties,
    userInvestments,
    investmentPropertiesLoading,
    investmentPropertiesError
  };
};

export const usePropertyReadById = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const contractHook = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  useEffect(() => {
    if (contractHook.data) {
      console.log("[usePropertyReadById] Property data:", contractHook.data);
      try {
        const convertedProperty = PropertyConverter.fromStarknetProperty(contractHook.data);
        setProperty(convertedProperty);
      } catch (error) {
        console.error("[usePropertyReadById] Error converting property:", error);
        setProperty(null);
      }
    }
  }, [contractHook.data]);

  return { 
    property, 
    isLoading: contractHook.isLoading, 
    error: contractHook.error 
  };
};
export const useInvestmentAssetReadById = (id: string) => {
  const [investment, setInvestment] = useState<InvestmentAsset | null>(null);
  const contractHook = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
  });

  useEffect(() => {
    if (contractHook.data) {
      console.log("[useInvestmentAssetReadById] Property data:", contractHook.data);
      try {
        const convertedProperty:InvestmentAsset = InvestmentAssetConverter.fromStarknetProperty(contractHook.data);
        setInvestment(convertedProperty);
      } catch (error) {
        console.error("[usePropertyReadById] Error converting property:", error);
        setInvestment(null);
      }
    }
  }, [contractHook.data]);

  return { 
    investment, 
    isLoading: contractHook.isLoading, 
    error: contractHook.error 
  };
};
export const useAgentProperties = (agentAddress: string) => {
  const agentPropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: [agentAddress],
  });

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['agent_properties', agentAddress],
    queryFn: async () => {
      console.log("[useAgentProperties] Raw agent properties data:", agentPropertiesHook);
      
      if (agentPropertiesHook.error) {
        console.error("[useAgentProperties] Error fetching agent properties:", agentPropertiesHook.error);
        throw agentPropertiesHook.error;
      }
      
      return agentPropertiesHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !!agentAddress && !agentPropertiesHook.isLoading,
  });

  const properties = Array.isArray(propertiesData) ? propertiesData.map((prop: any) => {
    console.log("[useAgentProperties] Converting agent property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[useAgentProperties] Error converting agent property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  console.log("[useAgentProperties] Final properties:", {
    properties,
    isLoading,
    error
  });

  return { properties, isLoading, error };
};
