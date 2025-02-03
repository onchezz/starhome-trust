import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { useStarHomeWriteContract } from "@/hooks/contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";
import { useState } from "react";
import { num } from "starknet";

export const useInvestment = (tokenAddress?: string) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { handleListInvestmentProperty, handleEditInvestmentProperty, contractStatus } = usePropertyCreate();
  const { approveAndInvest, allowance, balance } = useToken(tokenAddress || "");
  const { execute } = useStarHomeWriteContract();

  const handleInvest = async (investmentId: string) => {
    try {
      if (!investmentAmount) {
        toast.error("Please enter an investment amount");
        return;
      }

      const amount = Number(investmentAmount);
      
      // Check balance and allowance before proceeding
      const currentAllowance = allowance ? Number(allowance) / Math.pow(10, 6) : 0;
      const currentBalance = balance ? Number(balance) / Math.pow(10, 6) : 0;

      console.log("Investment checks:", {
        requestedAmount: amount,
        currentAllowance,
        currentBalance
      });

      if (currentBalance < amount) {
        toast.error("Insufficient balance");
        return;
      }

      if (currentAllowance < amount) {
        toast.info("Approving token spend...");
      }

      // First approve the token spend
      await approveAndInvest(
        amount, 
        investmentId,
        async (id: string, amount: number) => {
          console.log("Investment callback triggered with:", { id, amount });
          
          try {
            // Convert the amount to a valid uint256 string
            const amountInWei = num.toBigInt(amount.toString());
            console.log("Converted amount:", amountInWei.toString());

            // Call the contract's invest function with the properly formatted amount
            const response = await execute("invest_in_property", [
              id,
              amountInWei.toString()
            ]);

            console.log("Contract investment response:", response);

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
    allowance: allowance ? Number(allowance) / Math.pow(10, 6) : 0,
    balance: balance ? Number(balance) / Math.pow(10, 6) : 0
  };
};