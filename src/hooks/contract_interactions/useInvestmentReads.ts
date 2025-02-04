import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";

type ContractResponse = string | { [key: string]: any };

export const useInvestorsForInvestment = (investmentId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investors_for_investment",
    args: [investmentId],
  });

  console.log("Investors for investment:", { investmentId, data, error });

  // Convert the data to an array if it exists, ensuring proper type handling
  const investors = data ? 
    Array.isArray(data) ? 
      data.filter((value: ContractResponse): value is string => typeof value === 'string') :
      Object.values(data as Record<string, ContractResponse>).filter((value): value is string => typeof value === 'string') : 
    [];

  return {
    investors,
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