import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/utils";

interface InvestmentProgressProps {
  assetValue: number;
  availableStakingAmount: number;
  minInvestmentAmount: number;
  investmentAmount: string;
  setInvestmentAmount: (amount: string) => void;
  handleInvest: () => void;
}

export const InvestmentProgress = ({
  assetValue,
  availableStakingAmount,
  minInvestmentAmount,
  investmentAmount,
  setInvestmentAmount,
  handleInvest,
}: InvestmentProgressProps) => {
  const progress = (assetValue - availableStakingAmount) / assetValue * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Investment Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Current Investment</span>
              <span>
                {formatCurrency(assetValue - availableStakingAmount)} of{" "}
                {formatCurrency(assetValue)}
              </span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Available for Investment</p>
              <p className="font-semibold">{formatCurrency(availableStakingAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Investment</p>
              <p className="font-semibold">{formatCurrency(minInvestmentAmount)}</p>
            </div>
          </div>
          <div>
            <Label>Investment Amount</Label>
            <Input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder={`Min. ${formatCurrency(minInvestmentAmount)}`}
              min={minInvestmentAmount}
            />
          </div>
          <Button onClick={handleInvest} className="w-full">
            Invest Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};