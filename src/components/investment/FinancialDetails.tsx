import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvestmentAsset } from "@/types/starknet_types/investment";

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
          value={
            typeof formData.asset_value === "bigint"
              ? formData.asset_value.toString()
              : ""
          }
          onChange={(e) => handleInputChange("asset_value", e.target.value)}
          placeholder="Total asset value"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Staking Amount</Label>
        <Input
          type="number"
          required
          value={
            typeof formData.available_staking_amount === "bigint"
              ? formData.available_staking_amount.toString()
              : ""
          }
          onChange={(e) =>
            handleInputChange("available_staking_amount", e.target.value)
          }
          placeholder="Available amount for staking"
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Investment</Label>
        <Input
          type="number"
          required
          value={
            typeof formData.min_investment_amount === "bigint"
              ? formData.min_investment_amount.toString()
              : ""
          }
          onChange={(e) =>
            handleInputChange("min_investment_amount", e.target.value)
          }
          placeholder="Minimum investment required"
        />
      </div>

      <div className="space-y-2">
        <Label>Expected ROI (%)</Label>
        <Input
          type="number"
          required
          value={formData.expected_roi || ""}
          onChange={(e) => handleInputChange("expected_roi", e.target.value)}
          placeholder="Expected return on investment"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Rental Income</Label>
        <Input
          type="number"
          required
          value={
            typeof formData.rental_income === "bigint"
              ? formData.rental_income.toString()
              : ""
          }
          onChange={(e) => handleInputChange("rental_income", e.target.value)}
          placeholder="Expected annual rental income"
        />
      </div>

      <div className="space-y-2">
        <Label>Annual Maintenance Costs</Label>
        <Input
          type="number"
          required
          value={
            typeof formData.maintenance_costs === "bigint"
              ? formData.maintenance_costs.toString()
              : ""
          }
          onChange={(e) =>
            handleInputChange("maintenance_costs", e.target.value)
          }
          placeholder="Expected annual maintenance costs"
        />
      </div>
    </div>
  );
};

export default FinancialDetails;