import { useMemo } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { PropertyConverter } from "@/types/property";

export const useAgentProperties = (agentId?: string) => {
  const { data, isLoading } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentId ? [agentId] : [],
  });

  const properties = useMemo(() => {
    if (!data) return [];
    return data.map((property: any) => ({
      ...PropertyConverter.fromStarknetProperty(property),
      agentId: property.agentId, // Use agentId instead of agent
    }));
  }, [data]);

  return { properties, isLoading };
};
