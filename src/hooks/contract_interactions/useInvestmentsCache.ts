import { useQuery } from "@tanstack/react-query";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useAccount } from "@starknet-react/core";

export const useInvestmentsCache = () => {
  const { address } = useAccount();
  const { data: rawInvestments, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment_properties",
    args: [],
  });

  const { data: investments } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      if (!rawInvestments) return [];
      return (rawInvestments as any[]).map((inv: any) => 
        InvestmentAssetConverter.fromStarknetProperty(inv)
      );
    },
    enabled: !!rawInvestments,
  });

  const userInvestments = investments?.filter(
    (inv: InvestmentAsset) => inv.owner === address
  );

  return {
    investments,
    userInvestments,
    isLoading,
    error,
  };
};