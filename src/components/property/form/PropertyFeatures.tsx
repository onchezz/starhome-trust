import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Property } from "@/types/property";

interface PropertyFeaturesProps {
  formData: Partial<Property>;
  handleInputChange: (field: keyof Property, value: any) => void;
}

const PropertyFeatures = ({ formData, handleInputChange }: PropertyFeaturesProps) => {
  return (
    <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-200">
      <h3 className="text-lg font-semibold text-gray-900">Property Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Area (sq ft)</Label>
          <Input
            type="number"
            required
            value={formData.area || ""}
            onChange={(e) => handleInputChange("area", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Input
            type="number"
            required
            value={formData.bedrooms || ""}
            onChange={(e) => handleInputChange("bedrooms", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Input
            type="number"
            required
            value={formData.bathrooms || ""}
            onChange={(e) => handleInputChange("bathrooms", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Parking Spaces</Label>
          <Input
            type="number"
            required
            value={formData.parking_spaces || ""}
            onChange={(e) => handleInputChange("parking_spaces", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
          <Label htmlFor="has_garden" className="cursor-pointer">Garden</Label>
          <Switch
            id="has_garden"
            checked={formData.has_garden || false}
            onCheckedChange={(checked) => handleInputChange("has_garden", checked)}
          />
        </div>
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
          <Label htmlFor="pet_friendly" className="cursor-pointer">Pet Friendly</Label>
          <Switch
            id="pet_friendly"
            checked={formData.pet_friendly || false}
            onCheckedChange={(checked) => handleInputChange("pet_friendly", checked)}
          />
        </div>
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
          <Label htmlFor="wheelchair_accessible" className="cursor-pointer">Wheelchair Accessible</Label>
          <Switch
            id="wheelchair_accessible"
            checked={formData.wheelchair_accessible || false}
            onCheckedChange={(checked) => handleInputChange("wheelchair_accessible", checked)}
          />
        </div>
        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
          <Label htmlFor="has_swimming_pool" className="cursor-pointer">Swimming Pool</Label>
          <Switch
            id="has_swimming_pool"
            checked={formData.has_swimming_pool || false}
            onCheckedChange={(checked) => handleInputChange("has_swimming_pool", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;