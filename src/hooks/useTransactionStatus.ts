import { useCallback, useEffect, useState } from "react";
// import { RpcProvider } from "starknet";
// import { rpcProvideUr } from "@/utils/constants";
import { useProvider, useTransactionReceipt } from "@starknet-react/core";

interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isRejected: boolean;
  isReverted: boolean;
  isLoading: boolean;
  receipt: any;
}
interface TransactionStatus$1{
  finality_status:any,
  execution_status:any,
}

export const useTransactionStatus = () => {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [finalityStatus, setFinalityStatus] = useState<TransactionStatus$1 | null>(null);
  const [isChecking, setIsChecking] = useState(false);


 
  const { provider } = useProvider();



  const checkTransaction = useCallback(async (txHash: string): Promise<TransactionStatus> => {
    console.log("Checking transaction status for hash:", txHash);
    setIsChecking(true);
    
    try {
      // const provider = new RpcProvider({ nodeUrl: rpcProvideUr });
      const transaction = await provider.waitForTransaction(txHash);
      const transactionStatus = {
        isError: transaction.isError(),
        isSuccess: transaction.isSuccess(),
        isRejected: transaction.isRejected(),
        isReverted: transaction.isReverted(),
        isLoading: false,
        receipt: transaction.statusReceipt
      };


      console.log("Transaction status:", transactionStatus);
    
      return { ...transactionStatus, };
    } catch (error) {
      console.error("Error checking transaction status:", error);
      const errorStatus = {
        isError: true,
        isSuccess: false,
        isRejected: false,
        isReverted: false,
        isLoading: false,
        receipt: null
      };
      setStatus(errorStatus);
      return errorStatus;
    } finally {
      setIsChecking(false);
    }
  }, [provider]);

  return {
    status,
    isChecking,
    checkTransaction
  };
};



interface UseTransactionStatusReturn {
  transactionHash: string;
  isWaiting: boolean;
  error: Error | null;
  waitForTransaction: (hash: string) => Promise<void>;
  reset: () => void;
}

export const useSetTx = (): UseTransactionStatusReturn => {
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { provider } = useProvider();

  const reset = useCallback(() => {
    setTransactionHash('');
    setIsWaiting(false);
    setError(null);
  }, []);

  const waitForTransaction = useCallback(async (hash: string): Promise<void> => {
     
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          if (!hash) {
            throw new Error('Transaction hash is required');
          }

          console.log(`Received tx ${hash}`);
          setTransactionHash(hash);
          setIsWaiting(true);
          setError(null);

          // Add your transaction check logic here
          // Example implementation:
          // const status = await provider.getTransaction(hash);
          
          // if (status. === 'confirmed') {
          //   setIsWaiting(false);
          //   resolve();
          // } else if (status === 'failed') {
          //   setIsWaiting(false);
          //   const error = new Error('Transaction failed');
          //   setError(error);
          //   reject(error);
          // } else {
          //   // Transaction still pending
          //   setTimeout(checkTransaction, 2000);
          // }

          // Temporary implementation (remove this when adding real logic):
          // setTimeout(() => {
          //   setIsWaiting(false);
          //   resolve();
          // }, 2000);

        } catch (error) {
          setIsWaiting(false);
          const errorObject = error instanceof Error ? error : new Error('Unknown error occurred');
          setError(errorObject);
          reject(errorObject);
        }
      };

      checkTransaction();
    });
  }, []);

  return {
    transactionHash,
    isWaiting,
    error,
    waitForTransaction,
    reset
  };
};

// Usage example:
/*
const MyComponent = () => {
  const { 
    transactionHash, 
    isWaiting, 
    error, 
    waitForTransaction,
    reset 
  } = useTransactionStatus();

  const handleTransaction = async () => {
    try {
      // Example transaction hash
      await waitForTransaction('0x123...');
      console.log('Transaction confirmed!');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div>
      {isWaiting && <p>Waiting for transaction: {transactionHash}</p>}
      {error && <p>Error: {error.message}</p>}
      <button onClick={handleTransaction}>Send Transaction</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
*/