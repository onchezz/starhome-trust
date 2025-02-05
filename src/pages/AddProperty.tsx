import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { handleListSaleProperty, contractStatus } = usePropertyCreate();
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (location: any) => {
    setFormData((prev) => ({
      ...prev,
      ...location,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await handleListSaleProperty(formData);
      if (result.status === 'success') {
        toast.success("Property listed successfully!");
        navigate("/properties");
      }
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
          handleLocationSelect={handleLocationSelect}
          isLocationLoading={isLocationLoading}
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
          selectedFiles={[]}
          isUploading={false}
          uploadProgress={0}
          handleFileSelect={(e) => {
            const files = Array.from(e.target.files || []);
            handleInputChange('imagesId', files.map(f => URL.createObjectURL(f)));
          }}
          handleDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            handleInputChange('imagesId', files.map(f => URL.createObjectURL(f)));
          }}
          setSelectedFiles={() => {}}
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={contractStatus.isPending}
          >
            {contractStatus.isPending ? "Listing Property..." : "List Property"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;