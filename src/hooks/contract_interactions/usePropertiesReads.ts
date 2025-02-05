import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset } from "@/types/investment";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const { data: investmentProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    functionName: "get_all_investment_properties",
  });

  const { data: userInvestments, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_user_investments",
    args: [address],
    watch: true,
  });

  const [formattedProperties, setFormattedProperties] = useState<InvestmentAsset[]>([]);
  const [formattedInvestments, setFormattedInvestments] = useState<InvestmentAsset[]>([]);

  useEffect(() => {
    if (investmentProperties) {
      setFormattedProperties(investmentProperties as InvestmentAsset[]);
    }
  }, [investmentProperties]);

  useEffect(() => {
    if (userInvestments) {
      setFormattedInvestments(userInvestments as InvestmentAsset[]);
    }
  }, [userInvestments]);

  return {
    investmentProperties: formattedProperties,
    userInvestments: formattedInvestments,
    isLoading: isLoadingProperties || isLoadingInvestments,
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { data: investment, isLoading } = useStarHomeReadContract({
    functionName: "get_investment_property",
    args: [id],
  });

  return {
    investment: investment as InvestmentAsset,
    isLoading,
  };
};