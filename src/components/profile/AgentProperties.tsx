import { useAccount } from "@starknet-react/core";
import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { parseImagesData } from "@/utils/imageUtils";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";

export const AgentProperties = () => {
  const { address } = useAccount();
  const { properties, isLoading, error } = useAgentProperties(address || "");


  console.log("[AgentProperties] Current address:", address);
  console.log("[AgentProperties] Properties:", properties);
  console.log("[AgentProperties] Loading:", isLoading);
  console.log("[AgentProperties] Error:", error);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listed Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading properties</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listed Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!properties?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listed Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No properties listed yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listed Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => {
            return (
              <PropertyCard
                key={property.id}
                property={property}
                showUpdateButton={true}
                 withdraw={undefined}              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
