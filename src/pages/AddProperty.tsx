/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Suspense } from "react";
import { useAccount } from "@starknet-react/core";
import { Property } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { PinataSDK } from "pinata-web3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorBoundary from "@/components/errrorBoundary";
import { tokenOptions } from "@/utils/constants";
import { usePropertyRegistration } from "@/hooks/contract_interactions/usePropertyWrite";
import { Loader2 } from "lucide-react";

const MapLocationPicker = React.lazy(
  () => import("@/components/MapLocationPicker")
);

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});

const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Land",
  "Commercial",
];
const statusOptions = ["Available", "Pending", "Sold", "Under Maintenance"];

const CreateProperty = () => {
  const { address, status } = useAccount();
  const { handleListProperty, contractStatus } = usePropertyRegistration();
  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [ownerAddress, setOwnerAddress] = useState(address);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    if (status === "disconnected") {
      // toast.error("wallet not connects");
    } else if (status === "connected") {
      setOwnerAddress(address);
    }
  }, [address, status]);
  const generateShortUUID = () => {
    const fullUUID = uuidv4();
    return fullUUID.replace(/-/g, "").substring(0, 21);
  };

  const [formData, setFormData] = useState<Partial<Property>>({
    id: generateShortUUID(),
    agent_id: address,
    interested_clients: 0,
    asset_token: tokenOptions[0].address,
    has_garden: false,
    has_swimming_pool: false,
    pet_friendly: false,
    wheelchair_accessible: false,
    date_listed: Math.floor(Date.now() / 1000),
    status: "Available",
    currency: "USD",
  });

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
      location_address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    if (["price", "interested_clients", "asking_price"].includes(field)) {
      value = BigInt(value || 0);
    } else if (
      ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
    ) {
      value = Number(value || 0);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (["location_address", "city", "state", "country"].includes(field)) {
      const timer = setTimeout(() => {}, 1000);
      return () => clearTimeout(timer);
    }
  };
  const listingProperty = async (ipfsUrl) => {
    try {
      const status = await handleListProperty({
        ...formData,
        owner: address,
        agent_id: address,
        images_id: ipfsUrl,
      } as Property);
      if (status.status == "success") {
        toast.success("Property created successfully! ");
        setSelectedFiles([]);
        setUploadedImages([]);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      setOwnerAddress(address);
      return;
    }

    if (selectedFiles.length > 0 && !url) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        toast.info("Uploading images");

        const upload = await pinata.upload
          .fileArray(selectedFiles)
          .addMetadata({
            name: `property-${formData.id}-images`,
            keyValues: {
              propertyId: formData.id,
              uploadDate: new Date().toISOString(),
            },
          });
        const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);
        setUrl(ipfsUrl);

        setUploadedImages([ipfsUrl]);
        handleInputChange("images_id", ipfsUrl);
        toast.success(`Images uploaded to Successfully!`);

        listingProperty(ipfsUrl);
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
        toast.error("Failed to upload images,", error);
      } finally {
        setIsUploading(false);
        setUploadProgress(100);
      }
    } else {
      listingProperty(url);
    }
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

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const SelectedFilesPreview = () => {
    if (selectedFiles.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">Selected Files</h3>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => removeSelectedFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const UploadedImagesPreview = () => {
    if (uploadedImages.length === 0) return null;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">Uploaded Images</h3>
        <div className="mt-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Images uploaded:
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                {uploadedImages[0]}
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <Card className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="space-y-2 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Create New Property
            </CardTitle>
            <p className="text-gray-500">Fill in the details to list a new property</p>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2 group">
                    <Label className="text-sm font-medium">Title</Label>
                    <Input
                      required
                      value={formData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="transition-all duration-300 border-gray-200 focus:border-purple-500 hover:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      required
                      value={formData.description?.toString() || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="min-h-[100px] transition-all duration-300 border-gray-200 focus:border-purple-500 hover:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      autoComplete="price"
                      required
                      value={
                        formData.price ? Number(formData.price.toString()) : ""
                      }
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asking-price">Asking Price</Label>
                    <Input
                      id="asking-price"
                      type="number"
                      autoComplete="asking-price"
                      required
                      value={
                        formData.asking_price
                          ? Number(formData.asking_price.toString())
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("asking_price", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Area (sq ft)</Label>
                    <Input
                      type="number"
                      required
                      value={formData.area || ""}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      required
                      value={formData.bedrooms || ""}
                      onChange={(e) =>
                        handleInputChange("bedrooms", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      required
                      value={formData.bathrooms || ""}
                      onChange={(e) =>
                        handleInputChange("bathrooms", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parking Spaces</Label>
                    <Input
                      type="number"
                      required
                      value={formData.parking_spaces}
                      onChange={(e) =>
                        handleInputChange("parking_spaces", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) =>
                        handleInputChange("property_type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Video Tour URL</Label>
                    <Input
                      value={formData.video_tour || ""}
                      onChange={(e) =>
                        handleInputChange("video_tour", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Growth Rate (%)</Label>
                    <Input
                      type="text"
                      value={
                        formData.annual_growth_rate
                          ? formData.annual_growth_rate.toString()
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("annual_growth_rate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Agent Address</Label>
                    <Input
                      disabled
                      value={formData.agent_id}
                      onChange={(e) =>
                        handleInputChange("agent_id", e.target.value)
                      }
                      placeholder={address || "Agent Address"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Asset Token</Label>
                    <Select
                      value={formData.asset_token}
                      onValueChange={(value) =>
                        handleInputChange("asset_token", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokenOptions.map((token) => (
                          <SelectItem key={token.symbol} value={token.address}>
                            {token.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      required
                      value={formData.location_address || ""}
                      onChange={(e) =>
                        handleInputChange("location_address", e.target.value)
                      }
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      disabled
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Asset city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      disabled
                      value={formData.state || formData.city || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="state"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      disabled
                      value={formData.country || ""}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="Asset country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      value={formData.latitude || ""}
                      disabled
                      placeholder={
                        isLocationLoading
                          ? "Updating..."
                          : "Will be set automatically"
                      }
                      className={isLocationLoading ? "bg-gray-100" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      value={formData.longitude || ""}
                      disabled
                      placeholder={
                        isLocationLoading
                          ? "Updating..."
                          : "Will be set automatically"
                      }
                      className={isLocationLoading ? "bg-gray-100" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-100">
                <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      required
                      value={formData.location_address || ""}
                      onChange={(e) =>
                        handleInputChange("location_address", e.target.value)
                      }
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      disabled
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Asset city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      disabled
                      value={formData.state || formData.city || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="state"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      disabled
                      value={formData.country || ""}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="Asset country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      value={formData.latitude || ""}
                      disabled
                      placeholder={
                        isLocationLoading
                          ? "Updating..."
                          : "Will be set automatically"
                      }
                      className={isLocationLoading ? "bg-gray-100" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      value={formData.longitude || ""}
                      disabled
                      placeholder={
                        isLocationLoading
                          ? "Updating..."
                          : "Will be set automatically"
                      }
                      className={isLocationLoading ? "bg-gray-100" : ""}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Suspense
                    fallback={
                      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="text-center space-y-3">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
                          <p className="text-sm text-gray-500">Loading Map...</p>
                        </div>
                      </div>
                    }
                  >
                    <ErrorBoundary
                      fallback={
                        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <p className="text-sm text-red-500">Error loading map. Please try again.</p>
                        </div>
                      }
                    >
                      <MapLocationPicker
                        onLocationSelect={handleLocationSelect}
                        initialLocation={
                          formData.latitude && formData.longitude
                            ? {
                                latitude: formData.latitude.toString(),
                                longitude: formData.longitude.toString(),
                              }
                            : undefined
                        }
                      />
                    </ErrorBoundary>
                  </Suspense>
                </div>
              </div>

              <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-200">
                <h3 className="text-lg font-semibold text-gray-900">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
                    <Label htmlFor="has_garden" className="cursor-pointer">Garden</Label>
                    <Switch
                      id="has_garden"
                      checked={formData.has_garden || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("has_garden", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
                    <Label htmlFor="pet_friendly" className="cursor-pointer">Pet Friendly</Label>
                    <Switch
                      id="pet_friendly"
                      checked={formData.pet_friendly || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("pet_friendly", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
                    <Label htmlFor="wheelchair_accessible" className="cursor-pointer">Wheelchair Accessible</Label>
                    <Switch
                      id="wheelchair_accessible"
                      checked={formData.wheelchair_accessible || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("wheelchair_accessible", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-white/60 hover:bg-white/80 transition-colors duration-300">
                    <Label htmlFor="has_swimming_pool" className="cursor-pointer">Swimming Pool</Label>
                    <Switch
                      id="has_swimming_pool"
                      checked={formData.has_swimming_pool || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("has_swimming_pool", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white/40 backdrop-blur-sm p-6 space-y-6 animate-fade-in delay-300">
                <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8
                    ${
                      isUploading
                        ? "border-gray-300 bg-gray-50"
                        : "border-purple-300 hover:border-purple-500 cursor-pointer"
                    }
                    transition-all duration-300 ease-in-out
                    flex flex-col items-center justify-center space-y-4
                  `}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-purple-500");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-purple-500");
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M24 14v20M17 21l7-7 7 7"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileSelect}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP up to 10MB each
                    </p>
                  </div>
                </div>

                <SelectedFilesPreview />
                {uploadedImages.length > 0 && <UploadedImagesPreview />}

                {isUploading && (
                  <div className="mt-4 animate-fade-in">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 relative"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Uploading images to IPFS...
                    </p>
                  </div>
                )}
              </div>

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
                        : "Creating Property..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {selectedFiles.length > 0
                      ? "Upload Images & Create Property"
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
