import { useStarHomeReadContract } from './contract_hooks/useStarHomeReadContract';
import { Property } from '@/types/property';

export const usePropertyRead = () => {
  const { data: properties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_properties",
  });

  const { data: investmentProperties, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_properties",
  });

  console.log("Sale properties:", properties);
  console.log("Investment properties:", investmentProperties);

  return {
    properties,
    investmentProperties,
    isLoading: isLoading || isLoadingInvestments,
    error,
  };
};