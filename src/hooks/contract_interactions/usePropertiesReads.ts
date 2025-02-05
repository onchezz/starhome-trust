import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset } from "@/types/investment";
import { Property, PropertyConverter } from "@/types/property";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export const usePropertyRead = () => {
  const { data: rawProperties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const [saleProperties, setSaleProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (rawProperties) {
      const converted = (rawProperties as any[]).map(prop => 
        PropertyConverter.fromStarknetProperty(prop)
      );
      setSaleProperties(converted);
    }
  }, [rawProperties]);

  return {
    saleProperties,
    isLoading,
    error
  };
};

export const usePropertyReadById = (id: string) => {
  const { data: rawProperty, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (rawProperty) {
      const converted = PropertyConverter.fromStarknetProperty(rawProperty);
      setProperty(converted);
    }
  }, [rawProperty]);

  return {
    property,
    isLoading,
    error
  };
};

export const useAgentProperties = (address: string) => {
  const { data: rawProperties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: [address],
  });

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (rawProperties) {
      const converted = (rawProperties as any[]).map(prop => 
        PropertyConverter.fromStarknetProperty(prop)
      );
      setProperties(converted);
    }
  }, [rawProperties]);

  return {
    properties,
    isLoading,
    error
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
      setFormattedProperties(rawInvestmentProperties as InvestmentAsset[]);
    }
  }, [rawInvestmentProperties]);

  useEffect(() => {
    if (rawUserInvestments) {
      setFormattedInvestments(rawUserInvestments as InvestmentAsset[]);
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
      setInvestment(rawInvestment as InvestmentAsset);
    }
  }, [rawInvestment]);

  return {
    investment,
    isLoading,
    error
  };
};