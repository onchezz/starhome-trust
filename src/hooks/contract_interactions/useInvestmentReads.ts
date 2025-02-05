import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useState, useEffect } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";
import { saveInvestments, getInvestments } from "@/utils/indexedDb";

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
    const fetchAndSaveInvestments = async () => {
      if (rawInvestmentProperties) {
        const investmentsArray = Array.isArray(rawInvestmentProperties) 
          ? rawInvestmentProperties 
          : Object.values(rawInvestmentProperties);
        const formatted = investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv));
        
        // Save to IndexedDB
        await saveInvestments(formatted);
        setFormattedProperties(formatted);
      } else {
        // Try to get from IndexedDB if no network data
        try {
          const cachedInvestments = await getInvestments();
          if (cachedInvestments.length > 0) {
            setFormattedProperties(cachedInvestments);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchAndSaveInvestments();
  }, [rawInvestmentProperties]);

  useEffect(() => {
    if (rawUserInvestments) {
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
    const fetchInvestment = async () => {
      if (rawInvestment) {
        const formatted = InvestmentAssetConverter.fromStarknetProperty(rawInvestment);
        setInvestment(formatted);
      } else {
        // Try to get from IndexedDB if no network data
        try {
          const cachedInvestments = await getInvestments();
          const cachedInvestment = cachedInvestments.find(inv => inv.id === id);
          if (cachedInvestment) {
            setInvestment(cachedInvestment);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchInvestment();
  }, [rawInvestment, id]);

  return {
    investment,
    isLoading,
    error
  };
};