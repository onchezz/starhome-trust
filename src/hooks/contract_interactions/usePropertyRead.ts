import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property } from '@/types/property';

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  console.log("Sale properties:", propertiesData);

  return {
    properties: propertiesData || [],
    isLoading,
    error,
  };
};