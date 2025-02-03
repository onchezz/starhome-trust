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
import { tokenOptions } from "@/utils/constants";

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

  // Find the property being edited - memoized to prevent unnecessary recalculations
  const property = React.useMemo(() => 
    properties?.find(p => p.id === id),
    [properties, id]
  );

  // Convert URLs to File objects for preview
  const convertUrlsToFiles = useCallback(async (urls: string[]) => {
    try {
      const filePromises = urls.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop() || 'image.jpg';
        return new File([blob], fileName, { type: blob.type });
      });
      
      const files = await Promise.all(filePromises);
      console.log("[EditProperty] Converted URLs to Files:", files);
      return files;
    } catch (error) {
      console.error("[EditProperty] Error converting URLs to files:", error);
      return [];
    }
  }, []);

  // Handle initial form data setup
  useEffect(() => {
    if (!property || formData.id) return;

    const initializeProperty = async () => {
      console.log("[EditProperty] Setting initial form data with property:", property);
      
      // Find the matching token option based on the saved asset token address
      const matchingToken = tokenOptions.find(token => 
        token.address.toLowerCase() === property.assetToken.toLowerCase()
      );
      
      console.log("[EditProperty] Matching token found:", matchingToken);

      // Set form data with the matched token
      setFormData({
        ...property,
        assetToken: matchingToken?.address || "" // Use the matched token address or empty string as fallback
      });
      
      if (property.imagesId) {
        console.log("[EditProperty] Processing images from imagesId:", property.imagesId);
        const { imageUrls } = parseImagesData(property.imagesId);
        console.log("[EditProperty] Generated image URLs:", imageUrls);
        
        const files = await convertUrlsToFiles(imageUrls);
        setSelectedFiles(files);
      }
    };

    initializeProperty();
  }, [property, formData.id, convertUrlsToFiles]);

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
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      console.log("[EditProperty] Files dropped:", droppedFiles);
      setSelectedFiles(prev => [...prev, ...droppedFiles]);
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
        <BasicInformation 
          formData={formData} 
          handleInputChange={handleInputChange}
          address={address}
        />
        
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