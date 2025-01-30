import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";
import { shortString } from "starknet";
import { useInvestmentAssetReadById } from "@/hooks/contract_interactions/usePropertiesReads";
import { InvestmentGallery } from "@/components/investment/details/InvestmentGallery";
import { InvestmentLocation } from "@/components/investment/details/InvestmentLocation";
import { InvestmentHeader } from "@/components/investment/details/InvestmentHeader";
import { InvestmentProgress } from "@/components/investment/details/InvestmentProgress";
import { DocumentList } from "@/components/investment/details/DocumentList";
import { PropertyOverview } from "@/components/investment/details/PropertyOverview";
import { FinancialOverview } from "@/components/investment/details/FinancialOverview";
import { formatCurrency } from "@/utils/utils";

const InvestmentDetails = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { investment, isLoading } = useInvestmentAssetReadById(id || "");

  const handleInvest = () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!investmentAmount || isNaN(Number(investmentAmount))) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    console.log("Investing amount:", investmentAmount);
    toast.success("Investment initiated");
  };

  const getBigIntValue = (value: any): string => {
    if (!value) return "";
    if (typeof value === "object" && value._type === "BigInt") {
      return shortString.decodeShortString(value.value.toString());
    }
    if (typeof value === "object" && value.value) {
      return value.value.toString();
    }
    return String(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!investment) {
    return <div>Investment not found</div>;
  }

  // Convert BigInt values to numbers
  const assetValue = Number(investment.asset_value || 0);
  const availableStakingAmount = Number(investment.available_staking_amount || 0);
  const minInvestmentAmount = Number(investment.min_investment_amount || 0);
  const propertyPrice = Number(investment.property_price || 0);
  const rentalIncome = Number(investment.rental_income || 0);
  const maintenanceCosts = Number(investment.maintenance_costs || 0);
  const size = Number(investment.size || 0);
  const constructionYear = Number(investment.construction_year || 0);

  // Get location data
  const location = {
    latitude: Number(getBigIntValue(investment.location?.latitude)),
    longitude: Number(getBigIntValue(investment.location?.longitude)),
    address: getBigIntValue(investment.location?.address),
    city: getBigIntValue(investment.location?.city),
    state: getBigIntValue(investment.location?.state),
    country: getBigIntValue(investment.location?.country),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <InvestmentHeader
            name={getBigIntValue(investment.name)}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InvestmentProgress
              assetValue={assetValue}
              availableStakingAmount={availableStakingAmount}
              minInvestmentAmount={minInvestmentAmount}
              investmentAmount={investmentAmount}
              setInvestmentAmount={setInvestmentAmount}
              handleInvest={handleInvest}
            />

            <PropertyOverview
              investmentType={getBigIntValue(investment.investment_type)}
              size={size}
              constructionYear={constructionYear}
              constructionStatus={getBigIntValue(investment.construction_status)}
            />
          </div>

          <InvestmentGallery 
            imagesId={investment.images || ""} 
            documentsId={investment.legal_detail || ""}
          />

          <InvestmentLocation location={location} />

          <FinancialOverview
            propertyPrice={propertyPrice}
            expectedRoi={getBigIntValue(investment.expected_roi)}
            rentalIncome={rentalIncome}
            maintenanceCosts={maintenanceCosts}
          />

          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetContent className="w-[400px]">
              <div className="space-y-6 py-6">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Highlights</h4>
                    <p className="text-sm text-gray-600">
                      {getBigIntValue(investment.highlights)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Market Analysis</h4>
                    <p className="text-sm text-gray-600">
                      {getBigIntValue(investment.market_analysis)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <p className="text-sm text-gray-600">
                      {getBigIntValue(investment.risk_factors)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Legal Details</h4>
                    <DocumentList documentsId={investment.legal_detail || ""} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Additional Features</h4>
                    <p className="text-sm text-gray-600">
                      {getBigIntValue(investment.additional_features)}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;