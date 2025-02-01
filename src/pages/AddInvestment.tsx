import React, { useState, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useLocation, useNavigate } from 'react-router-dom';

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});

// Move generateShortUUID function definition before its usage
const generateShortUUID = () => {
  const fullUUID = crypto.randomUUID();
  return fullUUID.replace(/-/g, "").substring(0, 21);
};

const AddInvestment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { handleListInvestmentProperty, handleEditInvestmentProperty, contractStatus } = usePropertyCreate();
  
  const editMode = location.state?.mode === 'edit';
  const initialInvestmentData = location.state?.investmentData;

  console.log("Initial investment data:", initialInvestmentData);

  const defaultLocation = {
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  };

  // Initialize form data with all fields
  const [formData, setFormData] = useState<InvestmentAsset>(
    editMode && initialInvestmentData 
      ? {
          ...initialInvestmentData,
          location: initialInvestmentData.location || defaultLocation,
          highlights: initialInvestmentData.highlights || "",
          risk_factors: initialInvestmentData.risk_factors || "",
          additional_features: initialInvestmentData.additional_features || "",
          tax_benefits: initialInvestmentData.tax_benefits || "",
          market_analysis: initialInvestmentData.market_analysis || "",
          rental_income: Number(initialInvestmentData.rental_income) || 0,
          maintenance_costs: Number(initialInvestmentData.maintenance_costs) || 0,
          min_investment_amount: Number(initialInvestmentData.min_investment_amount) || 0,
          investment_token: initialInvestmentData.investment_token || "",
          construction_status: initialInvestmentData.construction_status || "",
          size: Number(initialInvestmentData.size) || 0,
          is_active: initialInvestmentData.is_active ?? true,
          property_price: Number(initialInvestmentData.property_price) || 0,
          asset_value: Number(initialInvestmentData.asset_value) || 0,
          available_staking_amount: Number(initialInvestmentData.available_staking_amount) || 0,
          construction_year: Number(initialInvestmentData.construction_year) || new Date().getFullYear(),
          legal_detail: initialInvestmentData.legal_detail || "",
          images: initialInvestmentData.images || "",
          investment_type: initialInvestmentData.investment_type || "",
          expected_roi: initialInvestmentData.expected_roi || "",
          investor_id: initialInvestmentData.investor_id || address || "",
          owner: initialInvestmentData.owner || address || "",
        }
      : {
          id: generateShortUUID(),
          name: "",
          description: "",
          is_active: true,
          location: defaultLocation,
          size: 0,
          investor_id: address || "",
          owner: address || "",
          construction_status: "",
          asset_value: 0,
          available_staking_amount: 0,
          investment_type: "",
          construction_year: new Date().getFullYear(),
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
        }
  );

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
  const [uploadedImageHash, setUploadedImageHash] = useState<string | null>(null);
  const [uploadedDocHash, setUploadedDocHash] = useState<string | null>(null);
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [legalDetails, setLegalDetails] = useState<string[]>([]);

  const handleInputChange = (field: keyof InvestmentAsset, value: any) => {
    console.log(`Updating field ${field} with value:`, value);
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
    console.log("Location selected:", location);
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

  useEffect(() => {
    if (editMode && initialInvestmentData) {
      console.log("Setting initial values for arrays:", initialInvestmentData);
      setHighlights(initialInvestmentData.highlights?.split(',').filter(Boolean) || []);
      setRiskFactors(initialInvestmentData.risk_factors?.split(',').filter(Boolean) || []);
      setAdditionalFeatures(initialInvestmentData.additional_features?.split(',').filter(Boolean) || []);
      setLegalDetails(initialInvestmentData.legal_detail?.split(',').filter(Boolean) || []);
      
      // Set uploaded hashes if they exist
      if (initialInvestmentData.images) {
        setUploadedImageHash(initialInvestmentData.images);
      }
      if (initialInvestmentData.legal_detail) {
        setUploadedDocHash(initialInvestmentData.legal_detail);
      }
    }
  }, [editMode, initialInvestmentData]);

  const handleUploadFiles = async (
    files: File[],
    isDocuments: boolean = false
  ) => {
    if (isDocuments && uploadedDocHash) {
      return uploadedDocHash;
    }
    if (!isDocuments && uploadedImageHash) {
      return uploadedImageHash;
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalUploadSize((prev) => prev + totalSize);

    try {
      const result = await handleFileUpload(
        files,
        pinata,
        formData.id || "",
        isDocuments ? "documents" : "images"
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

    const requiredFields = [
      "tax_benefits",
      "highlights",
      "market_analysis",
      "risk_factors",
      "additional_features",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof InvestmentAsset]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    setIsUploading(true);
    try {
      let imagesHash = uploadedImageHash;
      if (selectedFiles.length > 0 && !uploadedImageHash) {
        imagesHash = await handleUploadFiles(selectedFiles, false);
      }

      let docsHash = uploadedDocHash;
      if (selectedDocs.length > 0 && !uploadedDocHash) {
        docsHash = await handleUploadFiles(selectedDocs, true);
      }

      const processedFormData: InvestmentAsset = {
        ...formData,
        is_active: true,
        additional_features: additionalFeatures.join(","),
        risk_factors: riskFactors.join(","),
        highlights: highlights.join(","),
        images: imagesHash || formData.images,
        legal_detail: docsHash || formData.legal_detail,
      };

      if (editMode) {
        await handleEditInvestmentProperty(formData.id, processedFormData);
        toast.success("Investment updated successfully!");
      } else {
        await handleListInvestmentProperty(processedFormData);
        toast.success("Investment created successfully!");
      }

      navigate('/profile');

    } catch (error) {
      toast.error(
        `Failed to ${editMode ? 'update' : 'create'} investment. Your uploads are saved and won't be repeated if you try again.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-slate-900 dark:to-slate-800/90 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="animate-fade-in backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-none shadow-xl">
          <CardHeader className="relative border-b dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {editMode ? 'Update Investment Property' : 'Create New Investment Property'}
              </CardTitle>
            </div>
          </CardHeader>
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
                    editMode={editMode}
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
                    editMode={editMode}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Property Features & Analysis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Investment Token</Label>
                      <Input
                        value={formData.investment_token}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <CommaInputField
                      label="Tax Benefits"
                      value={formData.tax_benefits || ""}
                      onChange={(value) => handleInputChange("tax_benefits", value)}
                      placeholder="Enter tax benefits, separated by commas"
                      disabled={editMode}
                    />
                    <CommaInputField
                      label="Highlights"
                      value={formData.highlights || ""}
                      onChange={(value) => handleInputChange("highlights", value)}
                      placeholder="Enter highlights, separated by commas"
                      disabled={editMode}
                    />
                    <CommaInputField
                      label="Market Analysis"
                      value={formData.market_analysis || ""}
                      onChange={(value) => handleInputChange("market_analysis", value)}
                      placeholder="Enter market analysis points, separated by commas"
                      disabled={editMode}
                    />
                    <CommaInputField
                      label="Risk Factors"
                      value={formData.risk_factors || ""}
                      onChange={(value) => handleInputChange("risk_factors", value)}
                      placeholder="Enter risk factors, separated by commas"
                      disabled={editMode}
                    />
                    <CommaInputField
                      label="Additional Features"
                      value={formData.additional_features || ""}
                      onChange={(value) => handleInputChange("additional_features", value)}
                      placeholder="Enter additional features, separated by commas"
                      disabled={editMode}
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
                  editMode ? "Update Investment" : "Create Investment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

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
