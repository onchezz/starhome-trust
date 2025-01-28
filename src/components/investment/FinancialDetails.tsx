import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvestmentAsset } from "@/types/investment";

interface FinancialDetailsProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Asset Value</Label>
        <Input
          type="number"
          required
          value={formData.assetValue}
          onChange={(e) => handleInputChange("assetValue", e.target.value)}
          placeholder="Total asset value"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Staking Amount</Label>
        <Input
          type="number"
          required
          value={formData.availableStakingAmount}
          // disabled
          onChange={(e) =>
            handleInputChange("availableStakingAmount", e.target.value)
          }
          placeholder={"Available amount for staking"}
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Investment</Label>
        <Input
          type="number"
          required
          value={formData.minInvestmentAmount}
          onChange={(e) =>
            handleInputChange("minInvestmentAmount", e.target.value)
          }
          placeholder="Minimum investment required"
        />
      </div>

      <div className="space-y-2">
        <Label>Expected ROI (%)</Label>
        <Input
          type="number"
          required
          value={formData.expectedRoi}
          onChange={(e) => handleInputChange("expectedRoi", e.target.value)}
          placeholder="Expected return on investment"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Rental Income</Label>
        <Input
          type="number"
          required
          value={formData.rentalIncome}
          onChange={(e) => handleInputChange("rentalIncome", e.target.value)}
          placeholder="Expected annual rental income"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Maintenance Costs</Label>
        <Input
          type="number"
          required
          value={formData.maintenanceCosts}
          onChange={(e) =>
            handleInputChange("maintenanceCosts", e.target.value)
          }
          placeholder="Expected annual maintenance costs"
        />
      </div>
    </div>
  );
};

export default FinancialDetails;
