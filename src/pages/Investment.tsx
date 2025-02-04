import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { InvestmentCard } from "@/components/investment/InvestmentCard";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import { PageLoader } from "@/components/ui/page-loader";

export const Investment = () => {
  const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    console.error("Error loading investments:", error);
    return <div>Error loading investments</div>;
  }

  if (!investmentProperties?.length) {
    return <EmptyInvestmentState />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentProperties.map((investment) => (
          <InvestmentCard key={investment.id} {...investment} />
        ))}
      </div>
    </div>
  );
};

export default Investment;