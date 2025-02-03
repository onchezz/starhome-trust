import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import { toast } from "sonner";
import { parseImagesData } from "@/utils/imageUtils";
import BasicInformation from "@/components/property/form/BasicInformation";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import ImageUploader from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";

const EditProperty = () => {
  const { id } = useParams();
  const { properties } = useAgentProperties();
  const { handleEditProperty, contractStatus } = usePropertyCreate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Find the property being edited
  const property = properties?.find(p => p.id === id);
  
  // Initialize form data with property data
  const [formData, setFormData] = useState<Partial<Property>>({});

  // Update form data when property data is loaded
  useEffect(() => {
    if (property) {
      console.log("Setting form data with property:", property);
      setFormData(property);
      
      // If property has images, create preview URLs
      if (property.imagesId) {
        const { imageUrls } = parseImagesData(property.imagesId);
        // Convert image URLs to File objects for preview
        Promise.all(
          imageUrls.map(async (url) => {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              return new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
            } catch (error) {
              console.error("Error loading image:", error);
              return null;
            }
          })
        ).then((files) => {
          const validFiles = files.filter((file): file is File => file !== null);
          setSelectedFiles(validFiles);
        });
      }
    }
  }, [property]);

  const handleInputChange = (field: keyof Property, value: any) => {
    console.log("Updating field:", field, "with value:", value);
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
      location_address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await handleEditProperty(id, formData);
      toast.success("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
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