import { useState } from "react";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import { BasicInformation } from "@/components/property/form/BasicInformation";
import { PropertyLocation } from "@/components/property/form/PropertyLocation";
import { PropertyFeatures } from "@/components/property/form/PropertyFeatures";
import { PricingInformation } from "@/components/property/form/PricingInformation";
import { ImageUploader } from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";

const AddProperty = () => {
  const [formData, setFormData] = useState<Property>({} as Property);
  const { address } = useAccount();
  const { handleListInvestmentProperty, handleEditInvestmentProperty, contractStatus } = usePropertyCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // For now, we'll just list the property since we haven't implemented editing yet
      await handleListInvestmentProperty(formData);
      toast.success("Property listed successfully!");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BasicInformation formData={formData} setFormData={setFormData} />
      <PropertyLocation formData={formData} setFormData={setFormData} />
      <PropertyFeatures formData={formData} setFormData={setFormData} />
      <PricingInformation formData={formData} setFormData={setFormData} />
      <ImageUploader formData={formData} setFormData={setFormData} />
      <Button type="submit" disabled={contractStatus === "pending"}>
        {contractStatus === "pending" ? "Listing..." : "List Property"}
      </Button>
    </form>
  );
};

export default AddProperty;
