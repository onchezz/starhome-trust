
import { Abi, useContract, useReadContract } from "@starknet-react/core";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";
import { useCallback } from "react";

interface UseStarHomeReadContractProps {
  functionName: string;
  args?: any[];
  options?: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    enabled?: boolean;
    watch? :boolean;
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

export const useStarHomeReadBatchContract = (calls: { functionName: string; args?: any[] }[]) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  const callBatch = useCallback(
  
      async () => {
        // calls: { functionName: string; args: any[] }[]
        if (!contract) {
          throw new Error("Contract not initialized");
        }
  
        try {
          // Create all calls using the contract's populate method
          const populatedCalls = calls.map(({ functionName, args }) =>
            contract.call(functionName, args)
          );
          // Send the batch transaction
          const response = await populatedCalls
          response.forEach((data)=> console.log(`response`, data));
          
          return { response };
        } catch (err) {
          console.error("Error executing batch transaction:", err);
          throw err;
        }
      },
      [calls, contract]
    );
 calls.forEach((map)=> console.log(`[useStarHomeReadBatchContract] ${map.functionName}:`, {
   
    contractAddress: starhomesContract
  }) )
 

  return { callBatch };
};




