import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { InvestmentAsset } from "@/types/investment";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BasicInformation from "@/components/investment/BasicInformation";
import FinancialDetails from "@/components/investment/FinancialDetails";
import MarketAnalysis from "@/components/investment/MarketAnalysis";
import UploadGrid from "@/components/investment/UploadGrid";
import { parseImagesData } from "@/utils/imageUtils";
import { useAccount } from "@starknet-react/core";
import { tokenOptions } from "@/utils/constants";

const EditInvestment = () => {
  const { id } = useParams();
  const location = useLocation();
  const { address } = useAccount();
  const { handleEditInvestmentProperty, contractStatus } = usePropertyCreate();

  // Get the investment data passed from the profile
  const investmentData = location.state?.investmentData;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalUploadSize, setTotalUploadSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState<Partial<InvestmentAsset>>({});

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
      console.log("[EditInvestment] Converted URLs to Files:", files);
      return files;
    } catch (error) {
      console.error("[EditInvestment] Error converting URLs to files:", error);
      return [];
    }
  }, []);

  // Initialize form data with investment data
  useEffect(() => {
    if (!investmentData || formData.id) return;

    const initializeInvestment = async () => {
      console.log("[EditInvestment] Setting initial form data:", investmentData);
      
      // Find the matching token option based on the saved investment token address
      const matchingToken = tokenOptions.find(token => 
        token.address.toLowerCase() === investmentData.investment_token.toLowerCase()
      );
      
      console.log("[EditInvestment] Matching token found:", matchingToken);

      setFormData({
        ...investmentData,
        investment_token: matchingToken?.address || ""
      });
      
      if (investmentData.images) {
        console.log("[EditInvestment] Processing images:", investmentData.images);
        const { imageUrls } = parseImagesData(investmentData.images);
        console.log("[EditInvestment] Generated image URLs:", imageUrls);
        
        const files = await convertUrlsToFiles(imageUrls);
        setSelectedFiles(files);
      }
    };

    initializeInvestment();
  }, [investmentData, formData.id, convertUrlsToFiles]);

  const handleInputChange = useCallback((field: keyof InvestmentAsset, value: any) => {
    console.log("[EditInvestment] Updating field:", field, "with value:", value);
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>, isDocument: boolean) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      console.log("[EditInvestment] New files selected:", newFiles);
      if (isDocument) {
        setSelectedDocs(prev => [...prev, ...newFiles]);
      } else {
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, isDocument: boolean) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      console.log("[EditInvestment] Files dropped:", droppedFiles);
      if (isDocument) {
        setSelectedDocs(prev => [...prev, ...droppedFiles]);
      } else {
        setSelectedFiles(prev => [...prev, ...droppedFiles]);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("Investment ID is required");
      return;
    }

    try {
      // Ensure all required fields are present before submitting
      const completeInvestmentData: InvestmentAsset = {
        ...formData as InvestmentAsset,
        id: id // Ensure id is included
      };

      await handleEditInvestmentProperty(id, completeInvestmentData);
      toast.success("Investment property updated successfully!");
    } catch (error) {
      console.error("[EditInvestment] Error updating investment:", error);
      toast.error("Failed to update investment property");
    }
  };

  if (!investmentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <BasicInformation 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        </Card>

        <Card className="p-6">
          <FinancialDetails 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        </Card>

        <Card className="p-6">
          <MarketAnalysis 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        </Card>

        <Card className="p-6">
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
        </Card>

        <Button 
          type="submit" 
          disabled={contractStatus.isPending}
          className="w-full"
        >
          {contractStatus.isPending ? "Updating Investment..." : "Update Investment"}
        </Button>
      </form>
    </div>
  );
};

export default EditInvestment;