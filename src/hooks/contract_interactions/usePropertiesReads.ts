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
      const result = await useStarHomeReadContract({
        functionName: "get_sale_properties",
      }).data;
      console.log("Raw properties data:", result);
      return result;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
  });

  const { data: investmentPropertiesData, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: async () => {
      const result = await useStarHomeReadContract({
        functionName: "get_investment_properties",
      }).data;
      console.log("Raw investment properties data:", result);
      return result;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
  });

  // Convert the raw data to Property objects
  const saleProperties = propertiesData ? propertiesData.map((prop: any) => {
    console.log("Converting property:", prop);
    return PropertyConverter.fromStarknetProperty(prop);
  }) : [];

  const investmentProperties = investmentPropertiesData ? investmentPropertiesData.map((prop: any) => {
    console.log("Converting investment property:", prop);
    return PropertyConverter.fromStarknetProperty(prop);
  }) : [];
 
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
      console.log("Property data by ID:", propertyData);
      const convertedProperty = PropertyConverter.fromStarknetProperty(propertyData);
      setProperty(convertedProperty);
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
      const result = await useStarHomeReadContract({
        functionName: "get_sale_properties_by_agent",
        args: [agentAddress],
      }).data;
      console.log("Agent properties data:", result);
      return result;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !!agentAddress,
  });

  const properties = propertiesData ? propertiesData.map((prop: any) => {
    console.log("Converting agent property:", prop);
    return PropertyConverter.fromStarknetProperty(prop);
  }) : [];

  return { properties, isLoading, error };
};