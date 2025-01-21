import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { parseParamWithType } from '@/utils/starhomes/contract';
import { Property } from '@/types/property';

export const useStakingRead = () => {
  const { data: properties, isLoading: isLoadingRewards } = useStarHomeReadContract({
    contractName: "StarhomesContract",
    functionName: "get_investment_properties",
    args: [],
  });

  console.log("Raw staking properties:", properties);

  const parsedProperties = properties?.map((property: any) => {
    return Object.keys(property).reduce((acc: any, key) => {
      acc[key] = parseParamWithType(property[key]?.type || 'core::felt252', property[key], true);
      return acc;
    }, {}) as Property;
  });

  const rewards = "0"; // TODO: Implement actual rewards calculation

  return {
    properties: parsedProperties || [],
    isLoading: isLoadingRewards,
    rewards,
    isLoadingRewards
  };
};