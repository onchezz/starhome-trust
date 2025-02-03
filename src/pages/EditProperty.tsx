import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { Property } from "@/types/property";
import { useAccount } from "@starknet-react/core";
import BasicInformation from "@/components/property/form/BasicInformation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import ImageUploader from "@/components/property/form/ImageUploader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const { address } = useAccount();
  const { properties, isLoading, error } = useAgentProperties(address || "");
  const { handleEditProperty, contractStatus } = usePropertyCreate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const property = properties?.find(p => p.id === id);
  const [formData, setFormData] = useState<Partial<Property>>(property || {});

  const handleInputChange = (field: keyof Property, value: any) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading property</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-8 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
        
        <div className="space-y-6">
          <BasicInformation
            formData={formData}
            handleInputChange={handleInputChange}
            address={address}
          />

          <PricingInformation
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <PropertyFeatures
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <PropertyLocation
            formData={formData}
            handleInputChange={handleInputChange}
            handleLocationSelect={handleLocationSelect}
            isLocationLoading={isLocationLoading}
          />

          <ImageUploader
            selectedFiles={selectedFiles}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            handleFileSelect={handleFileSelect}
            handleDrop={handleDrop}
            setSelectedFiles={setSelectedFiles}
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={contractStatus.isPending}
              className="w-full md:w-auto"
            >
              {contractStatus.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Property
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}