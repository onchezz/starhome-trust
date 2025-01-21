import { useContract } from "@starknet-react/core";
import { ABI } from "@/data/starhomes_abi";
import { useQuery } from "@tanstack/react-query";
import type { Abi } from "starknet";

const CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// Extract function names from the interface section of the ABI
type ContractFunction = Extract<
  typeof ABI[number],
  { type: "function" }
>["name"];

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [] 
}: { 
  functionName: ContractFunction;
  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: ABI as Abi,
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