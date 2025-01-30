import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property, PropertyConverter } from '@/types/property';
import { UserConverter } from '@/types/user';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading: salePropertiesLoading, error: salePropertiesError } = useQuery({
    queryKey: ['properties'],
    queryFn: () => useStarHomeReadContract({
      functionName: "get_sale_properties",
    }).data,
    staleTime: CACHE_TIME, // Data will be considered fresh for 5 minutes
    gcTime: CACHE_TIME, // Renamed from cacheTime to gcTime
    refetchInterval: CACHE_TIME,
  });

  const { data: investmentPropertiesData, isLoading: investmentPropertiesLoading, error: investmentPropertiesError } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: () => useStarHomeReadContract({
      functionName: "get_investment_properties",
    }).data,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME, // Renamed from cacheTime to gcTime
    refetchInterval: CACHE_TIME,
  });

  console.log("Sale properties:", propertiesData);

  const saleProperties = Array.isArray(propertiesData) ? propertiesData : [];
  const investmentProperties = Array.isArray(investmentPropertiesData) ? investmentPropertiesData : [];
 
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
    if (propertyData && !isLoading) {
      const convertedProperty = PropertyConverter.fromStarknetProperty(propertyData);
      setProperty(convertedProperty);
    }
  }, [propertyData, isLoading]);

  return { 
    property, 
    isLoading, 
    error 
  };
};

export const useAgentProperties = (agentAddress: string) => {
  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['agent_properties', agentAddress],
    queryFn: () => useStarHomeReadContract({
      functionName: "get_sale_properties_by_agent",
      args: [agentAddress],
    }).data,
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME, // Renamed from cacheTime to gcTime
    refetchInterval: CACHE_TIME,
    enabled: !!agentAddress,
  });

  const properties = Array.isArray(propertiesData) 
    ? propertiesData.map(prop => PropertyConverter.fromStarknetProperty(prop))
    : [];

  return { properties, isLoading, error };
};