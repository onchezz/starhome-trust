import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { toast } from "sonner";
import { useState } from "react";

export const useInvestment = (tokenAddress?: string) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { handleListInvestmentProperty, handleEditInvestmentProperty, contractStatus } = usePropertyCreate();
  const { approveAndInvest } = useToken(tokenAddress || "");

  const handleInvest = async (investmentId: string) => {
    try {
      if (!investmentAmount) {
        toast.error("Please enter an investment amount");
        return;
      }

      // Call approveAndInvest with the correct callback function
      await approveAndInvest(
        Number(investmentAmount), 
        investmentId,
        async (id: string, amount: number) => {
          console.log("Investment callback triggered with:", { id, amount });
          // Here we could transform the data if needed before calling handleListInvestmentProperty
          // For now we'll just log the attempt
          console.log("Attempting to invest in property:", id, "with amount:", amount);
        }
      );
      
      toast.success("Investment successful!");
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
    approveAndInvest
  };
};