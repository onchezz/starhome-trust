import { useState } from 'react';
import { useToken } from './contract_interactions/usetokensHook';
import { usePropertyCreate } from './contract_interactions/usePropertiesWrite';
import { toast } from 'sonner';
import { useAccount } from '@starknet-react/core';

export const useInvestment = (investmentToken: string | undefined) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const { address } = useAccount();
  const { handleListInvestmentProperty } = usePropertyCreate();
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

      // Convert investmentAmount to number before passing
      const amount = Number(investmentAmount);
      
      await approveAndInvest(
        amount,
        investmentId,
        async (id: string, amt: number) => {
          console.log("Investing with amount:", amt, "in property:", id);
          // Additional logic if needed
          return Promise.resolve();
        }
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