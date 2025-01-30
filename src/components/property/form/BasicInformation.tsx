import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property, propertyTypes, statusOptions } from "@/types/property";
import { tokenOptions } from "@/utils/constants";


interface BasicInformationProps {
  formData: Partial<Property>;
  handleInputChange: (field: keyof Property, value: any) => void;
  address?: string;
}

const BasicInformation = ({ formData, handleInputChange, address }: BasicInformationProps) => {
  return (
    <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2 group">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            required
            value={formData.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="transition-all duration-300 border-gray-200 focus:border-purple-500 hover:border-purple-400"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label className="text-sm font-medium">Description</Label>
          <Textarea
            required
            value={formData.description?.toString() || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="min-h-[100px] transition-all duration-300 border-gray-200 focus:border-purple-500 hover:border-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => handleInputChange("propertyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Asset Token</Label>
          <Select
            value={formData.assetToken}
            onValueChange={(value) => handleInputChange("assetToken", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {tokenOptions.map((token) => (
                <SelectItem key={token.symbol} value={token.address}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Agent Address</Label>
          <Input
            disabled
            value={formData.agentId}
            placeholder={address || "Agent Address"}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;