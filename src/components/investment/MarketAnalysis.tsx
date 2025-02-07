import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvestmentAsset } from "@/types/investment";

interface MarketAnalysisProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({
  formData,
  handleInputChange,
}) => {
  console.log(`received market analyses: ${formData.market_analysis}`);
  const marketAnalysis = formData.market_analysis
    ? JSON.parse(formData.market_analysis)
    : {};

  const handleMarketAnalysisChange = (field: string, value: string) => {
    const updatedAnalysis = {
      ...marketAnalysis,
      [field]: value,
    };
    handleInputChange("market_analysis", JSON.stringify(updatedAnalysis));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Market Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="dark:text-gray-200">Area Growth Rate (%)</Label>
          <Input
            required
            value={marketAnalysis.area_growth || ""}
            onChange={(e) =>
              handleMarketAnalysisChange("area_growth", e.target.value)
            }
            placeholder="Annual area growth rate"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="dark:text-gray-200">Occupancy Rate (%)</Label>
          <Input
            required
            value={marketAnalysis.occupancy_rate || ""}
            onChange={(e) =>
              handleMarketAnalysisChange("occupancy_rate", e.target.value)
            }
            placeholder="Current occupancy rate"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="dark:text-gray-200">Comparable Properties</Label>
          <Input
            required
            value={marketAnalysis.comparable_properties || ""}
            onChange={(e) =>
              handleMarketAnalysisChange(
                "comparable_properties",
                e.target.value
              )
            }
            placeholder="Similar properties in the area"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label className="dark:text-gray-200">Demand Trend</Label>
          <Input
            required
            value={marketAnalysis.demand_trend || ""}
            onChange={(e) =>
              handleMarketAnalysisChange("demand_trend", e.target.value)
            }
            placeholder="Current market demand trend"
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
