import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/types/property";

interface PricingInformationProps {
  formData: Partial<Property>;
  handleInputChange: (field: keyof Property, value: any) => void;
}

const PricingInformation = ({ formData, handleInputChange }: PricingInformationProps) => {
  return (
    <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-100">
      <h3 className="text-lg font-semibold text-gray-900">
        Pricing Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            required
            value={formData.price ? Number(formData.price.toString()) : ""}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="asking-price">Asking Price</Label>
          <Input
            id="asking-price"
            type="number"
            required
            value={
              formData.asking_price
                ? Number(formData.asking_price.toString())
                : ""
            }
            onChange={(e) => handleInputChange("asking_price", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Annual Growth Rate (%)</Label>
          <Input
            type="number"
            value={
              formData.annualGrowthRate
                ? formData.annualGrowthRate.toString()
                : ""
            }
            onChange={(e) =>
              handleInputChange("annualGrowthRate", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PricingInformation;