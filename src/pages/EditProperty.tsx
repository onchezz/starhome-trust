import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BasicInformation from "@/components/property/form/BasicInformation";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import ImageUploader from "@/components/property/form/ImageUploader";
import { parseImagesData } from "@/utils/imageUtils";
import { useAccount } from "@starknet-react/core";

const EditProperty = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const { properties } = useAgentProperties(address || "");
  const { handleEditProperty, contractStatus } = usePropertyCreate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});

  // Find the property being edited - memoized to prevent unnecessary recalculations
  const property = React.useMemo(() => 
    properties?.find(p => p.id === id),
    [properties, id]
  );

  // Handle initial form data setup
  useEffect(() => {
    if (property && !formData.id) {  // Only set initial data if not already set
      console.log("[EditProperty] Setting initial form data with property:", property);
      setFormData(property);
      
      if (property.imagesId) {
        console.log("[EditProperty] Processing images from imagesId:", property.imagesId);
        const { imageUrls } = parseImagesData(property.imagesId);
        console.log("[EditProperty] Generated image URLs:", imageUrls);
        setExistingImages(imageUrls);
      }
    }
  }, [property, formData.id]);  // Only run when property changes or form is reset

  const handleInputChange = useCallback((field: keyof Property, value: any) => {
    console.log("[EditProperty] Updating field:", field, "with value:", value);
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLocationSelect = useCallback((location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      locationAddress: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      console.log("[EditProperty] New files selected:", newFiles);
      setSelectedFiles(newFiles);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      console.log("[EditProperty] Files dropped:", droppedFiles);
      setSelectedFiles(droppedFiles);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await handleEditProperty(id, formData);
      toast.success("Property updated successfully!");
    } catch (error) {
      console.error("[EditProperty] Error updating property:", error);
      toast.error("Failed to update property");
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInformation formData={formData} handleInputChange={handleInputChange} />
        
        <PropertyLocation
          formData={formData}
          handleLocationSelect={handleLocationSelect}
          isLocationLoading={isLocationLoading}
          handleInputChange={handleInputChange}
        />
        
        <PricingInformation formData={formData} handleInputChange={handleInputChange} />
        
        <PropertyFeatures formData={formData} handleInputChange={handleInputChange} />

        {existingImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Property image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <ImageUploader
          selectedFiles={selectedFiles}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          handleFileSelect={handleFileSelect}
          handleDrop={handleDrop}
          setSelectedFiles={setSelectedFiles}
        />

        <Button 
          type="submit" 
          disabled={contractStatus.isPending}
          className="w-full"
        >
          {contractStatus.isPending ? "Updating Property..." : "Update Property"}
        </Button>
      </form>
    </div>
  );
};

export default EditProperty;