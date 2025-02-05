
import { Abi, useContract, useReadContract } from "@starknet-react/core";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";

interface UseStarHomeReadContractProps {
  functionName: string;
  args?: any[];
  options?: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
  };
}

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [],
  options = {} 
}: UseStarHomeReadContractProps) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  const { data, isLoading, error } = useReadContract({ 
    functionName, 
    args, 
    address: starhomesContract,
    abi: starhomes_abi as Abi,
    ...options
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
