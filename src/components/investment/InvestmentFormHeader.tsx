import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";


interface HeaderProps {
  isEditing?: boolean;
  name?: string;
}
const InvestmentFormHeader: React.FC<HeaderProps> = ({isEditing, name}) => {
  return (
    <CardHeader className="relative border-b dark:border-gray-800">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          {isEditing
            ? `Editing  ${name}  Asset `
            : "Create New Investment Property"}
        </CardTitle>
      </div>
    </CardHeader>
  );
};

export default InvestmentFormHeader;
