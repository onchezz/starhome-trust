import { useMemo } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { PropertyConverter } from "@/types/property";

export const usePropertyRead = () => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
    args: [],
  });

  const saleProperties = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((property: any) => 
      PropertyConverter.fromStarknetProperty(property)
    );
  }, [data]);

  return { saleProperties, isLoading, error };
};

export const usePropertyReadById = (propertyId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property_by_id",
    args: propertyId ? [propertyId] : [],
  });

  const property = useMemo(() => {
    if (!data) return null;
    return PropertyConverter.fromStarknetProperty(data);
  }, [data]);

  return { property, isLoading, error };
};

export const useAgentProperties = (agentId?: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentId ? [agentId] : [],
  });

  const properties = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((property: any) => ({
      ...PropertyConverter.fromStarknetProperty(property),
      agentId: property.agentId,
    }));
  }, [data]);

  return { properties, isLoading, error };
};