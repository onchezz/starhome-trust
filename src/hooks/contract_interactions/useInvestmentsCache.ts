import { useQuery } from "@tanstack/react-query";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useAccount } from "@starknet-react/core";

export const useInvestmentsCache = () => {
  const { address } = useAccount();
  const { data: contractData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment_properties",
    args: [],
  });

  const { data: rawInvestments } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => contractData,
    enabled: !!contractData,
  });

  console.log("[useInvestmentsCache] Raw investments:", rawInvestments);

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