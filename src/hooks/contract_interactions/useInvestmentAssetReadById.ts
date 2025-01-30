import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";

export const useInvestmentAssetReadById = (id: string) => {
  console.log("[useInvestmentAssetReadById] Reading investment with ID:", id);

  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
  });

  return {
    data,
    isLoading,
    error,
  };
};