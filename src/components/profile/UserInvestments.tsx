import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestmentsCache } from "@/hooks/contract_interactions/useInvestmentsCache";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

export const UserInvestments = () => {
  const { userInvestments, isLoading } = useInvestmentsCache();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
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

  if (!userInvestments?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No investments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userInvestments.map((investment) => (
            <PropertyCard
              key={investment.id}
              id={investment.id}
              title={investment.name}
              location={{
                city: investment.location.city,
                state: investment.location.state,
                country: investment.location.country,
              }}
              price={investment.asset_value}
              askingPrice={investment.property_price}
              interestedClients={0}
              annualGrowthRate={investment.expected_roi}
              imagesUrl={investment.images}
              propertyType={investment.investment_type}
              status="active"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};