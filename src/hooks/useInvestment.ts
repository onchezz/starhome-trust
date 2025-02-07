
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { useStarHomeWriteContract } from "@/hooks/contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";
import { useState } from "react";
import { useInvestmentWrite } from "./contract_interactions/useInvestmentWrite";
import { useTransactionStatus } from "./useTransactionStatus";

export const useInvestment = (tokenAddress?: string) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { handleListInvestmentProperty, handleEditInvestmentProperty, status:contractStatus } = useInvestmentWrite();
  const { approveAndInvest, allowance, refreshTokenData, isWaitingApproval,isWaitingTransactionExecution } = useToken(tokenAddress);
  const { execute } = useStarHomeWriteContract();
  const { status: transactionStatus, checkTransaction } = useTransactionStatus();

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
          
          try {
            // Call the contract's invest function
            const response = await execute("invest_in_property", [
              id, // investment_id
              amount // amount
            ]);

            console.log("Contract investment response:", response.status);
            console.log("Contract investment response:", response.status.isSuccess);

            if (response?.status?.isSuccess) {
              toast.success("Investment successful!");
            } else if (response?.status?.isError) {
              toast.error("Investment failed");
              console.error("Investment error:", response?.status?.error);
            }
          } catch (error) {
            console.error("Contract call error:", error);
            toast.error("Failed to process investment");
            throw error;
          }
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
    approveAndInvest,
    allowance,
    refreshTokenData,
    transactionStatus,
    isWaitingApproval,
    isWaitingTransactionExecution

  };
};