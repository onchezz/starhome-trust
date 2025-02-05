import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useState, useEffect } from "react";
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


export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const { data: rawInvestmentProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const { data: rawUserInvestments, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: [address || ""],
  });

  const [formattedProperties, setFormattedProperties] = useState<InvestmentAsset[]>([]);
  const [formattedInvestments, setFormattedInvestments] = useState<InvestmentAsset[]>([]);

  useEffect(() => {
    if (rawInvestmentProperties) {
      // Convert the raw data to an array if it isn't already
      const investmentsArray = Array.isArray(rawInvestmentProperties) 
        ? rawInvestmentProperties 
        : Object.values(rawInvestmentProperties);
      setFormattedProperties(investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv)));
    }
  }, [rawInvestmentProperties]);

  useEffect(() => {
    if (rawUserInvestments) {
      // Convert the raw data to an array if it isn't already
      const investmentsArray = Array.isArray(rawUserInvestments) 
        ? rawUserInvestments 
        : Object.values(rawUserInvestments);
      setFormattedInvestments(investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv)));
    }
  }, [rawUserInvestments]);

  return {
    investmentProperties: formattedProperties,
    userInvestments: formattedInvestments,
    isLoading: isLoadingProperties || isLoadingInvestments,
    error: null
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { data: rawInvestment, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
  });

  const [investment, setInvestment] = useState<InvestmentAsset | null>(null);

  useEffect(() => {
    if (rawInvestment) {
      setInvestment(InvestmentAssetConverter.fromStarknetProperty(rawInvestment));
    }
  }, [rawInvestment]);

  return {
    investment,
    isLoading,
    error
  };
};