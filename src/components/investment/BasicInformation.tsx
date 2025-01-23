import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InvestmentAsset } from "@/types/starknet_types/investment";
import { tokenOptions } from "@/utils/constants";
import {
  investmentTypes,
  zoningTypes,
  constructionStatus,
} from "@/types/starknet_types/investment";

interface BasicInformationProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          required
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Investment property name"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          required
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Detailed property description"
        />
      </div>

      <div className="space-y-2">
        <Label>Size (sq ft)</Label>
        <Input
          type="number"
          required
          value={formData.size || ""}
          onChange={(e) => handleInputChange("size", e.target.value)}
          placeholder="Property size"
        />
      </div>

      <div className="space-y-2">
        <Label>Construction Status</Label>
        <Select
          value={formData.construction_status}
          onValueChange={(value) =>
            handleInputChange("construction_status", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {constructionStatus.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Investment Type</Label>
        <Select
          value={formData.investment_type}
          onValueChange={(value) => handleInputChange("investment_type", value)}
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
          value={formData.investment_token}
          onValueChange={(value) => handleInputChange("investment_token", value)}
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

      <div className="space-y-2">
        <Label>Investment Status</Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.is_active || false}
            onCheckedChange={(checked) =>
              handleInputChange("is_active", checked)
            }
          />
          <Label>Active</Label>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;