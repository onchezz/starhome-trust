import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BasicInformation from "@/components/investment/BasicInformation";
import FinancialDetails from "@/components/investment/FinancialDetails";
import MarketAnalysis from "@/components/investment/MarketAnalysis";
import UploadGrid from "@/components/investment/UploadGrid";
import { parseImagesData } from "@/utils/imageUtils";
import { useAccount, useTransactionReceipt } from "@starknet-react/core";
import { tokenOptions } from "@/utils/constants";
import CommaInputField from "@/components/investment/CommaInputField";
import { findMatchingToken } from "@/utils/tokenMatching";
import { Heading1 } from "lucide-react";
import InvestmentFormHeader from "@/components/investment/InvestmentFormHeader";
import { useInvestmentWrite } from "@/hooks/contract_interactions/useInvestmentWrite";
import TransactionReceiptModal from "@/components/txmodal";
import TransactionWidget from "@/components/txmodal";

const EditInvestment = () => {
  const { id } = useParams();
  const location = useLocation();
  const { address } = useAccount();
  const { handleEditInvestmentProperty, status: contractStatus } =
    useInvestmentWrite();
  const navigate = useNavigate();
  // const [txhash, setTxHash] = useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const handleOpenModal = (hash: string) => {
    setTransactionHash(hash);
    setIsModalOpen(true);
  };

  // Get the investment data passed from the profile
  const investmentData: InvestmentAsset = location.state?.investmentData;
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
        const fileName = url.split("/").pop() || "image.jpg";
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
      const incomingInvestmentData = InvestmentAssetConverter.investmentAsset(
        investmentData as InvestmentAsset
      );
      console.log(
        "[EditInvestment] Setting initial form data:",
        incomingInvestmentData
      );

      const matchingToken = findMatchingToken(
        incomingInvestmentData.investment_token
      );

      console.log(
        `[EditInvestment from formdata token is ${incomingInvestmentData.investment_token}]`
      );

      console.log(
        `[EditInvestment token is ${matchingToken.symbol}] Matching token found:`,
        matchingToken.address
      );

      setFormData({
        ...incomingInvestmentData,
        investment_token: matchingToken?.address,
      });

      if (investmentData.images) {
        console.log(
          "[EditInvestment] Processing images:",
          investmentData.images
        );
        const { imageUrls } = parseImagesData(investmentData.images);
        console.log("[EditInvestment] Generated image URLs:", imageUrls);

        const files = await convertUrlsToFiles(imageUrls);
        setSelectedFiles(files);
      }
    };

    initializeInvestment();
  }, [investmentData, formData.id, convertUrlsToFiles, formData]);

  const handleInputChange = useCallback(
    (field: keyof InvestmentAsset, value: any) => {
      console.log(
        "[EditInvestment] Updating field:",
        field,
        "with value:",
        value
      );
      setFormData((prev: InvestmentAsset) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, isDocument: boolean) => {
      if (event.target.files) {
        const newFiles = Array.from(event.target.files);
        console.log("[EditInvestment] New files selected:", newFiles);
        if (isDocument) {
          setSelectedDocs((prev) => [...prev, ...newFiles]);
        } else {
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        }
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, isDocument: boolean) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        console.log("[EditInvestment] Files dropped:", droppedFiles);
        if (isDocument) {
          setSelectedDocs((prev) => [...prev, ...droppedFiles]);
        } else {
          setSelectedFiles((prev) => [...prev, ...droppedFiles]);
        }
      }
    },
    []
  );
  const waitForTransaction = async (hash: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkTransaction = async () => {
        try {
          console.log(`recevived tx ${hash} `);
          setTransactionHash(hash);
          console.log(`setted  tx ${transactionHash} `);

          // Add your transaction check logic here
          // Example: const status = await provider.getTransactionStatus(hash);
          // If confirmed, resolve()
          // If failed, reject(new Error("Transaction failed"))
          // If pending, setTimeout(checkTransaction, 2000)
        } catch (error) {
          reject(error);
        }
      };
      checkTransaction();
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("Investment ID is required");
      return;
    }

    try {
      // Ensure all required fields are present before submitting
      // const completeInvestmentData: InvestmentAsset =
      //   InvestmentAssetConverter.investmentAsset(formData as InvestmentAsset);

      const tx = await handleEditInvestmentProperty(id, {
        ...formData,
        property_price: formData.asset_value,
      } as InvestmentAsset);
      console.log(`tx data is ${tx.response.transaction_hash}`);
      if (tx.response?.transaction_hash) {
        const hash = tx.response.transaction_hash.toString();
        console.log(`Transaction hash received: ${hash}`);

        // Optional: Show transaction initiated toast
        toast.info("Transaction initiated. Waiting for confirmation...");

        // Wait for transaction confirmation
        await waitForTransaction(hash);

        // Transaction confirmed
        toast.success("Investment property updated successfully!");

        // Optional: Redirect or perform other actions after confirmation
        // navigate("/investment");
      } else {
        throw new Error("No transaction hash received");
      }

      if (tx.status.isSuccess) {
        console.log(`state trasacti data is ${transactionHash}`);
        // setIsModalOpen(true);
        setTransactionHash(tx.response.transaction_hash.toString());
        // navigate("/investment");
      }
      toast.success("Investment property updated successfully!");
      setTransactionHash("");
    } catch (error) {
      console.error("[EditInvestment] Error updating investment:", error);
      toast.error("Failed to update investment property");
    }
  };

  if (!investmentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-slate-900 dark:to-slate-800/90 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 my-10">
        <InvestmentFormHeader isEditing={true} name={formData.name} />
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
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Property Features & Analysis
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
                onChange={(value) =>
                  handleInputChange("market_analysis", value)
                }
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
                onChange={(value) =>
                  handleInputChange("additional_features", value)
                }
                placeholder="Enter additional features, separated by commas"
              />
            </div>
          </section>

          {/* <Card className="p-6">
          <MarketAnalysis 
            formData={formData} 
            handleInputChange={handleInputChange}
          />
        </Card> */}

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
          {transactionHash != "" ? (
            <div className="p-4 max-w-2xl">
              <TransactionWidget
                hash={transactionHash}
                onReset={() => {
                  console.log("Transaction reset");
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <Button
            type="submit"
            disabled={contractStatus.isPending}
            className="w-full"
          >
            {contractStatus.isPending
              ? "Updating Investment..."
              : "Update Investment"}
          </Button>
        </form>

        {/* <TransactionReceiptModal
          hash={transactionHash}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReset={() => {
            // Handle any additional reset logic
          }}
        /> */}
        {/* <TransactionStatusViewer hash={txhash} /> */}
      </div>
    </div>
  );
};

export default EditInvestment;

// const completeInvestmentData: InvestmentAsset = {
//   id: id,
//   name: formData.name,
//   description: formData.description,
//   is_active: formData.is_active,
//   location: {
//     address: formData.location.address,
//     city: formData.location.city,
//     state: formData.location.state,
//     country: formData.location.country,
//     latitude: formData.location.latitude,
//     longitude: formData.location.longitude,
//   },
//   size: formData.size,
//   investor_id: formData.investor_id,
//   owner: formData.owner,
//   construction_status: formData.construction_status,
//   asset_value: formData.asset_value,
//   available_staking_amount: formData.available_staking_amount,
//   investment_type: formData.investment_type,
//   construction_year: formData.construction_year,
//   property_price: formData.asset_value,
//   expected_roi: formData.expected_roi,
//   rental_income: formData.rental_income,
//   maintenance_costs: formData.maintenance_costs,
//   tax_benefits: formData.tax_benefits,
//   highlights: formData.highlights,
//   market_analysis: formData.market_analysis,
//   risk_factors: formData.risk_factors,
//   legal_detail: formData.legal_detail,
//   additional_features: formData.additional_features,
//   images: formData.images,
//   investment_token: formData.investment_token,
//   min_investment_amount: formData.min_investment_amount,

//   // ...(formData as InvestmentAsset),
//   // id: id, // Ensure id is included
// };
