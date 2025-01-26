import { useStarHomeReadContract } from "@/hooks/contract_hooks/useStarHomeReadContract";
import { Property } from '@/types/property';

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  console.log("Sale properties:", propertiesData);

  // Ensure we always return an array for properties
  const properties = Array.isArray(propertiesData) ? propertiesData : [];

  return {
    properties,
    isLoading,
    error,
  };
};