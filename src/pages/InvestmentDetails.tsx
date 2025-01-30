import React from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { toast } from "sonner";
import { shortString } from "starknet";
import { useInvestmentAssetReadById } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { useToken } from "@/hooks/contract_interactions/usetokensHook";
import { InvestmentGallery } from "@/components/investment/details/InvestmentGallery";
import { InvestmentLocation } from "@/components/investment/details/InvestmentLocation";
import { InvestmentProgress } from "@/components/investment/details/InvestmentProgress";
import { DocumentList } from "@/components/investment/details/DocumentList";
import { PropertyOverview } from "@/components/investment/details/PropertyOverview";
import { FinancialOverview } from "@/components/investment/details/FinancialOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InvestmentDetails = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = React.useState("");
  const { investment, isLoading } = useInvestmentAssetReadById(id || "");
  const { handleInvestInProperty } = usePropertyCreate();
  
  // Initialize token hook with investment token address
  const { approveAndInvest } = useToken(investment?.investment_token || "");

  const handleInvest = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!investmentAmount || isNaN(Number(investmentAmount))) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    try {
      await approveAndInvest(
        investmentAmount,
        id || "",
        handleInvestInProperty
      );
      
      toast.success("Investment successful!");
      setInvestmentAmount("");
    } catch (error) {
      console.error("Investment error:", error);
      toast.error(error instanceof Error ? error.message : "Investment failed");
    }
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

  const convertToList = (commaSeparatedString: string): string[] => {
    if (!commaSeparatedString) return [];
    return commaSeparatedString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!investment) {
    return <div>Investment not found</div>;
  }

  // Convert BigInt values to numbers
  const assetValue = Number(investment.asset_value || 0);
  const availableStakingAmount = Number(
    investment.available_staking_amount || 0
  );
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

  // Convert comma-separated strings to arrays
  const highlights = convertToList(getBigIntValue(investment.highlights));
  const marketAnalysis = convertToList(
    getBigIntValue(investment.market_analysis)
  );
  const riskFactors = convertToList(getBigIntValue(investment.risk_factors));
  const additionalFeatures = convertToList(
    getBigIntValue(investment.additional_features)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">
            {getBigIntValue(investment.name)}
          </h1>

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
              constructionStatus={getBigIntValue(
                investment.construction_status
              )}
            />
          </div>
          <FinancialOverview
            propertyPrice={propertyPrice}
            expectedRoi={getBigIntValue(investment.expected_roi)}
            rentalIncome={rentalIncome}
            maintenanceCosts={maintenanceCosts}
          />

          <InvestmentGallery
            imagesId={investment.images || ""}
            documentsId={investment.legal_detail || ""}
          />

          <InvestmentLocation location={location} />
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList documentsId={investment.legal_detail || ""} />
            </CardContent>
          </Card>

          {/* Additional Information Section with Bullet Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="text-gray-600">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {marketAnalysis.map((analysis, index) => (
                    <li key={index} className="text-gray-600">
                      {analysis}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {riskFactors.map((risk, index) => (
                    <li key={index} className="text-gray-600">
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {additionalFeatures.map((feature, index) => (
                    <li key={index} className="text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetails;
