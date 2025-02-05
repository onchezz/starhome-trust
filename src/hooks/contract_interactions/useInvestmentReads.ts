import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";


export const useInvestorsForInvestment = (investmentId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investors_for_investment",
    args: [investmentId],
  });

  console.log("Investors for investment:", { investmentId, data, error });

  return {
    investors: data,
    isLoading,
    error,
  };
};

export const useInvestorBalance = (investmentId: string, investorAddress?: string) => {
  const { address } = useAccount();
  
  
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investor_balance_in_investment",
    args: [investmentId, address],
  });

  console.log("Investor balance:", { investmentId, investorAddress, data, error });

  return {
    balance: data ? Number(data)/Math.pow(10,6) : 0,
    isLoading,
    error,
  };
};