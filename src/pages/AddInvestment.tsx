/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Suspense } from "react";
import { useAccount } from "@starknet-react/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
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
// import FileIcon from "@/components/FileIcon";
// import UploadProgress from "@/components/UploadProgress";
import {
  InvestmentAsset,
  MarketAnalysis,
  LegalDetails,
  investmentTypes,
  zoningTypes,
  constructionStatus,
  riskLevels,
} from "@/types/starknet_types/investment";
import UploadProgress from "@/components/UploadProgress";
import { FileIcon } from "@/components/FileIcon";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});

// Lazy load map component
const MapLocationPicker = React.lazy(
  () => import("@/components/MapLocationPicker")
);

const AddInvestment = () => {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalUploadSize, setTotalUploadSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const generateShortUUID = () => {
    const fullUUID = crypto.randomUUID();
    return fullUUID.replace(/-/g, "").substring(0, 21);
  };

  const [formData, setFormData] = useState<Partial<InvestmentAsset>>({
    id: generateShortUUID(),
    owner: address,
    is_active: true,
    investment_token: tokenOptions[0].address,
    construction_status: "Pre-Construction",
    investment_type: "Residential",
    market_analysis: {
      area_growth: "",
      occupancy_rate: "",
      comparable_properties: "",
      demand_trend: "",
    },
    legal_details: {
      ownership: "",
      zoning: "",
      permits: "",
      documents_id: "",
    },
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
      location: `${location.address}, ${location.city}, ${location.state}, ${location.country}`,
    }));
  };

  const handleInputChange = (field: keyof InvestmentAsset, value: any) => {
    if (
      [
        "asset_value",
        "property_price",
        "rental_income",
        "maintenance_costs",
        "min_investment_amount",
        "available_staking_amount",
      ].includes(field)
    ) {
      value = BigInt(value || 0);
    } else if (field === "construction_year") {
      value = Number(value || 0);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarketAnalysisChange = (
    field: keyof MarketAnalysis,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      market_analysis: {
        ...prev.market_analysis!,
        [field]: value,
      },
    }));
  };

  const handleLegalDetailsChange = (
    field: keyof LegalDetails,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      legal_details: {
        ...prev.legal_details!,
        [field]: value,
      },
    }));
  };

  const validateFiles = (files: File[], isDocument: boolean = false) => {
    const maxSize = isDocument ? 20 * 1024 * 1024 : 10 * 1024 * 1024;

    return files.filter((file) => {
      if (isDocument) {
        if (
          ![
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(file.type)
        ) {
          toast.error(`${file.name} is not a valid document type`);
          return false;
        }
      } else if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }

      if (file.size > maxSize) {
        toast.error(
          `${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`
        );
        return false;
      }
      return true;
    });
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    isDocument: boolean = false
  ) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = validateFiles(Array.from(files), isDocument);
    if (isDocument) {
      setSelectedDocs((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    isDocument: boolean = false
  ) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const validFiles = validateFiles(Array.from(files), isDocument);
    if (isDocument) {
      setSelectedDocs((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleUpload = async (files: File[], isDocuments: boolean = false) => {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalUploadSize((prev) => prev + totalSize);

    // let uploadedBytes = 0;

    try {
      const upload = await pinata.upload.fileArray(files).addMetadata({
        name: `investment-${formData.id}-${isDocuments ? "docs" : "images"}`,
        keyValues: {
          type: isDocuments ? "documents" : "images",
          propertyId: formData.id,
          uploadDate: new Date().toISOString(),
        },
      });

      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);

      if (isDocuments) {
        handleLegalDetailsChange("documents_id", ipfsUrl);
      } else {
        handleInputChange("images", ipfsUrl);
      }

      toast.success(
        `${isDocuments ? "Documents" : "Images"} uploaded successfully!`
      );
      return ipfsUrl;
    } catch (error) {
      console.error(
        `Error uploading ${isDocuments ? "documents" : "images"}:`,
        error
      );
      toast.error(`Failed to upload ${isDocuments ? "documents" : "images"}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFiles(0);
    setUploadedSize(0);
    setTotalUploadSize(0);

    try {
      // Upload images if selected
      if (selectedFiles.length > 0) {
        await handleUpload(selectedFiles, false);
      }

      // Upload documents if selected
      if (selectedDocs.length > 0) {
        await handleUpload(selectedDocs, true);
      }

      // TODO: Add your contract interaction here
      // await handleCreateInvestment(formData);

      toast.success("Investment created successfully!");

      // Reset form after successful submission
      setSelectedFiles([]);
      setSelectedDocs([]);
      setUploadProgress(0);
      setUploadedFiles(0);
      setUploadedSize(0);
      setTotalUploadSize(0);
    } catch (error) {
      console.error("Error creating investment:", error);
      toast.error("Failed to create investment");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-24">
        <Card>
          <CardHeader>
            <CardTitle>Create New Investment Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Investment property name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    required
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Detailed property description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Size (sq ft)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.size || ""}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    placeholder="Property size"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Construction Status</Label>
                  <Select
                    value={formData.construction_status}
                    onValueChange={(value) =>
                      handleInputChange("construction_status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {constructionStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Investment Type</Label>
                  <Select
                    value={formData.investment_type}
                    onValueChange={(value) =>
                      handleInputChange("investment_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zoning Type</Label>
                  <Select
                    value={formData.legal_details?.zoning}
                    onValueChange={(value) =>
                      handleLegalDetailsChange("zoning", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zoning type" />
                    </SelectTrigger>
                    <SelectContent>
                      {zoningTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Asset Value</Label>
                  <Input
                    type="number"
                    required
                    value={
                      typeof formData.asset_value === "bigint"
                        ? formData.asset_value.toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("asset_value", e.target.value)
                    }
                    placeholder="Total asset value"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available Staking Amount</Label>
                  <Input
                    type="number"
                    required
                    value={
                      typeof formData.available_staking_amount === "bigint"
                        ? formData.available_staking_amount.toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "available_staking_amount",
                        e.target.value
                      )
                    }
                    placeholder="Available amount for staking"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Investment</Label>
                  <Input
                    type="number"
                    required
                    value={
                      typeof formData.min_investment_amount === "bigint"
                        ? formData.min_investment_amount.toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("min_investment_amount", e.target.value)
                    }
                    placeholder="Minimum investment required"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expected ROI (%)</Label>
                  <Input
                    type="number"
                    required
                    value={formData.expected_roi || ""}
                    onChange={(e) =>
                      handleInputChange("expected_roi", e.target.value)
                    }
                    placeholder="Expected return on investment"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Construction Year</Label>
                  <Input
                    type="number"
                    required
                    value={formData.construction_year || ""}
                    onChange={(e) =>
                      handleInputChange("construction_year", e.target.value)
                    }
                    placeholder="Year of construction"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Annual Rental Income</Label>
                  <Input
                    type="number"
                    required
                    value={
                      typeof formData.rental_income === "bigint"
                        ? formData.rental_income.toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("rental_income", e.target.value)
                    }
                    placeholder="Expected annual rental income"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Annual Maintenance Costs</Label>
                  <Input
                    type="number"
                    required
                    value={
                      typeof formData.maintenance_costs === "bigint"
                        ? formData.maintenance_costs.toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("maintenance_costs", e.target.value)
                    }
                    placeholder="Expected annual maintenance costs"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Investment Token</Label>
                  <Select
                    value={formData.investment_token}
                    onValueChange={(value) =>
                      handleInputChange("investment_token", value)
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
                  <Label>Investment Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("is_active", checked)
                      }
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </div>

              {/* Market Analysis Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Market Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Area Growth Rate (%)</Label>
                    <Input
                      required
                      value={formData.market_analysis?.area_growth || ""}
                      onChange={(e) =>
                        handleMarketAnalysisChange(
                          "area_growth",
                          e.target.value
                        )
                      }
                      placeholder="Annual area growth rate"
                    />
                  </div>
                  {/* Add other market analysis fields... */}
                </div>
              </div>

              {/* Legal Details Section */}
              {/* <div className="bg-gray-50 p-6 rounded-lg"> <div/><div/> */}
              <h3 className="text-lg font-semibold mb-4">Legal Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {/* Image Upload Section */}
                <div>
                  <Label className="mt-6">Property Images</Label>

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
                    onDrop={(e) => handleDrop(e, false)}
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload images</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleFileSelect(e, false)}
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
                  <div className="grid grid-cols-2 gap-6">
                    {/* Image Preview Section */}
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-900">
                        Selected Images
                      </h3>
                      <div className="flex-grow">
                        {selectedFiles.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                                  onClick={() => {
                                    setSelectedFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
                                  }}
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
                                <p className="mt-1 text-xs text-gray-500 truncate">
                                  {file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFiles([])}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove All
                          </Button>
                          <span className="text-sm text-gray-500">
                            {selectedFiles.length} file(s) selected
                          </span>
                        </div>
                      )}

                      {/* Document Upload */}
                      <div className="mt-6">
                        <Label>Legal Documents</Label>
                        <div className="flex justify-between items-center">
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
                            onDrop={(e) => handleDrop(e, true)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add("border-primary");
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove(
                                "border-primary"
                              );
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
                              </svg>
                              <div className="mt-4 flex text-sm text-gray-600">
                                <label
                                  htmlFor="doc-upload"
                                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                >
                                  <span>Upload documents</span>
                                  <input
                                    id="doc-upload"
                                    name="doc-upload"
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    className="sr-only"
                                    onChange={(e) => handleFileSelect(e, true)}
                                    disabled={isUploading}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX up to 20MB each
                              </p>
                            </div>
                            
                          </div>
                          {/* Document Preview Section */}
                            <div className="flex flex-col">
                              <h3 className="text-sm font-medium text-gray-900">
                                Selected Documents
                              </h3>
                              <div className="flex-grow">
                                {selectedDocs.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                    <div className="text-sm text-gray-500">
                                      Total size:{" "}
                                      {(
                                        selectedDocs.reduce(
                                          (acc, file) => acc + file.size,
                                          0
                                        ) /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </div>
                                    {selectedDocs.map((file, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <FileIcon
                                            filename={file.name}
                                            className="h-6 w-6"
                                          />
                                          <div>
                                            <p className="text-sm font-medium text-gray-900">
                                              {file.name}
                                            </p>
                                            <div className="flex space-x-2 text-xs text-gray-500">
                                              <span>
                                                {(
                                                  file.size /
                                                  1024 /
                                                  1024
                                                ).toFixed(2)}{" "}
                                                MB
                                              </span>
                                              <span>•</span>
                                              <span>{file.type}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex space-x-2">
                                          {file.type === "application/pdf" && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setPreviewUrl(
                                                  URL.createObjectURL(file)
                                                );
                                                setShowPreviewModal(true);
                                              }}
                                              className="p-1 text-gray-500 hover:text-gray-700"
                                            >
                                              <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                              </svg>
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedDocs((prev) =>
                                                prev.filter(
                                                  (_, i) => i !== index
                                                )
                                              );
                                            }}
                                            className="p-1 text-red-500 hover:text-red-700"
                                          >
                                            <svg
                                              className="h-5 w-5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {selectedDocs.length > 0 && (
                                <div className="mt-4 flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedDocs([])}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    Remove All
                                  </Button>
                                  <span className="text-sm text-gray-500">
                                    {selectedDocs.length} document(s) selected
                                  </span>
                                </div>
                              )}
                            </div>
                          <div>
                            
                          </div>

                          {/* Upload Progress */}
                          {isUploading && (
                            <div className="col-span-2 mt-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-2 text-center">
                                Uploading files to IPFS...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                      <UploadProgress
                        progress={uploadProgress}
                        totalFiles={selectedFiles.length + selectedDocs.length}
                        uploadedFiles={uploadedFiles}
                        totalSize={totalUploadSize}
                        uploadedSize={uploadedSize}
                      />
                    )}
                  </div>

                  {/* Preview Modal */}
                  {showPreviewModal && previewUrl && (
                    <div>
                      <h3 className="text-lg font-semibold">
                        Document Preview
                      </h3>
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPreviewModal(false);
                                setPreviewUrl(null);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                className="h-6 w-6"
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
                          </div>
                          <div className="flex-1 overflow-auto">
                            <iframe
                              src={previewUrl}
                              className="w-full h-full min-h-[60vh]"
                              title="Document Preview"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress Toast */}
                  {isUploading &&
                    uploadProgress > 0 &&
                    uploadProgress < 100 && (
                      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Uploading Files
                        </h4>
                        <UploadProgress
                          progress={uploadProgress}
                          totalFiles={
                            selectedFiles.length + selectedDocs.length
                          }
                          uploadedFiles={uploadedFiles}
                          totalSize={totalUploadSize}
                          uploadedSize={uploadedSize}
                        />
                      </div>
                    )}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? "Creating Investment..." : "Create Investment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddInvestment;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, Suspense } from "react";
// import { useAccount } from "@starknet-react/core";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Navbar from "@/components/Navbar";
// import { toast } from "sonner";
// import { PinataSDK } from "pinata-web3";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ErrorBoundary from "@/components/errrorBoundary";
// import { tokenOptions } from "@/utils/constants";
// // import FileIcon from "@/components/FileIcon";
// // import UploadProgress from "@/components/UploadProgress";
// import {
//   InvestmentAsset,
//   MarketAnalysis,
//   LegalDetails,
//   investmentTypes,
//   zoningTypes,
//   constructionStatus,
//   riskLevels
// } from "@/types/starknet_types/investment";
// import UploadProgress from "@/components/UploadProgress";
// import { FileIcon } from "@/components/FileIcon";

// // Initialize Pinata SDK
// const pinata = new PinataSDK({
//   pinataJwt: import.meta.env.VITE_PINATA_JWT,
//   pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
// });

// // Lazy load map component
// const MapLocationPicker = React.lazy(() => import("@/components/MapLocationPicker"));

// const AddInvestment = () => {
//   const { address } = useAccount();
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [selectedDocs, setSelectedDocs] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadedFiles, setUploadedFiles] = useState(0);
//   const [uploadedSize, setUploadedSize] = useState(0);
//   const [totalUploadSize, setTotalUploadSize] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [isLocationLoading, setIsLocationLoading] = useState(false);

//   const generateShortUUID = () => {
//     const fullUUID = crypto.randomUUID();
//     return fullUUID.replace(/-/g, '').substring(0, 21);
//   };

//   const [formData, setFormData] = useState<Partial<InvestmentAsset>>({
//     id: generateShortUUID(),
//     owner: address,
//     is_active: true,
//     investment_token: tokenOptions[0].address,
//     construction_status: "Pre-Construction",
//     investment_type: "Residential",
//     market_analysis: {
//       area_growth: '',
//       occupancy_rate: '',
//       comparable_properties: '',
//       demand_trend: ''
//     },
//     legal_details: {
//       ownership: '',
//       zoning: '',
//       permits: '',
//       documents_id: ''
//     }
//   });

//   const handleLocationSelect = (location: {
//     latitude: string;
//     longitude: string;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//   }) => {
//     setFormData(prev => ({
//       ...prev,
//       location: `${location.address}, ${location.city}, ${location.state}, ${location.country}`
//     }));
//   };

//   const handleInputChange = (field: keyof InvestmentAsset, value: any) => {
//     if (['asset_value', 'property_price', 'rental_income', 'maintenance_costs', 'min_investment_amount', 'available_staking_amount'].includes(field)) {
//       value = BigInt(value || 0);
//     } else if (field === 'construction_year') {
//       value = Number(value || 0);
//     }
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleMarketAnalysisChange = (field: keyof MarketAnalysis, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       market_analysis: {
//         ...prev.market_analysis!,
//         [field]: value
//       }
//     }));
//   };

//   const handleLegalDetailsChange = (field: keyof LegalDetails, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       legal_details: {
//         ...prev.legal_details!,
//         [field]: value
//       }
//     }));
//   };

//   const validateFiles = (files: File[], isDocument: boolean = false) => {
//     const maxSize = isDocument ? 20 * 1024 * 1024 : 10 * 1024 * 1024;

//     return files.filter(file => {
//       if (isDocument) {
//         if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
//           toast.error(`${file.name} is not a valid document type`);
//           return false;
//         }
//       } else if (!file.type.startsWith('image/')) {
//         toast.error(`${file.name} is not an image file`);
//         return false;
//       }

//       if (file.size > maxSize) {
//         toast.error(`${file.name} is too large (max ${maxSize/1024/1024}MB)`);
//         return false;
//       }
//       return true;
//     });
//   };

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isDocument: boolean = false) => {
//     const files = event.target.files;
//     if (!files) return;

//     const validFiles = validateFiles(Array.from(files), isDocument);
//     if (isDocument) {
//       setSelectedDocs(prev => [...prev, ...validFiles]);
//     } else {
//       setSelectedFiles(prev => [...prev, ...validFiles]);
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>, isDocument: boolean = false) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (!files) return;

//     const validFiles = validateFiles(Array.from(files), isDocument);
//     if (isDocument) {
//       setSelectedDocs(prev => [...prev, ...validFiles]);
//     } else {
//       setSelectedFiles(prev => [...prev, ...validFiles]);
//     }
//   };

//   const handleUpload = async (files: File[], isDocuments: boolean = false) => {
//     const totalSize = files.reduce((acc, file) => acc + file.size, 0);
//     setTotalUploadSize(prev => prev + totalSize);

//     // let uploadedBytes = 0;

//     try {
//       const upload = await pinata.upload.fileArray(files).addMetadata({
//         name: `investment-${formData.id}-${isDocuments ? 'docs' : 'images'}`,
//         keyValues: {
//           type: isDocuments ? 'documents' : 'images',
//           propertyId: formData.id,
//           uploadDate: new Date().toISOString(),
//         },
//       });

//       const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash);

//       if (isDocuments) {
//         handleLegalDetailsChange('documents_id', ipfsUrl);
//       } else {
//         handleInputChange('images', ipfsUrl);
//       }

//       toast.success(`${isDocuments ? 'Documents' : 'Images'} uploaded successfully!`);
//       return ipfsUrl;
//     } catch (error) {
//       console.error(`Error uploading ${isDocuments ? 'documents' : 'images'}:`, error);
//       toast.error(`Failed to upload ${isDocuments ? 'documents' : 'images'}`);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!address) {
//       toast.error("Please connect your wallet first");
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);
//     setUploadedFiles(0);
//     setUploadedSize(0);
//     setTotalUploadSize(0);

//     try {
//       // Upload images if selected
//       if (selectedFiles.length > 0) {
//         await handleUpload(selectedFiles, false);
//       }

//       // Upload documents if selected
//       if (selectedDocs.length > 0) {
//         await handleUpload(selectedDocs, true);
//       }

//       // TODO: Add your contract interaction here
//       // await handleCreateInvestment(formData);

//       toast.success("Investment created successfully!");

//       // Reset form after successful submission
//       setSelectedFiles([]);
//       setSelectedDocs([]);
//       setUploadProgress(0);
//       setUploadedFiles(0);
//       setUploadedSize(0);
//       setTotalUploadSize(0);

//     } catch (error) {
//       console.error("Error creating investment:", error);
//       toast.error("Failed to create investment");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="container mx-auto py-24">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create New Investment Property</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Basic Information Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label>Name</Label>
//                   <Input
//                     required
//                     value={formData.name || ""}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="Investment property name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     required
//                     value={formData.description || ""}
//                     onChange={(e) => handleInputChange("description", e.target.value)}
//                     placeholder="Detailed property description"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Size (sq ft)</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.size || ""}
//                     onChange={(e) => handleInputChange("size", e.target.value)}
//                     placeholder="Property size"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Construction Status</Label>
//                   <Select
//                     value={formData.construction_status}
//                     onValueChange={(value) => handleInputChange("construction_status", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {constructionStatus.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {status}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Type</Label>
//                   <Select
//                     value={formData.investment_type}
//                     onValueChange={(value) => handleInputChange("investment_type", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select investment type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {investmentTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Zoning Type</Label>
//                   <Select
//                     value={formData.legal_details?.zoning}
//                     onValueChange={(value) => handleLegalDetailsChange("zoning", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select zoning type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {zoningTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Asset Value</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={typeof formData.asset_value === 'bigint' ? formData.asset_value.toString() : ''}
//                     onChange={(e) => handleInputChange("asset_value", e.target.value)}
//                     placeholder="Total asset value"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Available Staking Amount</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={typeof formData.available_staking_amount === 'bigint' ? formData.available_staking_amount.toString() : ''}
//                     onChange={(e) => handleInputChange("available_staking_amount", e.target.value)}
//                     placeholder="Available amount for staking"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Minimum Investment</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={typeof formData.min_investment_amount === 'bigint' ? formData.min_investment_amount.toString() : ''}
//                     onChange={(e) => handleInputChange("min_investment_amount", e.target.value)}
//                     placeholder="Minimum investment required"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Expected ROI (%)</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.expected_roi || ""}
//                     onChange={(e) => handleInputChange("expected_roi", e.target.value)}
//                     placeholder="Expected return on investment"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Construction Year</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.construction_year || ""}
//                     onChange={(e) => handleInputChange("construction_year", e.target.value)}
//                     placeholder="Year of construction"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Annual Rental Income</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={typeof formData.rental_income === 'bigint' ? formData.rental_income.toString() : ''}
//                     onChange={(e) => handleInputChange("rental_income", e.target.value)}
//                     placeholder="Expected annual rental income"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Annual Maintenance Costs</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={typeof formData.maintenance_costs === 'bigint' ? formData.maintenance_costs.toString() : ''}
//                     onChange={(e) => handleInputChange("maintenance_costs", e.target.value)}
//                     placeholder="Expected annual maintenance costs"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Token</Label>
//                   <Select
//                     value={formData.investment_token}
//                     onValueChange={(value) => handleInputChange("investment_token", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select token" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {tokenOptions.map((token) => (
//                         <SelectItem key={token.symbol} value={token.address}>
//                           {token.symbol}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Status</Label>
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       checked={formData.is_active || false}
//                       onCheckedChange={(checked) => handleInputChange("is_active", checked)}
//                     />
//                     <Label>Active</Label>
//                   </div>
//                 </div>
//               </div>

//               {/* Market Analysis Section */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-4">Market Analysis</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label>Area Growth Rate (%)</Label>
//                     <Input
//                       required
//                       value={formData.market_analysis?.area_growth || ""}
//                       onChange={(e) => handleMarketAnalysisChange("area_growth", e.target.value)}
//                       placeholder="Annual area growth rate"
//                     />
//                   </div>
//                   {/* Add other market analysis fields... */}
//                 </div>
//               </div>

//               {/* Legal Details Section */}
//               {/* <div className="bg-gray-50 p-6 rounded-lg"> */}
//                 <h3 className="text-lg font-semibold mb-4">Legal Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Legal details fields... */}
//                 </div>

// {/* Image Upload Section */}
//                 <div className="mt-6">
//                   <div className="flex justify-between items-center">
//                     <Label>Property Images</Label>
//                     {selectedFiles.length > 0 && (
//                       <div className="flex gap-2">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedFiles([])}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           Remove All
//                         </Button>
//                         <span className="text-sm text-gray-500">
//                           {selectedFiles.length} file(s) selected
//                         </span>
//                       </div>
//                     )}
//                   <div
//                     className={`
//                       border-2 border-dashed rounded-lg p-8
//                       ${isUploading ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-primary cursor-pointer"}
//                       transition-colors duration-200 ease-in-out
//                       flex flex-col items-center justify-center space-y-4
//                     `}
//                     onDrop={(e) => handleDrop(e, false)}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDragEnter={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.classList.add("border-primary");
//                     }}
//                     onDragLeave={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.classList.remove("border-primary");
//                     }}
//                   >
//                     <div className="text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 48 48"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 4v16m8-8H4"
//                         />
//                       </svg>
//                       <div className="mt-4 flex text-sm text-gray-600">
//                         <label
//                           htmlFor="image-upload"
//                           className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
//                         >
//                           <span>Upload images</span>
//                           <input
//                             id="image-upload"
//                             name="image-upload"
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             className="sr-only"
//                             onChange={(e) => handleFileSelect(e, false)}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         PNG, JPG, WEBP up to 10MB each
//                       </p>
//                     </div>
//                   </div>

//                   {/* Image Preview */}
//                   {selectedFiles.length > 0 && (
//                     <div className="mt-4">
//                       <h3 className="text-sm font-medium text-gray-900">Selected Images</h3>
//                       <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//                         {selectedFiles.map((file, index) => (
//                           <div key={index} className="relative group">
//                             <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
//                               <img
//                                 src={URL.createObjectURL(file)}
//                                 alt={`Preview ${index + 1}`}
//                                 className="h-full w-full object-cover"
//                               />
//                             </div>
//                             <button
//                               onClick={() => {
//                                 setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//                               }}
//                               className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                             <p className="mt-1 text-xs text-gray-500 truncate">{file.name}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Document Upload */}
//                 <div className="mt-6">
//                   <div className="flex justify-between items-center">
//                     <Label>Legal Documents</Label>
//                     {selectedDocs.length > 0 && (
//                       <div className="flex gap-2">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedDocs([])}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           Remove All
//                         </Button>
//                         <span className="text-sm text-gray-500">
//                           {selectedDocs.length} document(s) selected
//                         </span>
//                       </div>
//                     )}
//                   <div
//                     className={`
//                       border-2 border-dashed rounded-lg p-8
//                       ${isUploading ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-primary cursor-pointer"}
//                       transition-colors duration-200 ease-in-out
//                       flex flex-col items-center justify-center space-y-4
//                     `}
//                     onDrop={(e) => handleDrop(e, true)}
//                     onDragOver={(e) => e.preventDefault()}
//                     onDragEnter={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.classList.add("border-primary");
//                     }}
//                     onDragLeave={(e) => {
//                       e.preventDefault();
//                       e.currentTarget.classList.remove("border-primary");
//                     }}
//                   >
//                     <div className="text-center">
//                       <svg
//                         className="mx-auto h-12 w-12 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 48 48"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14M8 14c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8M8 14h32"
//                         />
//                       </svg>
//                       <div className="mt-4 flex text-sm text-gray-600">
//                         <label
//                           htmlFor="doc-upload"
//                           className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
//                         >
//                           <span>Upload documents</span>
//                           <input
//                             id="doc-upload"
//                             name="doc-upload"
//                             type="file"
//                             multiple
//                             accept=".pdf,.doc,.docx"
//                             className="sr-only"
//                             onChange={(e) => handleFileSelect(e, true)}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">or drag and drop</p>
//                       </div>
//                       <p className="text-xs text-gray-500">
//                         PDF, DOC, DOCX up to 20MB each
//                       </p>
//                     </div>
//                   </div>

//                   {/* Document Preview */}
//                   {selectedDocs.length > 0 && (
//                     <div className="mt-4">
//                       <div className="flex justify-between items-center">
//                         <h3 className="text-sm font-medium text-gray-900">Selected Documents</h3>
//                         <span className="text-sm text-gray-500">
//                           Total size: {(selectedDocs.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
//                         </span>
//                       </div>
//                       <div className="mt-4 space-y-2">
//                         {selectedDocs.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
//                             <div className="flex items-center space-x-3">
//                               <FileIcon filename={file.name} className="h-6 w-6" />
//                               <div>
//                                 <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                                 <div className="flex space-x-2 text-xs text-gray-500">
//                                   <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
//                                   <span>•</span>
//                                   <span>{file.type}</span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex space-x-2">
//                               {file.type === 'application/pdf' && (
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     setPreviewUrl(URL.createObjectURL(file));
//                                     setShowPreviewModal(true);
//                                   }}
//                                   className="p-1 text-gray-500 hover:text-gray-700"
//                                 >
//                                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                   </svg>
//                                 </button>
//                               )}
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setSelectedDocs(prev => prev.filter((_, i) => i !== index));
//                                 }}
//                                 className="p-1 text-red-500 hover:text-red-700"
//                               >
//                                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Upload Progress */}
//                   {isUploading && (
//                     <UploadProgress
//                       progress={uploadProgress}
//                       totalFiles={selectedFiles.length + selectedDocs.length}
//                       uploadedFiles={uploadedFiles}
//                       totalSize={totalUploadSize}
//                       uploadedSize={uploadedSize}
//                     />
//                   )}
//                 </div>

//                 {/* Preview Modal */}
//                 {showPreviewModal && previewUrl && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
//                       <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold">Document Preview</h3>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setShowPreviewModal(false);
//                             setPreviewUrl(null);
//                           }}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                       <div className="flex-1 overflow-auto">
//                         <iframe
//                           src={previewUrl}
//                           className="w-full h-full min-h-[60vh]"
//                           title="Document Preview"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Upload Progress Toast */}
//                 {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
//                   <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
//                     <h4 className="text-sm font-medium text-gray-900 mb-2">Uploading Files</h4>
//                     <UploadProgress
//                       progress={uploadProgress}
//                       totalFiles={selectedFiles.length + selectedDocs.length}
//                       uploadedFiles={uploadedFiles}
//                       totalSize={totalUploadSize}
//                       uploadedSize={uploadedSize}
//                     />
//                   </div>
//                 )}
//                 </div>

//                 {/* Upload Progress */}
//                 {isUploading && (
//                   <div className="mt-4">
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div
//                         className="bg-primary h-2.5 rounded-full transition-all duration-500"
//                         style={{ width: `${uploadProgress}%` }}
//                       />
//                     </div>
//                     <p className="text-sm text-gray-500 mt-2 text-center">
//                       Uploading files to IPFS...
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={isUploading}
//                 className="w-full"
//               >
//                 {isUploading ? "Creating Investment..." : "Create Investment"}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AddInvestment;

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect, Suspense } from "react";
// import { useAccount } from "@starknet-react/core";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import Navbar from "@/components/Navbar";
// import { toast } from "sonner";
// import { PinataSDK } from "pinata-web3";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ErrorBoundary from "@/components/errrorBoundary";
// import { tokenOptions } from "@/utils/constants";
// // import { InvestmentAsset } from "@/types/starknet_types/investment";
// import {
//   InvestmentAsset,
//   MarketAnalysis,
//   LegalDetails,
//   investmentTypes,
//   zoningTypes,
//   constructionStatus,
//   riskLevels,
// } from "@/types/starknet_types/investment";
// // "@/types/investment";

// // Initialize Pinata SDK
// const pinata = new PinataSDK({
//   pinataJwt: import.meta.env.VITE_PINATA_JWT,
//   pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
// });

// // Lazy load map component
// const MapLocationPicker = React.lazy(
//   () => import("@/components/MapLocationPicker")
// );

// const AddInvestment = () => {
//   const { address } = useAccount();
//   const [isUploading, setIsUploading] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [selectedDocs, setSelectedDocs] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isLocationLoading, setIsLocationLoading] = useState(false);

//   const generateShortUUID = () => {
//     const fullUUID = crypto.randomUUID();
//     return fullUUID.replace(/-/g, "").substring(0, 21);
//   };

//   const [formData, setFormData] = useState<Partial<InvestmentAsset>>({
//     id: generateShortUUID(),
//     owner: address,
//     is_active: true,
//     investment_token: tokenOptions[0].address,
//     market_analysis: {
//       area_growth: "",
//       occupancy_rate: "",
//       comparable_properties: "",
//       demand_trend: "",
//     },
//     legal_details: {
//       ownership: "",
//       zoning: "",
//       permits: "",
//       documents_id: "",
//     },
//   });

//   const handleLocationSelect = (location: {
//     latitude: string;
//     longitude: string;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//   }) => {
//     setFormData((prev) => ({
//       ...prev,
//       location: `${location.address}, ${location.city}, ${location.state}, ${location.country}`,
//     }));
//   };

//   const handleInputChange = (field: keyof InvestmentAsset, value: any) => {
//     if (
//       [
//         "asset_value",
//         "property_price",
//         "rental_income",
//         "maintenance_costs",
//         "min_investment_amount",
//         "available_staking_amount",
//       ].includes(field)
//     ) {
//       value = BigInt(value || 0);
//     } else if (field === "construction_year") {
//       value = Number(value || 0);
//     }
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleMarketAnalysisChange = (
//     field: keyof MarketAnalysis,
//     value: string
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       market_analysis: {
//         ...prev.market_analysis!,
//         [field]: value,
//       },
//     }));
//   };

//   const handleLegalDetailsChange = (
//     field: keyof LegalDetails,
//     value: string
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       legal_details: {
//         ...prev.legal_details!,
//         [field]: value,
//       },
//     }));
//   };

//   const validateFiles = (files: File[], isDocument: boolean = false) => {
//     const maxSize = isDocument ? 20 * 1024 * 1024 : 10 * 1024 * 1024;

//     return files.filter((file) => {
//       if (isDocument) {
//         if (
//           ![
//             "application/pdf",
//             "application/msword",
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           ].includes(file.type)
//         ) {
//           toast.error(`${file.name} is not a valid document type`);
//           return false;
//         }
//       } else if (!file.type.startsWith("image/")) {
//         toast.error(`${file.name} is not an image file`);
//         return false;
//       }

//       if (file.size > maxSize) {
//         toast.error(
//           `${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`
//         );
//         return false;
//       }
//       return true;
//     });
//   };

//   const handleFileSelect = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     isDocument: boolean = false
//   ) => {
//     const files = event.target.files;
//     if (!files) return;

//     const validFiles = validateFiles(Array.from(files), isDocument);
//     if (isDocument) {
//       setSelectedDocs((prev) => [...prev, ...validFiles]);
//     } else {
//       setSelectedFiles((prev) => [...prev, ...validFiles]);
//     }
//   };

//   const handleDrop = (
//     e: React.DragEvent<HTMLDivElement>,
//     isDocument: boolean = false
//   ) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (!files) return;

//     const validFiles = validateFiles(Array.from(files), isDocument);
//     if (isDocument) {
//       setSelectedDocs((prev) => [...prev, ...validFiles]);
//     } else {
//       setSelectedFiles((prev) => [...prev, ...validFiles]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!address) {
//       toast.error("Please connect your wallet first");
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       // Upload images if selected
//       if (selectedFiles.length > 0) {
//         const imageUpload = await pinata.upload
//           .fileArray(selectedFiles)
//           .addMetadata({
//             name: `investment-${formData.id}-images`,
//             keyValues: { type: "images" },
//           });
//         const imagesUrl = await pinata.gateways.convert(imageUpload.IpfsHash);
//         handleInputChange("images", imagesUrl);
//       }

//       // Upload documents if selected
//       if (selectedDocs.length > 0) {
//         const docsUpload = await pinata.upload
//           .fileArray(selectedDocs)
//           .addMetadata({
//             name: `investment-${formData.id}-docs`,
//             keyValues: { type: "documents" },
//           });
//         const docsUrl = await pinata.gateways.convert(docsUpload.IpfsHash);
//         handleLegalDetailsChange("documents_id", docsUrl);
//       }

//       // TODO: Add your contract interaction here
//       // await handleCreateInvestment(formData);

//       toast.success("Investment created successfully!");
//     } catch (error) {
//       console.error("Error creating investment:", error);
//       toast.error("Failed to create investment");
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(100);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="container mx-auto py-24">
//         <Card>
//           <CardHeader>
//             <CardTitle>Create New Investment Property</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Basic Information Section */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label>Name</Label>
//                   <Input
//                     required
//                     value={formData.name || ""}
//                     onChange={(e) => handleInputChange("name", e.target.value)}
//                     placeholder="Investment property name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Description</Label>
//                   <Textarea
//                     required
//                     value={formData.description || ""}
//                     onChange={(e) =>
//                       handleInputChange("description", e.target.value)
//                     }
//                     placeholder="Detailed property description"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Size (sq ft)</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.size || ""}
//                     onChange={(e) => handleInputChange("size", e.target.value)}
//                     placeholder="Property size"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Construction Status</Label>
//                   <Select
//                     value={formData.construction_status}
//                     onValueChange={(value) =>
//                       handleInputChange("construction_status", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {constructionStatus.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {status}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Type</Label>
//                   <Select
//                     value={formData.investment_type}
//                     onValueChange={(value) =>
//                       handleInputChange("investment_type", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select investment type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {investmentTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Zoning Type</Label>
//                   <Select
//                     value={formData.legal_details?.zoning}
//                     onValueChange={(value) =>
//                       handleLegalDetailsChange("zoning", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select zoning type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {zoningTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Asset Value</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={
//                       typeof formData.asset_value === "bigint"
//                         ? formData.asset_value.toString()
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleInputChange("asset_value", e.target.value)
//                     }
//                     placeholder="Total asset value"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Available Staking Amount</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={
//                       typeof formData.available_staking_amount === "bigint"
//                         ? formData.available_staking_amount.toString()
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleInputChange(
//                         "available_staking_amount",
//                         e.target.value
//                       )
//                     }
//                     placeholder="Available amount for staking"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Minimum Investment</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={
//                       typeof formData.min_investment_amount === "bigint"
//                         ? formData.min_investment_amount.toString()
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleInputChange("min_investment_amount", e.target.value)
//                     }
//                     placeholder="Minimum investment required"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Expected ROI (%)</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.expected_roi || ""}
//                     onChange={(e) =>
//                       handleInputChange("expected_roi", e.target.value)
//                     }
//                     placeholder="Expected return on investment"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Construction Year</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={formData.construction_year || ""}
//                     onChange={(e) =>
//                       handleInputChange("construction_year", e.target.value)
//                     }
//                     placeholder="Year of construction"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Annual Rental Income</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={
//                       typeof formData.rental_income === "bigint"
//                         ? formData.rental_income.toString()
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleInputChange("rental_income", e.target.value)
//                     }
//                     placeholder="Expected annual rental income"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Annual Maintenance Costs</Label>
//                   <Input
//                     type="number"
//                     required
//                     value={
//                       typeof formData.maintenance_costs === "bigint"
//                         ? formData.maintenance_costs.toString()
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleInputChange("maintenance_costs", e.target.value)
//                     }
//                     placeholder="Expected annual maintenance costs"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Token</Label>
//                   <Select
//                     value={formData.investment_token}
//                     onValueChange={(value) =>
//                       handleInputChange("investment_token", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select token" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {tokenOptions.map((token) => (
//                         <SelectItem key={token.symbol} value={token.address}>
//                           {token.symbol}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Investment Status</Label>
//                   <div className="flex items-center space-x-2">
//                     <Switch
//                       checked={formData.is_active || false}
//                       onCheckedChange={(checked) =>
//                         handleInputChange("is_active", checked)
//                       }
//                     />
//                     <Label>Active</Label>
//                   </div>
//                 </div>
//               </div>

//               {/* Market Analysis Section */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-4">Market Analysis</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label>Area Growth Rate (%)</Label>
//                     <Input
//                       required
//                       value={formData.market_analysis?.area_growth || ""}
//                       onChange={(e) =>
//                         handleMarketAnalysisChange(
//                           "area_growth",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Annual area growth rate"
//                     />
//                   </div>
//                   {/* Add other market analysis fields... */}
//                 </div>
//               </div>

//               {/* Legal Details Section */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-4">Legal Details</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Legal details fields... */}
//                 </div>

//                 {/* Document Upload */}
//                 <div className="mt-6">
//                   <Label>Legal Documents</Label>
//                   <div className="border-2 border-dashed rounded-lg p-6 mt-2">
//                     {/* Document upload UI */}
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button type="submit" disabled={isUploading} className="w-full">
//                 {isUploading ? "Creating Investment..." : "Create Investment"}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AddInvestment;
