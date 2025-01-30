/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import BasicInformation from "@/components/property/form/BasicInformation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import ImageUploader from "@/components/property/form/ImageUploader";
import { useParams } from "react-router-dom";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import pinata from "@/hooks/services_hooks/pinata";
import { handleImageUpload } from "@/utils/imageUploadUtils";

const generateShortUUID = () => {
  const fullUUID = uuidv4();
  return fullUUID.replace(/-/g, "").substring(0, 21);
};

const CreateProperty = () => {
  const { id } = useParams();
  const { address, status } = useAccount();
  const { handleListSaleProperty, contractStatus } = usePropertyCreate();
  const {
    saleProperties: properties,
    salePropertiesLoading: isLoadingProperty,
  } = usePropertyRead();

  const existingProperty =
    id && properties
      ? properties.find((p: Property) => p.id === id)
      : undefined;

  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [ownerAddress, setOwnerAddress] = useState(address);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Property>>({
    id: generateShortUUID(),
    agentId: address,
    interestedClients: 0,
    assetToken: "",
    hasGarden: false,
    hasSwimmingPool: false,
    petFriendly: false,
    wheelchairAccessible: false,
    dateListed: Math.floor(Date.now() / 1000),
    status: "Available",
    currency: "USD",
  });

  useEffect(() => {
    if (id && existingProperty) {
      setFormData(existingProperty);
      setUrl(existingProperty.imagesId || "");
    }
    if (status === "connected") {
      setOwnerAddress(address);
      setFormData((prev) => ({ ...prev, agent_id: address }));
    }
  }, [id, existingProperty, address, status]);

  const handleInputChange = (field: keyof Property, value: any) => {
    if (["price", "interested_clients", "asking_price"].includes(field)) {
      value = BigInt(value || 0);
    } else if (
      ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
    ) {
      value = Number(value || 0);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      locationAddress: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  };

  const validateFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    return validFiles;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = validateFiles(Array.from(files));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newFiles = validateFiles(Array.from(files));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (selectedFiles.length > 0 && !url) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const combinedString = await handleImageUpload(
          selectedFiles,
          pinata,
          formData.id
        );
        setUrl(combinedString);
        handleInputChange("imagesId", combinedString);
        toast.success("Images uploaded successfully!");

        const status = await handleListSaleProperty({
          ...formData,
          owner: address,
          agentId: address,
          imagesId: combinedString,
        } as Property);

        if (status.status === "success") {
          toast.success(`Property ${id ? "updated" : "created"} successfully!`);
          setSelectedFiles([]);
          setUploadProgress(0);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Failed to ${id ? "update" : "create"} property`);
      } finally {
        setIsUploading(false);
      }
    } else {
      try {
        const status = await handleListSaleProperty({
          ...formData,
          agentId: address,
          imagesId: url,
        } as Property);

        if (status.status === "success") {
          toast.success(`Property ${id ? "updated" : "created"} successfully!`);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Failed to ${id ? "update" : "create"} property`);
      }
    }
  };

  if (isLoadingProperty && id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <Card className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="space-y-2 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {id ? "Edit Property" : "Create New Property"}
            </CardTitle>
            <p className="text-gray-500">
              Fill in the details to {id ? "update" : "list"} a property
            </p>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
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

              <Button
                type="submit"
                disabled={contractStatus.isPending || isUploading}
                className={`w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg font-medium
                  transform hover:scale-105 active:scale-95 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2
                `}
              >
                {isUploading || contractStatus.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>
                      {isUploading
                        ? "Uploading Images..."
                        : `${id ? "Updating" : "Creating"} Property...`}
                    </span>
                  </>
                ) : (
                  <span>
                    {selectedFiles.length > 0
                      ? "Upload Images & Create Property"
                      : id
                      ? "Update Property"
                      : "Create Property"}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProperty;
