import React, { useState, useEffect } from "react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});

  // Find the property being edited
  const property = properties?.find(p => p.id === id);

  useEffect(() => {
    if (property) {
      console.log("[EditProperty] Setting form data with property:", property);
      setFormData(property);
      
      // If property has images, create preview URLs
      if (property.imagesId) {
        console.log("[EditProperty] Processing images from imagesId:", property.imagesId);
        const { imageUrls } = parseImagesData(property.imagesId);
        console.log("[EditProperty] Generated image URLs:", imageUrls);
        
        // Convert image URLs to File objects for preview
        Promise.all(
          imageUrls.map(async (url, index) => {
            try {
              console.log("[EditProperty] Fetching image from URL:", url);
              const response = await fetch(url);
              const blob = await response.blob();
              const fileName = `property-image-${index + 1}.${blob.type.split('/')[1]}`;
              return new File([blob], fileName, { type: blob.type });
            } catch (error) {
              console.error("[EditProperty] Error loading image:", error);
              return null;
            }
          })
        ).then((files) => {
          const validFiles = files.filter((file): file is File => file !== null);
          console.log("[EditProperty] Created File objects for preview:", validFiles);
          setSelectedFiles(validFiles);
        });
      }
    }
  }, [property]);

  const handleInputChange = (field: keyof Property, value: any) => {
    console.log("[EditProperty] Updating field:", field, "with value:", value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: {
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
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      console.log("[EditProperty] New files selected:", newFiles);
      setSelectedFiles(newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      console.log("[EditProperty] Files dropped:", droppedFiles);
      setSelectedFiles(droppedFiles);
    }
  };

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