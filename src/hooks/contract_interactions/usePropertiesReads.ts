import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset } from "@/types/investment";
import { Property } from "@/types/property";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export const usePropertyRead = () => {
  const { data: saleProperties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  return {
    saleProperties: saleProperties as Property[],
    isLoading,
    error
  };
};

export const usePropertyReadById = (id: string) => {
  const { data: property, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  return {
    property: property as Property,
    isLoading,
    error
  };
};

export const useAgentProperties = (address: string) => {
  const { data: properties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: [address],
  });

  return {
    properties: properties as Property[],
    isLoading,
    error
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const { data: investmentProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const { data: userInvestments, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: [address || ""],
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
    error: null
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { data: investment, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
  });

  return {
    investment: investment as InvestmentAsset,
    isLoading,
    error
  };
};