import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvestmentAsset, constructionStatus } from "@/types/investment";

interface PropertyStatusProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const PropertyStatus: React.FC<PropertyStatusProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Construction Status</Label>
        <Select
          value={formData.constructionStatus}
          onValueChange={(value) => handleInputChange("constructionStatus", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select construction status" />
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
        <Label>Investment Status</Label>
        <div className="flex items-center space-x-3">
          <Switch
            id="investment-status"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="investment-status" className="text-sm font-medium">
            {formData.isActive ? `Active` : `Deactivated`}
          </Label>
        </div>
      </div>
    </>
  );
};

export default PropertyStatus;