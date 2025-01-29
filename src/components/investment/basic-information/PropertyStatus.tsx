import React from "react";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label>Construction Status</Label>
      <Select
        value={formData.constructionStatus}
        onValueChange={(value) => handleInputChange("constructionStatus", value)}
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
  );
};

export default PropertyStatus;