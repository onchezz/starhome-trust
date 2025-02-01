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
      await approveAndInvest(Number(investmentAmount), investmentId, handleListInvestmentProperty);
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