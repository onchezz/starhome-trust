import { useContract } from "@starknet-react/core";
import { ABI } from "@/data/starhomes_abi";
import type { Abi } from "starknet";
import { useMemo } from "react";
import { Contract } from "starknet";

const CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// Extract function names from the interface section of the ABI
type ContractFunction = Extract<
  typeof ABI[number],
  { type: "interface", name: "starhomes::interface::IStarhomesContract" }
>["items"][number]["name"];

export const useStarHomeWriteContract = ({ functionName }: { functionName: ContractFunction }) => {
  const { contract } = useContract({
    abi: ABI as Abi,
    address: CONTRACT_ADDRESS,
  });

  const sendAsync = async ({ args }: { args: any[] }) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    console.log(`Calling ${functionName} with args:`, args);
    const call = contract.populate(functionName, args);
    
    try {
      const response = await contract.execute(call);
      console.log(`${functionName} result:`, response);
      return response;
    } catch (error) {
      console.error(`Error executing ${functionName}:`, error);
      throw error;
    }
  };

  return {
    sendAsync,
    isPending: false, // We'll handle loading state manually since we're using direct contract execution
  };
};