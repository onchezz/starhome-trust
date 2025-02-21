
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { toast } from "sonner";
import { useState } from "react";
import { useSetTx, useTransactionStatus } from "./useTransactionStatus";
import { useTransactionReceipt } from "@starknet-react/core";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";


export const useProperty = (tokenAddress?: string) => {
  
  const {payForProperty, contractStatus } = usePropertyWrite();
  const { approveAndInvest, allowance, refreshTokenData, isWaitingApproval, } = useToken(tokenAddress);
  const [isWaitingTransactionExecution, setIsWaitingTransactionExecution] = useState(false);

  // const { execute } = useStarHomeWriteContract();
  // const { status: transactionStatus, checkTransaction } = useTransactionStatus();
  const {transactionHash,waitForTransaction} =  useSetTx();
  const { data:txData, error: txError } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
    enabled: true,
    retry: 9000,
  });

  const handlePayForProperty = async (propertyId: string,amount:number) => {
  console.error("Investment tx status :", isWaitingTransactionExecution);
    try {
      if (!amount) {
        toast.error("Please enter an investment amount");
        setIsWaitingTransactionExecution(false)
        return;
      }

      console.log("Starting buying  process for:", {
        propertyId,
        amount
      });
      setIsWaitingTransactionExecution(true)

      // First approve the token spend
      await approveAndInvest(
        Number(amount), 
        propertyId,
        async (id: string, amount: number) => {
          console.log("Investment callback triggered with:", { id, amount });
        const tx =  await payForProperty(id,amount)
        setIsWaitingTransactionExecution(false)
      await waitForTransaction(tx.status.response.transaction_hash)
      
          
        }
      );
      setIsWaitingTransactionExecution(false)
    } catch (error) {
  console.error("Investment tx status :", isWaitingTransactionExecution);
      console.error("Investment error:", error);
           console.error("Investment tx status :", isWaitingTransactionExecution);
      toast.error("Investment failed");
    }
    console.error("Investment tx status :", isWaitingTransactionExecution);
        setIsWaitingTransactionExecution(false)
  };

  return {
    handlePayForProperty,
    contractStatus,
    transactionHash,
    allowance,
    refreshTokenData,
    txData,
    isWaitingApproval,
    isWaitingTransactionExecution,
    setIsWaitingTransactionExecution

  };
};