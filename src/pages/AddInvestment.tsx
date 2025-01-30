import React, { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PinataSDK } from "pinata-web3";
import { Loader2, LoaderCircle } from "lucide-react";

import BasicInformation from "@/components/investment/BasicInformation";
import FinancialDetails from "@/components/investment/FinancialDetails";
import { InvestmentAsset } from "@/types/investment";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import InvestmentFormHeader from "@/components/investment/InvestmentFormHeader";
import UploadGrid from "@/components/investment/UploadGrid";
import BulletPointsGrid from "@/components/investment/BulletPointsGrid";
import { handleFileUpload } from "@/utils/uploadUtils";
import MapLocationPicker from "@/components/MapLocationPicker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CommaInputField from "@/components/investment/CommaInputField";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});

const AddInvestment = () => {
  const { address } = useAccount();
  const { handleListInvestmentProperty, contractStatus } = usePropertyCreate();
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

  // State for bullet points
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  const generateShortUUID = () => {
    const fullUUID = crypto.randomUUID();
    return fullUUID.replace(/-/g, "").substring(0, 21);
  };

  const [formData, setFormData] = useState<InvestmentAsset>({
    id: generateShortUUID(),
    name: "",
    description: "",
    is_active: true,
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
    },
    size: 0,
    investor_id: address || "",
    owner: address || "",
    construction_status: "",
    asset_value: 0,
    available_staking_amount: 0,
    investment_type: "",
    construction_year: 0,
    property_price: 0,
    expected_roi: "",
    rental_income: 0,
    maintenance_costs: 0,
    tax_benefits: "",
    highlights: "",
    market_analysis: "",
    risk_factors: "",
    legal_detail: "",
    additional_features: "",
    images: "",
    investment_token: "",
    min_investment_amount: 0,
  });

  const handleInputChange = (field: keyof InvestmentAsset, value: any) => {
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
    // Trim the address to only include the street part
    const addressParts = location.address.split(",");
    const streetAddress = addressParts[0].trim();

    setFormData((prev) => ({
      ...prev,
      location: {
        address: streetAddress,
        city: location.city,
        state: location.state,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
    console.log("[AddInvestment] Location selected:", location);
    console.log("[AddInvestment] Trimmed address:", streetAddress);
  };

  const validateFiles = (files: File[], isDocument: boolean = false) => {
    const maxSize = isDocument ? 10 * 1024 * 1024 : 10 * 1024 * 1024;

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

  // Add new state for tracking upload status
  const [uploadedImageHash, setUploadedImageHash] = useState<string | null>(
    null
  );
  const [uploadedDocHash, setUploadedDocHash] = useState<string | null>(null);

  // Add effect to check for existing uploads when form data changes
  useEffect(() => {
    console.log("Checking for existing uploads in form data...");
    if (formData.images) {
      console.log("Found existing image uploads:", formData.images);
      setUploadedImageHash(formData.images);
    }
    if (formData.legal_detail) {
      console.log("Found existing document uploads:", formData.legal_detail);
      setUploadedDocHash(formData.legal_detail);
    }
  }, [formData.images, formData.legal_detail]);

  const handleUploadFiles = async (files: File[], isDocuments: boolean = false) => {
    // If we already have uploads, reuse them
    if (isDocuments && uploadedDocHash) {
      console.log("Reusing existing document uploads:", uploadedDocHash);
      return uploadedDocHash;
    }
    if (!isDocuments && uploadedImageHash) {
      console.log("Reusing existing image uploads:", uploadedImageHash);
      return uploadedImageHash;
    }

    console.log(`Starting ${isDocuments ? 'document' : 'image'} upload...`);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalUploadSize((prev) => prev + totalSize);

    try {
      const result = await handleFileUpload(
        files,
        pinata,
        formData.id || "",
        isDocuments ? "documents" : "images"
      );

      console.log(
        `Upload successful for ${isDocuments ? "documents" : "images"}:`,
        result
      );

      if (isDocuments) {
        setUploadedDocHash(result);
        handleInputChange("legal_detail", result);
      } else {
        setUploadedImageHash(result);
        handleInputChange("images", result);
      }

      toast.success(
        `${isDocuments ? "Documents" : "Images"} uploaded successfully!`
      );
      return result;
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

    // Validate required fields
    const requiredFields = [
      "tax_benefits",
      "highlights",
      "market_analysis",
      "risk_factors",
      "legal_detail",
      "additional_features",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof InvestmentAsset]
    );

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsUploading(true);
    try {
      console.log("Starting form submission with data:", formData);

      // Handle image uploads if not already uploaded
      let imagesHash = uploadedImageHash;
      if (selectedFiles.length > 0 && !uploadedImageHash) {
        console.log("Uploading images...");
        imagesHash = await handleUploadFiles(selectedFiles, false);
      } else if (uploadedImageHash) {
        console.log("Reusing existing image hash:", uploadedImageHash);
      }

      // Handle document uploads if not already uploaded
      let docsHash = uploadedDocHash;
      if (selectedDocs.length > 0 && !uploadedDocHash) {
        console.log("Uploading documents...");
        docsHash = await handleUploadFiles(selectedDocs, true);
      } else if (uploadedDocHash) {
        console.log("Reusing existing document hash:", uploadedDocHash);
      }

      const processedFormData: InvestmentAsset = {
        ...formData,
        is_active: true,
        additional_features: additionalFeatures.join(","),
        risk_factors: riskFactors.join(","),
        highlights: highlights.join(","),
        images: imagesHash || "",
        legal_detail: docsHash || "",
      };

      console.log(
        "Submitting investment with processed data:",
        processedFormData
      );

      await handleListInvestmentProperty(processedFormData);

      toast.success("Investment created successfully!");
      
      // Don't reset upload states after successful submission
      // This allows reuse of the uploaded files
      setSelectedFiles([]);
      setSelectedDocs([]);
      setUploadProgress(0);
      setUploadedFiles(0);
      setUploadedSize(0);
      setTotalUploadSize(0);
    } catch (error) {
      console.error("Error creating investment:", error);
      toast.error(
        "Failed to create investment. Your uploads are saved and won't be repeated if you try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-slate-900 dark:to-slate-800/90 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="animate-fade-in backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-none shadow-xl">
          <InvestmentFormHeader />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-8">
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h2>
                  <BasicInformation
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Location
                  </h2>
                  <MapLocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      formData.location.latitude && formData.location.longitude
                        ? {
                            latitude: formData.location.latitude.toString(),
                            longitude: formData.location.longitude.toString(),
                          }
                        : undefined
                    }
                  />

                  {/* Display selected location details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={formData.location.address}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={formData.location.city}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={formData.location.state}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={formData.location.country}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input
                        value={formData.location.latitude}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input
                        value={formData.location.longitude}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Financial Details
                  </h2>
                  <FinancialDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Property Features & Analysis
                  </h2>
                  <BulletPointsGrid
                    highlights={highlights}
                    riskFactors={riskFactors}
                    additionalFeatures={additionalFeatures}
                    setHighlights={setHighlights}
                    setRiskFactors={setRiskFactors}
                    setAdditionalFeatures={setAdditionalFeatures}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Additional Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CommaInputField
                      label="Tax Benefits"
                      value={formData.tax_benefits || ""}
                      onChange={(value) => handleInputChange("tax_benefits", value)}
                      placeholder="Enter tax benefits, separated by commas"
                    />
                    <CommaInputField
                      label="Highlights"
                      value={formData.highlights || ""}
                      onChange={(value) => handleInputChange("highlights", value)}
                      placeholder="Enter highlights, separated by commas"
                    />
                    <CommaInputField
                      label="Market Analysis"
                      value={formData.market_analysis || ""}
                      onChange={(value) => handleInputChange("market_analysis", value)}
                      placeholder="Enter market analysis points, separated by commas"
                    />
                    <CommaInputField
                      label="Risk Factors"
                      value={formData.risk_factors || ""}
                      onChange={(value) => handleInputChange("risk_factors", value)}
                      placeholder="Enter risk factors, separated by commas"
                    />
                    <CommaInputField
                      label="Additional Features"
                      value={formData.additional_features || ""}
                      onChange={(value) => handleInputChange("additional_features", value)}
                      placeholder="Enter additional features, separated by commas"
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Documents & Images
                  </h2>
                  <UploadGrid
                    selectedFiles={selectedFiles}
                    selectedDocs={selectedDocs}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    uploadedFiles={uploadedFiles}
                    uploadedSize={uploadedSize}
                    totalUploadSize={totalUploadSize}
                    handleFileSelect={handleFileSelect}
                    handleDrop={handleDrop}
                    setSelectedFiles={setSelectedFiles}
                    setSelectedDocs={setSelectedDocs}
                    setPreviewUrl={setPreviewUrl}
                    setShowPreviewModal={setShowPreviewModal}
                  />
                </section>
              </div>

              <Button
                type="submit"
                disabled={isUploading || contractStatus.isPending}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isUploading || contractStatus.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Create Investment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Document Preview
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewUrl(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                className="w-full h-full min-h-[60vh] rounded-lg border border-gray-200 dark:border-gray-700"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInvestment;
