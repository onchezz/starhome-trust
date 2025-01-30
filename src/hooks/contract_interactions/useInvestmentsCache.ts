import { useQuery } from "@tanstack/react-query";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useAccount } from "@starknet-react/core";

export const useInvestmentsCache = () => {
  const { address } = useAccount();

  const { data: rawInvestments, isLoading, error } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data } = await useStarHomeReadContract({
        functionName: "get_investment_properties",
        args: [],
      });
      return data;
    },
  });

  const investments = rawInvestments?.map((investment: any) =>
    InvestmentAssetConverter.fromStarknetProperty(investment)
  );

  const userInvestments = investments?.filter(
    (investment: InvestmentAsset) => investment.owner === address
  );

  return {
    investments,
    userInvestments,
    isLoading,
    error,
  };
};