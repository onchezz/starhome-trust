import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvestmentAsset } from "@/types/investment";
import { toast } from "sonner";

interface FinancialDetailsProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  formData,
  handleInputChange,
}) => {
  // Update Available Staking Amount when Asset Value changes
  useEffect(() => {
    if (formData.assetValue) {
      handleInputChange("availableStakingAmount", formData.assetValue);
    }
  }, [formData.assetValue]);

  const handleNonNegativeInput = (field: keyof InvestmentAsset, value: string) => {
    const numValue = Number(value);
    if (numValue < 0) {
      toast.error(`${field} cannot be negative`);
      return;
    }
    handleInputChange(field, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Asset Value</Label>
        <Input
          type="number"
          required
          min="0"
          value={formData.assetValue}
          onChange={(e) => handleNonNegativeInput("assetValue", e.target.value)}
          placeholder="Total asset value"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Staking Amount</Label>
        <Input
          type="number"
          required
          value={formData.availableStakingAmount}
          disabled
          placeholder="Same as Asset Value"
          className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Investment</Label>
        <Input
          type="number"
          required
          min="0"
          value={formData.minInvestmentAmount}
          onChange={(e) => handleNonNegativeInput("minInvestmentAmount", e.target.value)}
          placeholder="Minimum investment required"
        />
      </div>

      <div className="space-y-2">
        <Label>Expected ROI (%)</Label>
        <Input
          type="number"
          required
          min="0"
          value={formData.expectedRoi}
          onChange={(e) => handleNonNegativeInput("expectedRoi", e.target.value)}
          placeholder="Expected return on investment"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Rental Income</Label>
        <Input
          type="number"
          required
          min="0"
          value={formData.rentalIncome}
          onChange={(e) => handleNonNegativeInput("rentalIncome", e.target.value)}
          placeholder="Expected annual rental income"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Maintenance Costs</Label>
        <Input
          type="number"
          required
          min="0"
          value={formData.maintenanceCosts}
          onChange={(e) => handleNonNegativeInput("maintenanceCosts", e.target.value)}
          placeholder="Expected annual maintenance costs"
        />
      </div>
    </div>
  );
};

export default FinancialDetails;