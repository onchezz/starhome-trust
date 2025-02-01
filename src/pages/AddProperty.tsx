import { useState } from "react";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import BasicInformation from "@/components/property/form/BasicInformation";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import PricingInformation from "@/components/property/form/PricingInformation";
import ImageUploader from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";
import { InvestmentAsset } from "@/types/investment";
import { PropertyConverter } from "@/types/property";

const AddProperty = () => {
  const [formData, setFormData] = useState<Property>({} as Property);
  const { address } = useAccount();
  const { handleListInvestmentProperty, contractStatus } = usePropertyCreate();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      locationAddress: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Convert Property to InvestmentAsset
      const investmentAsset: InvestmentAsset = {
        id: formData.id || "",
        name: formData.title || "",
        description: formData.description || "",
        is_active: true,
        location: {
          address: formData.locationAddress || "",
          city: formData.city || "",
          state: formData.state || "",
          country: formData.country || "",
          latitude: formData.latitude || "",
          longitude: formData.longitude || "",
        },
        size: formData.area || 0,
        investor_id: address,
        owner: address,
        construction_status: "Completed",
        asset_value: formData.price || 0,
        available_staking_amount: formData.asking_price || 0,
        investment_type: formData.propertyType || "",
        construction_year: new Date().getFullYear(),
        property_price: formData.price || 0,
        expected_roi: formData.annualGrowthRate?.toString() || "0",
        rental_income: 0,
        maintenance_costs: 0,
        tax_benefits: "",
        highlights: "",
        market_analysis: "",
        risk_factors: "",
        legal_detail: "",
        additional_features: "",
        images: formData.imagesId || "",
        investment_token: formData.assetToken || "",
        min_investment_amount: formData.price ? formData.price * 0.1 : 0, // 10% of price as minimum investment
      };

      await handleListInvestmentProperty(investmentAsset);
      toast.success("Property listed successfully!");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto py-8">
      <BasicInformation 
        formData={formData} 
        handleInputChange={handleInputChange}
        address={address}
      />
      <PropertyLocation 
        formData={formData}
        handleLocationSelect={handleLocationSelect}
        isLocationLoading={isLocationLoading}
      />
      <PropertyFeatures 
        formData={formData} 
        handleInputChange={handleInputChange}
      />
      <PricingInformation 
        formData={formData} 
        handleInputChange={handleInputChange}
      />
      <ImageUploader 
        selectedFiles={[]}
        isUploading={false}
        uploadProgress={0}
        handleFileSelect={() => {}}
        handleDrop={() => {}}
        setSelectedFiles={() => {}}
      />
      <Button 
        type="submit" 
        disabled={contractStatus.isPending}
        className="w-full"
      >
        {contractStatus.isPending ? "Listing..." : "List Property"}
      </Button>
    </form>
  );
};

export default AddProperty;