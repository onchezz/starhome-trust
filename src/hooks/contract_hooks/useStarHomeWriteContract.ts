/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsonRpcProvider, useContract, useSendTransaction } from "@starknet-react/core";
import type { Abi, Contract, Call } from "starknet";
import { useMemo, useCallback } from "react";
import { rpcProvideUr, starhomesContract } from "@/utils/constants";
import { starhomes_abi } from "@/data/starhomes_abi";
import { Chain } from "@starknet-react/chains";

interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
}

export function useStarHomeWriteContract() {
const { contract } = useContract({
  abi:starhomes_abi as Abi ,
  address: starhomesContract,
  // provider:rpcProvideUr
});
  // Initialize transaction hook with empty calls
  const {  sendAsync, error, reset, status } = useSendTransaction({
    calls: undefined,
  });

  // Create status object
  const txStatus: TransactionStatus = useMemo(() => ({
    isError: status === "error",
    isSuccess: status === "success",
    isPending: status === "pending",
    error,
    reset,
  }), [status, error, reset]);

  // Create a memoized execute function
  const execute = useCallback(
    async (functionName: string, args: any[]) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      try {
       console.log(contract.functions)
       
        // Create the call using the contract's populate method
        const call = contract.populate(functionName, args);
        console.log(`Calling ${functionName} with args:`, args);
        console.log(`Calling ${functionName} with call:`, call);
        // Send the transaction
        const response = await sendAsync([call]);
        return { response, status: txStatus };
      } catch (err) {
        console.error(`Error executing ${functionName}:`, err);
        throw err;
      }
    },
    [contract, sendAsync, txStatus]
  );

  // Create a memoized executeBatch function for multiple calls
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
