import { useCallback, useState } from "react";
import { RpcProvider } from "starknet";
import { rpcProvideUr } from "@/utils/constants";

interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isRejected: boolean;
  isReverted: boolean;
  isLoading: boolean;
  receipt: any;
}

export const useTransactionStatus = () => {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkTransaction = useCallback(async (txHash: string): Promise<TransactionStatus> => {
    console.log("Checking transaction status for hash:", txHash);
    setIsChecking(true);
    
    try {
      const provider = new RpcProvider({ nodeUrl: rpcProvideUr });
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
      setStatus(transactionStatus);
      return transactionStatus;
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
  }, []);

  return {
    status,
    isChecking,
    checkTransaction
  };
};