import { useStarhomesContract } from '../contract_hooks/useStarhomesContract';
import { parseParamWithType } from '@/utils/starhomes/contract';
import { Property } from '@/types/property';

export const usePropertiesRead = () => {
  const { data: properties, isLoading } = useStarhomesContract({
    functionName: "get_sale_properties",
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