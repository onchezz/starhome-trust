import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvestmentAsset } from "@/types/investment";

interface PropertyDetailsProps {
  formData: Partial<InvestmentAsset>;
  handleInputChange: (field: keyof InvestmentAsset, value: any) => void;
  editMode?: boolean;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  formData,
  handleInputChange,
  editMode = false,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          required
          value={formData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter investment property name"
          disabled={editMode}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          required
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter detailed property description"
          disabled={editMode}
        />
      </div>

      <div className="space-y-2">
        <Label>Size (sq ft)</Label>
        <Input
          type="number"
          required
          value={formData.size || ""}
          onChange={(e) => handleInputChange("size", Number(e.target.value))}
          placeholder="Enter property size"
          disabled={editMode}
        />
      </div>

      <div className="space-y-2">
        <Label>Construction Year</Label>
        <Input
          type="number"
          required
          min={1800}
          max={new Date().getFullYear()}
          value={formData.construction_year || ""}
          onChange={(e) => handleInputChange("construction_year", Number(e.target.value))}
          placeholder="Enter year of construction"
          disabled={editMode}
        />
      </div>
    </>
  );
};

export default PropertyDetails;