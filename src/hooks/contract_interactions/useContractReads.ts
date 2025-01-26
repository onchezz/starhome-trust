import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Abi, useContract } from '@starknet-react/core';
import { starhomes_abi } from '@/data/starhomes_abi';
import { starhomesContract } from '@/utils/constants';
import { PropertyConverter } from '@/types/property';
import { AgentConverter } from '@/types/starknet_types/user_agent';

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

export const usePropertyReadById = (id: string) => {
  const { data: propertyData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property_by_id",
    args: [id],
  });

  console.log("Property by ID:", propertyData);

  const property = PropertyConverter.fromStarknetProperty(propertyData);

  return {
    property,
    isLoading,
    error,
  };
};

export const useAgentReadByAddress = (address: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_agent",
    args: [address],
  });
const agentData = AgentConverter.fromStarknetAgent(data);

  return {
    agent: agentData,
    isLoading,
    error,
  };
}
