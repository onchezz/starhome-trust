import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface InvestmentFormHeaderProps {
  isActive: boolean;
  onStatusChange: (checked: boolean) => void;
}

const InvestmentFormHeader: React.FC<InvestmentFormHeaderProps> = ({
  isActive,
  onStatusChange,
}) => {
  return (
    <CardHeader className="relative">
      <div className="flex items-center justify-between">
        <CardTitle>Create New Investment Property</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="investment-status">Investment Status</Label>
          <Switch
            id="investment-status"
            checked={isActive}
            onCheckedChange={onStatusChange}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default InvestmentFormHeader;