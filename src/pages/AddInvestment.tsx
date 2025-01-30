import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PinataSDK } from "pinata-web3";
import { Loader2 } from "lucide-react";

import BasicInformation from "@/components/investment/BasicInformation";
import FinancialDetails from "@/components/investment/FinancialDetails";
import { InvestmentAsset } from "@/types/investment";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertyWrite";
import InvestmentFormHeader from "@/components/investment/InvestmentFormHeader";
import UploadGrid from "@/components/investment/UploadGrid";
import BulletPointsGrid from "@/components/investment/BulletPointsGrid";
import { handleImageUpload } from "@/utils/imageUploadUtils";

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

  // State for bullet points
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  const generateShortUUID = () => {
    const fullUUID = crypto.randomUUID();
    return fullUUID.replace(/-/g, "").substring(0, 21);
  };

  const [formData, setFormData] = useState<Partial<InvestmentAsset>>({
    id: generateShortUUID(),
    owner: address,
    investor_id: address,
    is_active: true,
    investment_token: "",
    market_analysis: JSON.stringify({
      areaGrowth: "",
      occupancyRate: "",
      comparableProperties: "",
      demandTrend: "",
    }),
    legal_detail: "",
  });

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
      value = BigInt(value || 0).toString();
    } else if (field === "construction_year") {
      value = Number(value || 0);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    try {
      if (isDocuments) {
        const upload = await pinata.upload.fileArray(files).addMetadata({
          name: `investment-${formData.id}-docs`,
          keyValues: {
            type: "documents",
            propertyId: formData.id,
            uploadDate: new Date().toISOString(),
          },
        });
        
        handleInputChange("legal_detail", upload.IpfsHash);
      } else {
        const combinedString = await handleImageUpload(files, pinata, formData.id);
        handleInputChange("images", combinedString);
      }

      toast.success(
        `${isDocuments ? "Documents" : "Images"} uploaded successfully!`
      );
      return isDocuments ? formData.legal_detail : formData.images;
    } catch (error) {
      console.error(
        `Error uploading ${isDocuments ? "documents" : "images"}:`,
        error
      );
      toast.error(`Failed to upload ${isDocuments ? "documents" : "images"}`);
      throw error;
    }
  };

  const handleTest = async () => {
    const processedFormData = {
      ...formData,
      isActive: formData.is_active === true,
      additionalFeatures: additionalFeatures.join(","),
      riskFactors: riskFactors.join(","),
      highlights: highlights.join(","),
    };
    await handleListInvestmentProperty(processedFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    try {
      console.log("Form data before processing:", formData);
      
      // Convert values to strings while maintaining numeric validation
      const processedFormData = {
        ...formData,
        isActive: formData.is_active === true,
        additionalFeatures: additionalFeatures.join(","),
        riskFactors: riskFactors.join(","),
        highlights: highlights.join(","),
      };

      console.log("Submitting investment with processed data:", processedFormData);
      
      await handleListInvestmentProperty(processedFormData);

      toast.success("Investment created successfully!");
      setSelectedFiles([]);
      setSelectedDocs([]);
      setUploadProgress(0);
      setUploadedFiles(0);
      setUploadedSize(0);
      setTotalUploadSize(0);
      
    } catch (error) {
      console.error("Error creating investment:", error);
      // Error is already handled by usePropertyCreate hook
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
                onClick={handleTest}
                disabled={isUploading || contractStatus.isPending}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isUploading || contractStatus.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
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
