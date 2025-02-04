import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import BasicInformation from "@/components/property/form/BasicInformation";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import ImageUploader from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddProperty = () => {
  const navigate = useNavigate();
  const { handleListProperty, isLoading } = usePropertyCreate();
  const [formData, setFormData] = useState<Partial<Property>>({});

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await handleListProperty(formData as Property);
      toast.success("Property listed successfully!");
      navigate("/properties");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Add New Property</h1>
      
      <div className="space-y-8">
        <BasicInformation 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <PropertyLocation 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <PricingInformation 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <PropertyFeatures 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <ImageUploader 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Listing Property..." : "List Property"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;