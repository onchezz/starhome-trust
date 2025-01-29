import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";

const InvestmentFormHeader: React.FC = () => {
  return (
    <CardHeader className="relative border-b dark:border-gray-800">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Create New Investment Property
        </CardTitle>
      </div>
    </CardHeader>
  );
};

export default InvestmentFormHeader;