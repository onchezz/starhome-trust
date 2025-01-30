import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property, PropertyConverter } from '@/types/property';
import { UserConverter } from '@/types/user';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading: salePropertiesLoading, error: salePropertiesError } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await useStarHomeReadContract({
        functionName: "get_sale_properties",
      });
      
      console.log("[usePropertyRead] Raw properties data:", data);
      
      if (error) {
        console.error("[usePropertyRead] Error fetching properties:", error);
        throw error;
      }
      
      return data;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
  });

  const { data: investmentPropertiesData, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: async () => {
      const { data, error } = await useStarHomeReadContract({
        functionName: "get_investment_properties",
      });
      
      console.log("[usePropertyRead] Raw investment properties data:", data);
      
      if (error) {
        console.error("[usePropertyRead] Error fetching investment properties:", error);
        throw error;
      }
      
      return data;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
  });

  // Convert the raw data to Property objects
  const saleProperties = propertiesData ? propertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  const investmentProperties = investmentPropertiesData ? investmentPropertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting investment property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting investment property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  console.log("[usePropertyRead] Final properties:", {
    saleProperties,
    investmentProperties,
    salePropertiesLoading,
    investmentPropertiesLoading
  });
 
  return {
    saleProperties,
    salePropertiesLoading,
    salePropertiesError,
    investmentProperties,
    investmentPropertiesLoading,
    investmentPropertiesError
  };
};

export const usePropertyReadById = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  
  const { data: propertyData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  useEffect(() => {
    if (propertyData) {
      console.log("[usePropertyReadById] Property data:", propertyData);
      try {
        const convertedProperty = PropertyConverter.fromStarknetProperty(propertyData);
        setProperty(convertedProperty);
      } catch (error) {
        console.error("[usePropertyReadById] Error converting property:", error);
        setProperty(null);
      }
    }
  }, [propertyData]);

  return { 
    property, 
    isLoading, 
    error 
  };
};

export const useAgentProperties = (agentAddress: string) => {
  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['agent_properties', agentAddress],
    queryFn: async () => {
      const { data, error } = await useStarHomeReadContract({
        functionName: "get_sale_properties_by_agent",
        args: [agentAddress],
      });
      
      console.log("[useAgentProperties] Raw agent properties data:", data);
      
      if (error) {
        console.error("[useAgentProperties] Error fetching agent properties:", error);
        throw error;
      }
      
      return data;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !!agentAddress,
  });

  const properties = propertiesData ? propertiesData.map((prop: any) => {
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