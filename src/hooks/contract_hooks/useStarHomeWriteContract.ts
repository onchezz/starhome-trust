
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Abi, useContract, useSendTransaction } from "@starknet-react/core";
import { starhomes_abi } from "@/data/starhomes_abi";
// import type { Abi, Call } from "starknet";
import { starhomesContract } from "@/utils/constants";

// First attempt to extract interface functions
type AbiInterface = Extract<
  typeof starhomes_abi[number],
  { type: "interface"; name: "starhomes::interface::IStarhomesContract" }
>;

type AbiFunctions = AbiInterface extends { items: Array<infer Item> }
  ? Item extends { name: string }
    ? Item["name"]
    : string
  : string;

// Fallback to allowing any string if type extraction fails
type ContractFunction = AbiFunctions | string;

export const useStarHomeWriteContract = ({
  functionName,
}: {
  functionName: ContractFunction;
}) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
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