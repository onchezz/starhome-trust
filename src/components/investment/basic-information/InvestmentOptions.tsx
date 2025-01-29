import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokenOptions } from "@/utils/constants";
import { InvestmentAsset, investmentTypes } from "@/types/investment";

interface InvestmentOptionsProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const InvestmentOptions: React.FC<InvestmentOptionsProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Investment Type</Label>
        <Select
          value={formData.investmentType}
          onValueChange={(value) => handleInputChange("investmentType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select investment type" />
          </SelectTrigger>
          <SelectContent>
            {investmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Investment Token</Label>
        <Select
          value={formData.investmentToken}
          onValueChange={(value) => handleInputChange("investmentToken", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            {tokenOptions.map((token) => (
              <SelectItem key={token.symbol} value={token.address}>
                {token.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default InvestmentOptions;