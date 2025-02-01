import { useState } from 'react';
import { useToken } from './contract_interactions/usetokensHook';
import { toast } from 'sonner';
import { useAccount } from '@starknet-react/core';

export const useInvestment = (investmentToken: string | undefined) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { address } = useAccount();
  const { approveAndInvest } = useToken(investmentToken || "");

  const handleInvest = async (investmentId: string) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!investmentAmount || isNaN(Number(investmentAmount))) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    try {
      console.log("Starting investment process:", {
        investmentId,
        amount: investmentAmount,
        token: investmentToken
      });

      await approveAndInvest(
        Number(investmentAmount),
        investmentId
      );
      
      toast.success("Investment successful!");
      setInvestmentAmount("");
      
      return true;
    } catch (error) {
      console.error("Investment error:", error);
      toast.error(error instanceof Error ? error.message : "Investment failed");
      return false;
    }
  };

  return {
    investmentAmount,
    setInvestmentAmount,
    handleInvest
  };
};