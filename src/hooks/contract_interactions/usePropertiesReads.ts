import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
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
      // Convert the raw data to an array if it isn't already
      const propertiesArray = Array.isArray(rawProperties) ? rawProperties : Object.values(rawProperties);
      const converted = propertiesArray.map(prop => 
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
      // Convert the raw data to an array if it isn't already
      const propertiesArray = Array.isArray(rawProperties) ? rawProperties : Object.values(rawProperties);
      const converted = propertiesArray.map(prop => 
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

