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
      // owner: address,
      // agent_id: address,
      latitude: location.latitude,
      longitude: location.longitude,
      location_address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
    }));
  };

  // Modified handleInputChange with location updates
  const handleInputChange = (field: keyof Property, value: any) => {
    if (["price", "interested_clients", "asking_price"].includes(field)) {
      value = BigInt(value || 0);
    }
    // else if (["annual_growth_rate"].includes(field)) {
    //   value = Number(value || 0.0);
    // }
    else if (
      ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
    ) {
      value = Number(value || 0);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Trigger location update when address fields change
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
      // contractStatus =
      if (status.status == "success") {
        toast.success("Property created successfully! ");
        // Reset form after successful submission
        setSelectedFiles([]);
        setUploadedImages([]);
        setUploadProgress(0);
      }

      // toast.success("Property created successfully! ", );
      // // Reset form after successful submission
      // setSelectedFiles([]);
      // setUploadedImages([]);
      // setUploadProgress(0);
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

    // Handle file upload first if there are selected files
    if (selectedFiles.length > 0 && !url) {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Show upload starting
        toast.info("Uploading images");

        // Upload files as a folder
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

        // Now create the property with the uploaded images hash
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

    // if (url != "") {
    //   try {
    //     await handleListProperty({
    //       ...formData,
    //       images_id: url,
    //     } as Property);

    //     toast.success("Property created successfully!");
    //     // Reset form after successful submission
    //     setSelectedFiles([]);
    //     setUploadedImages([]);
    //     setUploadProgress(0);
    //   } catch (error) {
    //     console.error("Error creating property:", error);
    //     toast.error("Failed to create property", error);
    //   }
    // } else {
    //   // If no images to upload, just create the property
    //   try {
    //     const error = await handleListProperty(formData as Property);
    //     toast.success(`Property created successfully! ${error} `);
    //   } catch (error) {
    //     console.error("Error creating property:", error);
    //     toast.error("Failed to create property");
    //   }
    // }
  };

  const validateFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
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

  // Removed uploadFiles function as it's now handled in handleSubmit

  // Image preview for selected files
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
        {/* <Button onClick={uploadFiles} disabled={isUploading} className="mt-4">
            {isUploading ? "Uploading..." : "Upload Selected Files"}
          </Button> */}
      </div>
    );
  };

  // Preview for uploaded images
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <Card>
          <CardHeader>
            <CardTitle>Create New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    required
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    required
                    value={formData.description?.toString() || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Property Details */}
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

                {/* Additional Details */}
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
                        ? formData.annual_growth_rate.toString() // Convert to string for the input
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("annual_growth_rate", e.target.value)
                    }
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label>Annual Growth Rate (%)</Label>
                  <Input
                    type="text"
                    decimalPlaces={3}
                    value={
                      formData.annual_growth_rate
                        ? Number(formData.annual_growth_rate.toString())
                        : ""
                      // formData.annual_growth_rate
                      // typeof formData.annual_growth_rate == "number"
                      //   ? formData.annual_growth_rate
                      //   : 0
                    }
                    onChange={(e) =>
                      handleInputChange("annual_growth_rate", e.target.value)
                    }
                  />
                </div> */}
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
                {/* <div className="space-y-2">
                  <Label>Owner Address</Label>
                  <Input
                    disabled
                    value={formData.owner}
                    onChange={(e) => handleInputChange("owner", e.target.value)}
                    placeholder={address || "Owner Address"}
                  />
                </div> */}
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
                  {/* </div>
                  </div> */}
                </div>

                {/* Location Information with Auto-coordinate Update */}
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

                {/* Coordinates Fields (Auto-populated) */}
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

              {/* Property Features Section */}
              <div>
                <div className="col-span-full bg-gray-50 p-6 rounded-lg mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Property Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="has_garden">Garden</Label>
                      <Switch
                        id="has_garden"
                        checked={formData.has_garden || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("has_garden", checked)
                        }
                      />
                    </div>
                    {/* <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="is_investment">Investment Property</Label>
                      <Switch
                        id="is_investment"
                        checked={formData.is_investment || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("is_investment", checked)
                        }
                      />
                    </div> */}
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="pet_friendly">Pet Friendly</Label>
                      <Switch
                        id="pet_friendly"
                        checked={formData.pet_friendly || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("pet_friendly", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="wheelchair_accessible">
                        Wheelchair Accessible
                      </Label>
                      <Switch
                        id="wheelchair_accessible"
                        checked={formData.wheelchair_accessible || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("wheelchair_accessible", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="has_swimming_pool">Swimming Pool</Label>
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
              </div>

              {/* map picker */}
              <div>
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                      Loading Map...
                    </div>
                  }
                >
                  <ErrorBoundary
                    fallback={
                      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                        Error loading map. Please try again.
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
              {/* File Upload Section */}
              <div className="space-y-4">
                <Label>Property Images</Label>
                <div
                  className={`
                                  border-2 border-dashed rounded-lg p-8
                                  ${
                                    isUploading
                                      ? "border-gray-300 bg-gray-50"
                                      : "border-gray-300 hover:border-primary cursor-pointer"
                                  }
                                  transition-colors duration-200 ease-in-out
                                  flex flex-col items-center justify-center space-y-4
                                `}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-primary");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-primary");
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

                {/* File Previews */}
                <SelectedFilesPreview />
                {uploadedImages.length > 0 && <UploadedImagesPreview />}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Uploading images to IPFS...
                    </p>
                  </div>
                )}
              </div>
              {/* <Button onClick={ListPerty}>list </Button> */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={contractStatus.isPending || isUploading}
                className="mx-auto bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isUploading
                  ? "Uploading Images..."
                  : contractStatus.isPending
                  ? "Creating Property..."
                  : selectedFiles.length > 0
                  ? "Upload Images & Create Property"
                  : "Create Property"}
              </Button>
              {/* <Button
                onClick={handleSubmit}
                disabled={contractStatus.isPending || isUploading}
                className="mx-auto bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isUploading
                  ? "Uploading Images..."
                  : contractStatus.isPending
                  ? "Creating Property..."
                  : selectedFiles.length > 0
                  ? "Upload Images & Create Property"
                  : " Property"}
              </Button> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProperty;
