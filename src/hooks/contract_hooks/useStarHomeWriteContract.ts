import { useContract } from "@starknet-react/core";
import { starhomesContract } from "@/utils/constants";
import { starhomes_abi } from "@/data/starhomes_abi";
import { useState } from "react";

export const useStarHomeWriteContract = () => {
  const [status, setStatus] = useState<any>(null);
  
  const { contract } = useContract({
    abi: starhomes_abi,
    address: starhomesContract,
  });

  const execute = async (functionName: string, args: any[]) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const response = await contract.invoke(functionName, args);
      setStatus({ isSuccess: true, isError: false });
      return { response, status };
    } catch (error) {
      console.error(`Error executing ${functionName}:`, error);
      setStatus({ isSuccess: false, isError: true, error });
      throw error;
    }
  };

  const executeBatch = async (calls: { functionName: string; args: any[] }[]) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const response = await contract.multiInvoke(calls);
      setStatus({ isSuccess: true, isError: false });
      return { response, status };
    } catch (error) {
      console.error("Error executing batch:", error);
      setStatus({ isSuccess: false, isError: true, error });
      throw error;
    }
  };

  return { contract, execute, executeBatch, status };
};