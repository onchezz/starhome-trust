
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { useStarHomeWriteContract } from "@/hooks/contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";
import { useState } from "react";
import { useInvestmentWrite } from "./contract_interactions/useInvestmentWrite";
import { useSetTx, useTransactionStatus } from "./useTransactionStatus";
import { useTransactionReceipt } from "@starknet-react/core";

export const useInvestment = (tokenAddress?: string) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const {handleMakeInvestment, handleListInvestmentProperty, handleEditInvestmentProperty, status:contractStatus } = useInvestmentWrite();
  const { approveAndInvest, allowance, refreshTokenData, isWaitingApproval,isWaitingTransactionExecution ,setIsWaitingTransactionExecution } = useToken(tokenAddress);
  // const { execute } = useStarHomeWriteContract();
  // const { status: transactionStatus, checkTransaction } = useTransactionStatus();
  const {transactionHash,waitForTransaction} =  useSetTx();
  const { data:txData, error: txError } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
    enabled: true,
    retry: 9000,
  });

  const handleInvest = async (investmentId: string) => {
    try {
      if (!investmentAmount) {
        toast.error("Please enter an investment amount");
        return;
      }

      console.log("Starting investment process for:", {
        investmentId,
        amount: investmentAmount
      });

      // First approve the token spend
      await approveAndInvest(
        Number(investmentAmount), 
        investmentId,
        async (id: string, amount: number) => {
          console.log("Investment callback triggered with:", { id, amount });
        const tx =  await handleMakeInvestment(id,amount)
      await waitForTransaction(tx.response.transaction_hash)
      setIsWaitingTransactionExecution(false)
 
  
        // checkTransaction((tx.response.transaction_hash))
          
        }
      );
    } catch (error) {
      console.error("Investment error:", error);
      toast.error("Investment failed");
    }
  };

  return {
    investmentAmount,
    setInvestmentAmount,
    handleInvest,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    contractStatus,
    transactionHash,
    approveAndInvest,
    allowance,
    refreshTokenData,
    txData,
    isWaitingApproval,
    isWaitingTransactionExecution

  };
};