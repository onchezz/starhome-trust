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
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

const AddProperty = () => {
  const navigate = useNavigate();
  const { isLoading } = usePropertyRead();
  const { handleListSaleProperty, contractStatus } = usePropertyCreate();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyData, setPropertyData] = useState<Partial<Property>>({});

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      await handleListSaleProperty(propertyData);
      toast.success("Property has been successfully listed");
      navigate("/properties");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Add New Property</h1>
        
        {currentStep === 1 && (
          <BasicInformation
            formData={propertyData}
            handleInputChange={(field, value) => 
              setPropertyData(prev => ({ ...prev, [field]: value }))
            }
          />
        )}
        {currentStep === 2 && (
          <PropertyLocation
            formData={propertyData}
            handleInputChange={(field, value) => 
              setPropertyData(prev => ({ ...prev, [field]: value }))
            }
            isLocationLoading={false}
            handleLocationSelect={(location) => {
              setPropertyData(prev => ({
                ...prev,
                locationAddress: location.address,
                city: location.city,
                state: location.state,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude
              }));
            }}
          />
        )}
        {currentStep === 3 && (
          <PricingInformation
            formData={propertyData}
            handleInputChange={(field, value) => 
              setPropertyData(prev => ({ ...prev, [field]: value }))
            }
          />
        )}
        {currentStep === 4 && (
          <PropertyFeatures
            formData={propertyData}
            handleInputChange={(field, value) => 
              setPropertyData(prev => ({ ...prev, [field]: value }))
            }
          />
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button onClick={handlePreviousStep}>Previous</Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={contractStatus.isPending}
            >
              {contractStatus.isPending ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProperty;