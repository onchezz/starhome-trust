import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { parseParamWithType } from '@/utils/starhomes/contract';
import { Property } from '@/types/property';

export const usePropertiesRead = () => {
  const { data: properties, isLoading } = useStarHomeReadContract({
    contractName: "StarhomesContract",
    functionName: "get_sale_properties",
    args: [],
  });

  console.log("Raw properties:", properties);

  const parsedProperties = properties?.map((property: any) => {
    return Object.keys(property).reduce((acc: any, key) => {
      acc[key] = parseParamWithType(property[key]?.type || 'core::felt252', property[key], true);
      return acc;
    }, {}) as Property;
  });

  return {
    properties: parsedProperties || [],
    isLoading,
  };
};