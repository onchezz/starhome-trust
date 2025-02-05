import { useInvestmentAssetsRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { InvestmentCard } from "@/components/investment/InvestmentCard";
import { EmptyInvestmentState } from "@/components/investment/EmptyInvestmentState";
import { PageLoader } from "@/components/ui/page-loader";
import { useState } from "react";
import { useConnect } from "@starknet-react/core";

export const Investment = () => {
  const { connect, connectors } = useConnect();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const { investmentProperties, isLoading, error } = useInvestmentAssetsRead();

  const handleConnectWallet = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

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
    <div className="container mx-auto py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investmentProperties.map((property) => (
          <InvestmentCard 
            key={property.id}
            property={property}
            expandedCardId={expandedCardId}
            setExpandedCardId={setExpandedCardId}
            handleConnectWallet={handleConnectWallet}
          />
        ))}
      </div>
    </div>
  );
};

export default Investment;