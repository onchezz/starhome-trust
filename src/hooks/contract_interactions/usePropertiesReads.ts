import { useMemo } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { PropertyConverter } from "@/types/property";
import { openDB, getFromDB, saveToDB } from "@/utils/indexedDb";

export const usePropertyRead = () => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
    args: [],
  });

  const saleProperties = useMemo(() => {
    if (!data) return [];
    const properties = data.map((property: any) => 
      PropertyConverter.fromStarknetProperty(property)
    );
    
    // Save to IndexedDB
    saveToDB('properties', properties);
    return properties;
  }, [data]);

  return { saleProperties, isLoading, error };
};

export const usePropertyReadById = (propertyId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: propertyId ? [propertyId] : [],
  });

  const property = useMemo(() => {
    if (!data) return null;
    const convertedProperty = PropertyConverter.fromStarknetProperty(data);
    
    // Save to IndexedDB
    saveToDB('property', convertedProperty);
    return convertedProperty;
  }, [data]);

  return { property, isLoading, error };
};

export const useAgentProperties = (agentId?: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentId ? [agentId] : [],
  });

  const properties = useMemo(() => {
    if (!data) return [];
    const properties = data.map((property: any) => ({
      ...PropertyConverter.fromStarknetProperty(property),
      agentId: property.agentId,
    }));
    
    // Save to IndexedDB
    saveToDB('agentProperties', properties);
    return properties;
  }, [data]);

  return { properties, isLoading, error };
};