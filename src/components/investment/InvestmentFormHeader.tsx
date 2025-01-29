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
    <CardHeader className="relative border-b dark:border-gray-800">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Create New Investment Property
        </CardTitle>
        <div className="flex items-center space-x-3">
          <Label htmlFor="investment-status" className="text-sm font-medium">
            Investment Status
          </Label>
          <Switch
            id="investment-status"
            checked={isActive}
            onCheckedChange={onStatusChange}
            className="data-[state=checked]:bg-primary"
          />
          <Label className="text-sm font-medium">
            {isActive ? `Active` : `Deactivated`}
          </Label>
        </div>
      </div>
    </CardHeader>
  );
};

export default InvestmentFormHeader;