import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";

export const useInvestorsForInvestment = (investmentId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investors_for_investment",
    args: [investmentId],
  });

  console.log("Investors for investment:", { investmentId, data, error });

  return {
    investors: data as string[],
    isLoading,
    error,
  };
};

export const useInvestorBalance = (investmentId: string, investorAddress?: string) => {
  const { address } = useAccount();
  
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investor_balance_in_investment",
    args: [investmentId, investorAddress || address],
  });

  console.log("Investor balance:", { investmentId, investorAddress, data, error });

  return {
    balance: data ? Number(data) : 0,
    isLoading,
    error,
  };
};