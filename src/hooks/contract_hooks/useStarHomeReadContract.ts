import { Abi, useContract } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { starhomes_abi } from "@/data/starhomes_abi";
import { CONTRACT_ADDRESS } from "@/utils/constants";

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [] 
}: { 
  functionName: string;
  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: CONTRACT_ADDRESS,
  });

  return useQuery({
    queryKey: [functionName, args],
    queryFn: async () => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      console.log(`Calling ${functionName} with args:`, args);
      const result = await contract.call(functionName, args);
      console.log(`${functionName} result:`, result);
      return result;
    },
    enabled: !!contract,
  });
};