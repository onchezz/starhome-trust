import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/utils";

interface FinancialOverviewProps {
  propertyPrice: number;
  expectedRoi: string;
  rentalIncome: number;
  maintenanceCosts: number;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  propertyPrice,
  expectedRoi,
  rentalIncome,
  maintenanceCosts,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Financial Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-500">Property Price</p>
            <p className="text-2xl font-bold">{formatCurrency(propertyPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500">Expected ROI</p>
            <p className="text-2xl font-bold">{expectedRoi}%</p>
          </div>
          <div>
            <p className="text-gray-500">Annual Rental Income</p>
            <p className="text-2xl font-bold">{formatCurrency(rentalIncome)}</p>
          </div>
          <div>
            <p className="text-gray-500">Maintenance Costs</p>
            <p className="text-2xl font-bold">{formatCurrency(maintenanceCosts)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};