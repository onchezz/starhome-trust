import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import { BasicInformation } from "@/components/property/form/BasicInformation";
import { PropertyLocation } from "@/components/property/form/PropertyLocation";
import { PricingInformation } from "@/components/property/form/PricingInformation";
import { PropertyFeatures } from "@/components/property/form/PropertyFeatures";
import { ImageUploader } from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { useToast } from "@/components/ui/use-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = usePropertyRead();
  const { listProperty, isLoading: isListing } = usePropertyWrite();
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
      await listProperty(propertyData as Property);
      toast({
        title: "Property Listed",
        description: "Your property has been successfully listed.",
      });
      navigate("/properties");
    } catch (error) {
      console.error("Error listing property:", error);
      toast({
        title: "Error",
        description: "There was an error listing your property.",
      });
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
            propertyData={propertyData}
            setPropertyData={setPropertyData}
          />
        )}
        {currentStep === 2 && (
          <PropertyLocation
            propertyData={propertyData}
            setPropertyData={setPropertyData}
          />
        )}
        {currentStep === 3 && (
          <PricingInformation
            propertyData={propertyData}
            setPropertyData={setPropertyData}
          />
        )}
        {currentStep === 4 && (
          <PropertyFeatures
            propertyData={propertyData}
            setPropertyData={setPropertyData}
          />
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button onClick={handlePreviousStep}>Previous</Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={handleNextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isListing}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
