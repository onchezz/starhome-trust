import { Abi, useCall, useContract, useReadContract } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";
import { Property } from "@/types/property";

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [] 
}: { 
  functionName: string;
  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  const { data, isLoading, error } = useReadContract({ 
    functionName, 
    args, 
    address: starhomesContract,
    abi: starhomes_abi as Abi,
  });

  console.log(`Contract read ${functionName}:`, { data, isLoading, error });

  return { data, isLoading, error };
};