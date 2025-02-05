import { Abi, useContract, useReadContract } from "@starknet-react/core";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";

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

  console.log(`[useStarHomeReadContract] ${functionName}:`, {
    data,
    isLoading,
    error,
    args,
    contractAddress: starhomesContract
  });

  return { data, isLoading, error };
};