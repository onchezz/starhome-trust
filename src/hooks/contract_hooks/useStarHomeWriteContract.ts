import {  useContract, useSendTransaction } from "@starknet-react/core";
import type { Abi,  } from "starknet";
import { useMemo, useCallback } from "react";
import {  starhomesContract } from "@/utils/constants";
import { starhomes_abi } from "@/data/starhomes_abi";


interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
}

export function useStarHomeWriteContract() {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  const { sendAsync, error, reset, status } = useSendTransaction({
    calls: undefined,
  });

  const txStatus: TransactionStatus = useMemo(
    () => ({
      isError: status === "error",
      isSuccess: status === "success",
      isPending: status === "pending",
      error,
      reset,
    }),
    [status, error, reset]
  );

  const execute = useCallback(
    async (functionName: string, args: any[]) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      try {
        console.log(`Calling ${functionName} with args:`, args);
        
        // Process boolean values
        const processedArgs = args.map(arg => {
          if (typeof arg === 'boolean') {
            return arg ? 1 : 0; // Convert boolean to 1/0 for contract
          }
          return arg;
        });

        const call = contract.populate(functionName, processedArgs);
        console.log(`Populated call:`, call);

        const response = await sendAsync([call]);
        return { response, status: txStatus };
      } catch (err) {
        console.error(`Error executing ${functionName}:`, err);
        throw err;
      }
    },
    [contract, sendAsync, txStatus]
  );

  const executeBatch = useCallback(
    async (calls: { functionName: string; args: any[] }[]) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      try {
        // Create all calls using the contract's populate method
        const populatedCalls = calls.map(({ functionName, args }) =>
          contract.populate(functionName, args)
        );
        
        // Send the batch transaction
        const response = await sendAsync(populatedCalls);
        return { response, status: txStatus };
      } catch (err) {
        console.error("Error executing batch transaction:", err);
        throw err;
      }
    },
    [contract, sendAsync, txStatus]
  );

  return {
    contract,
    execute,
    executeBatch,
    status: txStatus,
  };
}
