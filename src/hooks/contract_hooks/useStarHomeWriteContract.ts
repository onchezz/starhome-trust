import { useContract } from "@starknet-react/core";
import { starhomesContract } from "@/utils/constants";
import { starhomesAbi } from "@/data/starhomes_abi";
import { useState } from "react";

export const useStarHomeWriteContract = () => {
  const { contract } = useContract({
    abi: starhomesAbi,
    address: starhomesContract,
  });

  const [status, setStatus] = useState<{
    isSuccess: boolean;
    isError: boolean;
    error?: any;
  }>({
    isSuccess: false,
    isError: false,
  });

  const execute = async (functionName: string, args: any[]) => {
    try {
      console.log(`Executing ${functionName} with args:`, args);
      if (!contract) throw new Error("Contract not initialized");

      const response = await contract.invoke(functionName, args);
      console.log(`${functionName} response:`, response);

      setStatus({ isSuccess: true, isError: false });
      return { response, status };
    } catch (error) {
      console.error(`Error executing ${functionName}:`, error);
      setStatus({ isSuccess: false, isError: true, error });
      throw error;
    }
  };

  const executeBatch = async (calls: { functionName: string; args: any[] }[]) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      
      const response = await contract.invoke("__execute__", calls);
      setStatus({ isSuccess: true, isError: false });
      return { response, status };
    } catch (error) {
      setStatus({ isSuccess: false, isError: true, error });
      throw error;
    }
  };

  return {
    contract,
    execute,
    executeBatch,
    status,
  };
};