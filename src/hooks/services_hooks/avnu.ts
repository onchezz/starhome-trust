import { useContract, useSendTransaction } from "@starknet-react/core";
import type { Abi, Call } from "starknet";
import { useMemo, useCallback, useState } from "react";
import { starhomesContract } from "@/utils/constants";
import { starhomes_abi } from "@/data/starhomes_abi";
import { useGasless } from "./gassless";


interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
}

interface GaslessExecuteOptions {
  useGasless?: boolean;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function useStarHomeGaslessContract() {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  const { sendAsync, error, reset, status } = useSendTransaction({
    calls: undefined,
  });

  const [isGaslessEnabled, setIsGaslessEnabled] = useState(false);

  const {
    execute: executeGasless,
    selectGasToken,
    calculateGasEstimation,
    gasTokenPrices,
    selectedGasToken,
    estimatedFees,
    rewards,
    isLoading: isGaslessLoading,
    error: gaslessError,
    canExecute: canExecuteGasless,
  } = useGasless({
    onSuccess: (txHash) => {
      console.log(`Gasless transaction successful: ${txHash}`);
    },
    onError: (error) => {
      console.error('Gasless transaction failed:', error);
    },
  });

  const txStatus: TransactionStatus = useMemo(
    () => ({
      isError: status === "error" || Boolean(gaslessError),
      isSuccess: status === "success",
      isPending: status === "pending" || isGaslessLoading,
      error: error || (gaslessError ? new Error(gaslessError) : null),
      reset,
    }),
    [status, error, reset, gaslessError, isGaslessLoading]
  );

  // Convert contract calls to gasless format
  const convertToGaslessCalls = useCallback((functionName: string, args: any[]): Call[] => {
    if (!contract) return [];

    const processedArgs = args.map(arg => {
      if (typeof arg === 'boolean') {
        return arg ? 1 : 0;
      }
      return arg;
    });

    const call = contract.populate(functionName, processedArgs);
    return [{
      entrypoint: call.entrypoint,
      contractAddress: call.contractAddress,
      calldata: call.calldata,
    }];
  }, [contract]);

  const execute = useCallback(
    async (
      functionName: string, 
      args: any[], 
      options: GaslessExecuteOptions = {}
    ) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      const useGasless = options.useGasless ?? isGaslessEnabled;

      try {
        console.log(`Calling ${functionName} with args:`, args);
        
        const processedArgs = args.map(arg => {
          if (typeof arg === 'boolean') {
            return arg ? 1 : 0;
          }
          return arg;
        });

        const call = contract.populate(functionName, processedArgs);

        if (useGasless) {
          const gaslessCalls = [{
            entrypoint: call.entrypoint,
            contractAddress: call.contractAddress,
            calldata: call.calldata,
          }];

          // Calculate gas estimation if a token is selected
          if (selectedGasToken) {
            await calculateGasEstimation(gaslessCalls);
          }

          const response = await executeGasless(gaslessCalls);
          options.onSuccess?.(response.transactionHash);
          return { response, status: txStatus };
        } else {
          const response = await sendAsync([call]);
          return { response, status: txStatus };
        }
      } catch (err) {
        console.error(`Error executing ${functionName}:`, err);
        options.onError?.(err as Error);
        throw err;
      }
    },
    [contract, sendAsync, txStatus, executeGasless, isGaslessEnabled, selectedGasToken, calculateGasEstimation]
  );

  const executeBatch = useCallback(
    async (
      calls: { functionName: string; args: any[] }[], 
      options: GaslessExecuteOptions = {}
    ) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      const useGasless = options.useGasless ?? isGaslessEnabled;

      try {
        // Create all calls using the contract's populate method
        const populatedCalls = calls.map(({ functionName, args }) =>
          contract.populate(functionName, args)
        );
        
        if (useGasless) {
          const gaslessCalls = populatedCalls.map(call => ({
            entrypoint: call.entrypoint,
            contractAddress: call.contractAddress,
            calldata: call.calldata,
          }));

          // Calculate gas estimation if a token is selected
          if (selectedGasToken) {
            await calculateGasEstimation(gaslessCalls);
          }

          const response = await executeGasless(gaslessCalls);
          options.onSuccess?.(response.transactionHash);
          return { response, status: txStatus };
        } else {
          const response = await sendAsync(populatedCalls);
          return { response, status: txStatus };
        }
      } catch (err) {
        console.error("Error executing batch transaction:", err);
        options.onError?.(err as Error);
        throw err;
      }
    },
    [contract, sendAsync, txStatus, executeGasless, isGaslessEnabled, selectedGasToken, calculateGasEstimation]
  );

  return {
    contract,
    execute,
    executeBatch,
    status: txStatus,
    // Gasless specific returns
    gaslessState: {
      isEnabled: isGaslessEnabled,
      setEnabled: setIsGaslessEnabled,
      gasTokenPrices,
      selectedGasToken,
      selectGasToken,
      estimatedFees,
      rewards,
      canExecuteGasless,
    },
  };
}

// Example usage:
/*
function YourComponent() {
  const {
    execute,
    executeBatch,
    status,
    gaslessState: {
      isEnabled,
      setEnabled,
      gasTokenPrices,
      selectedGasToken,
      selectGasToken,
      estimatedFees,
      rewards,
    },
  } = useStarHomeGaslessContract();

  const handleTransaction = async () => {
    try {
      const result = await execute(
        "yourFunction",
        [arg1, arg2],
        {
          useGasless: true,
          onSuccess: (txHash) => {
            console.log("Transaction successful:", txHash);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enable Gasless Transactions
        </label>
      </div>

      {isEnabled && (
        <div>
          <h3>Select Gas Token:</h3>
          {gasTokenPrices.map((token) => (
            <button
              key={token.tokenAddress}
              onClick={() => selectGasToken(token)}
              disabled={token.tokenAddress === selectedGasToken?.tokenAddress}
            >
              {token.tokenAddress}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleTransaction}
        disabled={status.isPending}
      >
        {status.isPending ? "Processing..." : "Execute Transaction"}
      </button>
    </div>
  );
}
*/