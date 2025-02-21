import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
// import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
import { useTransactionStatus } from "@/hooks/useTransactionStatus";
import BasicInformation from "@/components/property/form/BasicInformation";
import PricingInformation from "@/components/property/form/PricingInformation";
import PropertyFeatures from "@/components/property/form/PropertyFeatures";
import PropertyLocation from "@/components/property/form/PropertyLocation";
import ImageUploader from "@/components/property/form/ImageUploader";
import { handleImageUpload } from "@/utils/uploadUtils";
import { parseImagesData } from "@/utils/imageUtils";
import { tokenOptions } from "@/utils/constants";
import { findMatchingToken } from "@/utils/tokenMatching";
import { unpinImaged } from "@/hooks/services_hooks/pinata";
import { usePropertyWrite } from "@/hooks/contract_interactions/usePropertiesWrite";

const generateShortUUID = () => {
  const fullUUID = uuidv4();
  return fullUUID.replace(/-/g, "").substring(0, 21);
};

const PropertyForm = () => {
  const { id } = useParams();
  const { address, status } = useAccount();
  const { handleListSaleProperty, handleEditProperty, contractStatus } =
    usePropertyWrite();
  const { saleProperties, isLoading: isLoadingProperty } = usePropertyRead();
  const { properties: agentProperties } = useAgentProperties(address || "");
  const { checkTransaction } = useTransactionStatus();

  const [isUploading, setIsUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const initialFormData: Partial<Property> = {
    id: generateShortUUID(),
    agentId: address,
    interestedClients: 0,
    assetToken: tokenOptions[1].address,
    hasGarden: false,
    hasSwimmingPool: false,
    petFriendly: false,
    wheelchairAccessible: false,
    dateListed: Math.floor(Date.now() / 1000),
    status: "Available",
    currency: "USD",
  };

  const [formData, setFormData] = useState<Partial<Property>>(initialFormData);
  const [originalData, setOriginalData] =
    useState<Partial<Property>>(initialFormData);

  // Find existing property - combine both sources
  const existingProperty = React.useMemo(() => {
    if (!id) return undefined;
    return (
      (saleProperties || []).find((p: Property) => p.id === id) ||
      (agentProperties || []).find((p: Property) => p.id === id)
    );
  }, [id, saleProperties, agentProperties]);

  // Convert URLs to File objects for preview
  const convertUrlsToFiles = useCallback(async (urls: string[]) => {
    try {
      const filePromises = urls.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split("/").pop() || "image.jpg";
        return new File([blob], fileName, { type: blob.type });
      });
      return await Promise.all(filePromises);
    } catch (error) {
      console.error("Error converting URLs to files:", error);
      return [];
    }
  }, []);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Initialize form data and handle existing images
  useEffect(() => {
    const initializeProperty = async () => {
      if (id && existingProperty) {
        const matchingToken = findMatchingToken(existingProperty.assetToken);
        const initialData = {
          ...existingProperty,
          agentId: address,
          assetToken: matchingToken?.address || tokenOptions[1].address,
        };

        setFormData((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(initialData)) {
            return prev;
          }
          return initialData;
        });
        setOriginalData(initialData);

        if (existingProperty.imagesId) {
          const { imageUrls } = parseImagesData(existingProperty.imagesId);
          setUrl(existingProperty.imagesId);
          setExistingImages(imageUrls); // Store image hashes for deletion
          const files = await convertUrlsToFiles(imageUrls);
          setSelectedFiles(files);
        }
      } else if (status === "connected" && !formData.agentId) {
        const newData = {
          ...initialFormData,
          agentId: address,
        };
        setFormData(newData);
        setOriginalData(newData);
      }
    };

    initializeProperty();
  }, [id]);

  const validateNonNegativeNumber = (field: string, value: number): number => {
    if (value < 0) {
      toast.error(
        `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative`
      );
      return 0;
    }
    return value;
  };

  const handleInputChange = (field: keyof Property, value: any) => {
    let processedValue = value;

    if (["price", "interested_clients", "asking_price"].includes(field)) {
      processedValue = BigInt(value || 0);
    } else if (
      ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
    ) {
      const numValue = Number(value || 0);
      if (["bedrooms", "bathrooms", "parking_spaces"].includes(field)) {
        processedValue = validateNonNegativeNumber(field, numValue);
      } else {
        processedValue = numValue;
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: processedValue };
      // Check if the new value is different from the original
      setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
      return newData;
    });
  };

  const handleLocationSelect = (location: {
    latitude: string;
    longitude: string;
    address: string;
    city: string;
    state: string;
    country: string;
  }) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        locationAddress: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
      };
      setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
      return newData;
    });
  };

  const validateFiles = (files: File[]) => {
    return files.filter((file) => {
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
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newFiles = validateFiles(Array.from(files));
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      setHasChanges(true);
      return updatedFiles;
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    const newFiles = validateFiles(Array.from(files));
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      setHasChanges(true);
      return updatedFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!hasChanges && !selectedFiles.length) {
      toast.info("No changes to save");
      return;
    }

    const handlePropertyOperation = async (imageUrl?: string) => {
      try {
        if (!address) {
          toast.error("Agent ID is required");
          return;
        }

        if (id) {
          // Handle image deletion first if there are images to delete
          if (imagesToDelete.length > 0) {
            try {
              await Promise.all(
                imagesToDelete.map((hash) => unpinImaged(hash))
              );
              toast.success("Old images deleted successfully");
            } catch (error) {
              console.error("Error deleting old images:", error);
              toast.error("Failed to delete some old images");
            }
          }

          // Edit existing property
          const status = await handleEditProperty(id, {
            ...formData,
            agentId: address, // Ensure agentId is set
            imagesId: imageUrl || url,
          });

          if (status.status.status.isSuccess) {
            toast.success("Property updated successfully!");
            // Update the original data to match current form data
            const updatedData = {
              ...formData,
              agentId: address,
              imagesId: imageUrl || url,
            };
            setOriginalData(updatedData);
            setFormData(updatedData);
            setHasChanges(false);
            setImagesToDelete([]); // Clear the delete queue
          }
        } else {
          // Create new property
          const status = await handleListSaleProperty({
            ...formData,
            owner: address,
            agentId: address,
            imagesId: imageUrl || url,
          } as Property);

          const transactionStatus = await checkTransaction(
            status.status.response.transaction_hash
          );

          if (transactionStatus.isSuccess) {
            toast.success(`${transactionStatus.receipt}`);
          }

          if (status.status.status.isSuccess) {
            toast.success("Property created successfully!");
            setOriginalData(formData);
            setHasChanges(false);
          }
        }
        setSelectedFiles([]);
        setUploadProgress(0);
      } catch (error) {
        console.error("Error:", error);
        toast.error(`Failed to ${id ? "update" : "create"} property`);
      }
    };

    if (selectedFiles.length > 0 && !url) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const combinedString = await handleImageUpload(
          selectedFiles,
          formData.id
        );
        setUrl(combinedString);
        toast.success("Images uploaded successfully!");
        await handlePropertyOperation(combinedString);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    } else {
      await handlePropertyOperation();
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
  const handleDeleteImage = async (imageHash: string) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        // Add the image hash to the list of images to delete
        setImagesToDelete((prev) => [...prev, imageHash]);

        // Remove the corresponding file from selectedFiles
        const updatedFiles = selectedFiles.filter(
          (_, index) => !existingImages[index]?.includes(imageHash)
        );
        setSelectedFiles(updatedFiles);

        // Update existingImages array
        setExistingImages((prev) => prev.filter((hash) => hash !== imageHash));

        // Call the unpin function
        await unpinImaged(imageHash);
        toast.success("Image deleted successfully");
        setHasChanges(true);
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image");
      }
    }
  };

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
                existingImages={existingImages}
                onDeleteImage={handleDeleteImage}
              />

              <Button
                type="submit"
                disabled={
                  contractStatus.isPending ||
                  isUploading ||
                  (!hasChanges && !selectedFiles.length)
                }
                className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg font-medium
                  transform hover:scale-105 active:scale-95 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2"
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
                    {!hasChanges && !selectedFiles.length
                      ? "No Changes to Save"
                      : selectedFiles.length > 0
                      ? "Upload Images & Save Changes"
                      : id
                      ? "Save Changes"
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

export default PropertyForm;

// // import React, { useState, useEffect, useCallback } from "react";
// // import { useParams } from "react-router-dom";
// // import { useAccount } from "@starknet-react/core";
// // import { Property } from "@/types/property";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { toast } from "sonner";
// // import { v4 as uuidv4 } from "uuid";
// // import { Loader2 } from "lucide-react";
// // import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
// // import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
// // import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
// // import { useTransactionStatus } from "@/hooks/useTransactionStatus";
// // import BasicInformation from "@/components/property/form/BasicInformation";
// // import PricingInformation from "@/components/property/form/PricingInformation";
// // import PropertyFeatures from "@/components/property/form/PropertyFeatures";
// // import PropertyLocation from "@/components/property/form/PropertyLocation";
// // import ImageUploader from "@/components/property/form/ImageUploader";
// // import { handleImageUpload } from "@/utils/uploadUtils";
// // import { parseImagesData } from "@/utils/imageUtils";
// // import { tokenOptions } from "@/utils/constants";
// // import { findMatchingToken } from "@/utils/tokenMatching";

// // const generateShortUUID = () => {
// //   const fullUUID = uuidv4();
// //   return fullUUID.replace(/-/g, "").substring(0, 21);
// // };

// // const PropertyForm = () => {
// //   const { id } = useParams();
// //   const { address, status } = useAccount();
// //   const { handleListSaleProperty, handleEditProperty, contractStatus } =
// //     usePropertyCreate();
// //   const { saleProperties, isLoading: isLoadingProperty } = usePropertyRead();
// //   const { properties: agentProperties } = useAgentProperties(address || "");
// //   const { checkTransaction } = useTransactionStatus();

// //   const [isUploading, setIsUploading] = useState(false);
// //   const [url, setUrl] = useState("");
// //   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [isLocationLoading, setIsLocationLoading] = useState(false);

// //   const initialFormData: Partial<Property> = {
// //     id: generateShortUUID(),
// //     agentId: address,
// //     interestedClients: 0,
// //     assetToken: tokenOptions[1].address,
// //     hasGarden: false,
// //     hasSwimmingPool: false,
// //     petFriendly: false,
// //     wheelchairAccessible: false,
// //     dateListed: Math.floor(Date.now() / 1000),
// //     status: "Available",
// //     currency: "USD",
// //   };

// //   const [formData, setFormData] = useState<Partial<Property>>(initialFormData);

// //   // Find existing property - combine both sources
// //   const existingProperty = React.useMemo(() => {
// //     if (!id) return undefined;
// //     return (
// //       (saleProperties || []).find((p: Property) => p.id === id) ||
// //       (agentProperties || []).find((p: Property) => p.id === id)
// //     );
// //   }, [id, saleProperties, agentProperties]);

// //   // Convert URLs to File objects for preview
// //   const convertUrlsToFiles = useCallback(async (urls: string[]) => {
// //     try {
// //       const filePromises = urls.map(async (url) => {
// //         const response = await fetch(url);
// //         const blob = await response.blob();
// //         const fileName = url.split("/").pop() || "image.jpg";
// //         return new File([blob], fileName, { type: blob.type });
// //       });
// //       return await Promise.all(filePromises);
// //     } catch (error) {
// //       console.error("Error converting URLs to files:", error);
// //       return [];
// //     }
// //   }, []);

// //   // Initialize form data
// //   useEffect(() => {
// //     const initializeProperty = async () => {
// //       if (id && existingProperty) {
// //         const matchingToken = findMatchingToken(existingProperty.assetToken);

// //         setFormData({
// //           ...existingProperty,
// //           agentId: address,
// //           assetToken: matchingToken?.address || tokenOptions[1].address,
// //         });

// //         if (existingProperty.imagesId) {
// //           const { imageUrls } = parseImagesData(existingProperty.imagesId);
// //           setUrl(existingProperty.imagesId);
// //           const files = await convertUrlsToFiles(imageUrls);
// //           setSelectedFiles(files);
// //         }
// //       } else if (status === "connected") {
// //         setFormData((prev) => ({
// //           ...prev,
// //           agentId: address,
// //         }));
// //       }
// //     };

// //     initializeProperty();
// //   }, [id, existingProperty, address, status, convertUrlsToFiles]);

// //   const handleInputChange = (field: keyof Property, value: any) => {
// //     if (["price", "interested_clients", "asking_price"].includes(field)) {
// //       value = BigInt(value || 0);
// //     } else if (
// //       ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
// //     ) {
// //       value = Number(value || 0);
// //     }
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleLocationSelect = (location: {
// //     latitude: string;
// //     longitude: string;
// //     address: string;
// //     city: string;
// //     state: string;
// //     country: string;
// //   }) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       latitude: location.latitude,
// //       longitude: location.longitude,
// //       locationAddress: location.address,
// //       city: location.city,
// //       state: location.state,
// //       country: location.country,
// //     }));
// //   };

// //   const validateFiles = (files: File[]) => {
// //     return files.filter((file) => {
// //       if (!file.type.startsWith("image/")) {
// //         toast.error(`${file.name} is not an image file`);
// //         return false;
// //       }
// //       if (file.size > 10 * 1024 * 1024) {
// //         toast.error(`${file.name} is too large (max 10MB)`);
// //         return false;
// //       }
// //       return true;
// //     });
// //   };

// //   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = event.target.files;
// //     if (!files) return;
// //     const newFiles = validateFiles(Array.from(files));
// //     setSelectedFiles((prev) => [...prev, ...newFiles]);
// //   };

// //   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     const files = e.dataTransfer.files;
// //     if (!files) return;
// //     const newFiles = validateFiles(Array.from(files));
// //     setSelectedFiles((prev) => [...prev, ...newFiles]);
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!address) {
// //       toast.error("Please connect your wallet first");
// //       return;
// //     }

// //     const handlePropertyOperation = async (imageUrl?: string) => {
// //       try {
// //         if (id) {
// //           // Edit existing property
// //           const status = await handleEditProperty(id, {
// //             ...formData,
// //             imagesId: imageUrl || url,
// //           });
// //           if (status.status.status.isSuccess) {
// //             toast.success("Property updated successfully!");
// //           }
// //         } else {
// //           // Create new property
// //           const status = await handleListSaleProperty({
// //             ...formData,
// //             owner: address,
// //             agentId: address,
// //             imagesId: imageUrl || url,
// //           } as Property);

// //           const transactionStatus = await checkTransaction(
// //             status.status.response.transaction_hash
// //           );

// //           if (transactionStatus.isSuccess) {
// //             toast.success(`${transactionStatus.receipt}`);
// //           }

// //           if (status.status.status.isSuccess) {
// //             toast.success("Property created successfully!");
// //           }
// //         }
// //         setSelectedFiles([]);
// //         setUploadProgress(0);
// //       } catch (error) {
// //         console.error("Error:", error);
// //         toast.error(`Failed to ${id ? "update" : "create"} property`);
// //       }
// //     };

// //     if (selectedFiles.length > 0 && !url) {
// //       setIsUploading(true);
// //       setUploadProgress(0);
// //       try {
// //         const combinedString = await handleImageUpload(
// //           selectedFiles,
// //           formData.id
// //         );
// //         setUrl(combinedString);
// //         toast.success("Images uploaded successfully!");
// //         await handlePropertyOperation(combinedString);
// //       } catch (error) {
// //         console.error("Error:", error);
// //         toast.error("Failed to upload images");
// //       } finally {
// //         setIsUploading(false);
// //       }
// //     } else {
// //       await handlePropertyOperation();
// //     }
// //   };

// //   if (isLoadingProperty && id) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
// //         <div className="text-center space-y-4">
// //           <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
// //           <p className="text-gray-500">Loading property details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
// //       <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
// //         <Card className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
// //           <CardHeader className="space-y-2 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
// //             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
// //               {id ? "Edit Property" : "Create New Property"}
// //             </CardTitle>
// //             <p className="text-gray-500">
// //               Fill in the details to {id ? "update" : "list"} a property
// //             </p>
// //           </CardHeader>
// //           <CardContent className="pt-6 pb-8">
// //             <form onSubmit={handleSubmit} className="space-y-8">
// //               <BasicInformation
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //                 address={address}
// //               />
// //               <PricingInformation
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //               />
// //               <PropertyFeatures
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //               />
// //               <PropertyLocation
// //                 formData={formData}
// //                 handleInputChange={handleInputChange}
// //                 handleLocationSelect={handleLocationSelect}
// //                 isLocationLoading={isLocationLoading}
// //               />
// //               <ImageUploader
// //                 selectedFiles={selectedFiles}
// //                 isUploading={isUploading}
// //                 uploadProgress={uploadProgress}
// //                 handleFileSelect={handleFileSelect}
// //                 handleDrop={handleDrop}
// //                 setSelectedFiles={setSelectedFiles}
// //               />

// //               <Button
// //                 type="submit"
// //                 disabled={contractStatus.isPending || isUploading}
// //                 className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg font-medium
// //                   transform hover:scale-105 active:scale-95 transition-all duration-300
// //                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
// //                   flex items-center justify-center space-x-2"
// //               >
// //                 {isUploading || contractStatus.isPending ? (
// //                   <>
// //                     <Loader2 className="h-5 w-5 animate-spin" />
// //                     <span>
// //                       {isUploading
// //                         ? "Uploading Images..."
// //                         : `${id ? "Updating" : "Creating"} Property...`}
// //                     </span>
// //                   </>
// //                 ) : (
// //                   <span>
// //                     {selectedFiles.length > 0
// //                       ? "Upload Images & Create Property"
// //                       : id
// //                       ? "Update Property"
// //                       : "Create Property"}
// //                   </span>
// //                 )}
// //               </Button>
// //             </form>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PropertyForm;
// import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { useAccount } from "@starknet-react/core";
// import { Property } from "@/types/property";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";
// import { Loader2 } from "lucide-react";
// import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
// import { usePropertyRead } from "@/hooks/contract_interactions/usePropertiesReads";
// import { useAgentProperties } from "@/hooks/contract_interactions/usePropertiesReads";
// import { useTransactionStatus } from "@/hooks/useTransactionStatus";
// import BasicInformation from "@/components/property/form/BasicInformation";
// import PricingInformation from "@/components/property/form/PricingInformation";
// import PropertyFeatures from "@/components/property/form/PropertyFeatures";
// import PropertyLocation from "@/components/property/form/PropertyLocation";
// import ImageUploader from "@/components/property/form/ImageUploader";
// import { handleImageUpload } from "@/utils/uploadUtils";
// import { parseImagesData } from "@/utils/imageUtils";
// import { tokenOptions } from "@/utils/constants";
// import { findMatchingToken } from "@/utils/tokenMatching";

// const generateShortUUID = () => {
//   const fullUUID = uuidv4();
//   return fullUUID.replace(/-/g, "").substring(0, 21);
// };

// const PropertyForm = () => {
//   const { id } = useParams();
//   const { address, status } = useAccount();
//   const { handleListSaleProperty, handleEditProperty, contractStatus } =
//     usePropertyCreate();
//   const { saleProperties, isLoading: isLoadingProperty } = usePropertyRead();
//   const { properties: agentProperties } = useAgentProperties(address || "");
//   const { checkTransaction } = useTransactionStatus();

//   const [isUploading, setIsUploading] = useState(false);
//   const [url, setUrl] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isLocationLoading, setIsLocationLoading] = useState(false);
//   const [hasChanges, setHasChanges] = useState(false);

//   const initialFormData: Partial<Property> = {
//     id: generateShortUUID(),
//     agentId: address,
//     interestedClients: 0,
//     assetToken: tokenOptions[1].address,
//     hasGarden: false,
//     hasSwimmingPool: false,
//     petFriendly: false,
//     wheelchairAccessible: false,
//     dateListed: Math.floor(Date.now() / 1000),
//     status: "Available",
//     currency: "USD",
//   };

//   const [formData, setFormData] = useState<Partial<Property>>(initialFormData);
//   const [originalData, setOriginalData] =
//     useState<Partial<Property>>(initialFormData);

//   // Find existing property - combine both sources
//   const existingProperty = React.useMemo(() => {
//     if (!id) return undefined;
//     return (
//       (saleProperties || []).find((p: Property) => p.id === id) ||
//       (agentProperties || []).find((p: Property) => p.id === id)
//     );
//   }, [id, saleProperties, agentProperties]);

//   // Convert URLs to File objects for preview
//   const convertUrlsToFiles = useCallback(async (urls: string[]) => {
//     try {
//       const filePromises = urls.map(async (url) => {
//         const response = await fetch(url);
//         const blob = await response.blob();
//         const fileName = url.split("/").pop() || "image.jpg";
//         return new File([blob], fileName, { type: blob.type });
//       });
//       return await Promise.all(filePromises);
//     } catch (error) {
//       console.error("Error converting URLs to files:", error);
//       return [];
//     }
//   }, []);

//   // Initialize form data only once when component mounts or ID changes
//   useEffect(() => {
//     const initializeProperty = async () => {
//       // Only initialize if we haven't set data yet or if the ID has changed
//       if (id && existingProperty) {
//         const matchingToken = findMatchingToken(existingProperty.assetToken);
//         const initialData = {
//           ...existingProperty,
//           agentId: address,
//           assetToken: matchingToken?.address || tokenOptions[1].address,
//         };

//         // Only set initial data if it's different from current
//         setFormData((prev) => {
//           if (JSON.stringify(prev) === JSON.stringify(initialData)) {
//             return prev;
//           }
//           return initialData;
//         });
//         setOriginalData(initialData);

//         if (existingProperty.imagesId) {
//           const { imageUrls } = parseImagesData(existingProperty.imagesId);
//           setUrl(existingProperty.imagesId);
//           const files = await convertUrlsToFiles(imageUrls);
//           setSelectedFiles(files);
//         }
//       } else if (status === "connected" && !formData.agentId) {
//         const newData = {
//           ...initialFormData,
//           agentId: address,
//         };
//         setFormData(newData);
//         setOriginalData(newData);
//       }
//     };

//     initializeProperty();
//   }, [id]); // Only depend on ID changes

//   const validateNonNegativeNumber = (field: string, value: number): number => {
//     if (value < 0) {
//       toast.error(
//         `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative`
//       );
//       return 0;
//     }
//     return value;
//   };

//   const handleInputChange = (field: keyof Property, value: any) => {
//     let processedValue = value;

//     if (["price", "interested_clients", "asking_price"].includes(field)) {
//       processedValue = BigInt(value || 0);
//     } else if (
//       ["area", "bedrooms", "bathrooms", "parking_spaces"].includes(field)
//     ) {
//       const numValue = Number(value || 0);
//       if (["bedrooms", "bathrooms", "parking_spaces"].includes(field)) {
//         processedValue = validateNonNegativeNumber(field, numValue);
//       } else {
//         processedValue = numValue;
//       }
//     }

//     setFormData((prev) => {
//       const newData = { ...prev, [field]: processedValue };
//       // Check if the new value is different from the original
//       setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
//       return newData;
//     });
//   };

//   const handleLocationSelect = (location: {
//     latitude: string;
//     longitude: string;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//   }) => {
//     setFormData((prev) => {
//       const newData = {
//         ...prev,
//         latitude: location.latitude,
//         longitude: location.longitude,
//         locationAddress: location.address,
//         city: location.city,
//         state: location.state,
//         country: location.country,
//       };
//       setHasChanges(JSON.stringify(newData) !== JSON.stringify(originalData));
//       return newData;
//     });
//   };

//   const validateFiles = (files: File[]) => {
//     return files.filter((file) => {
//       if (!file.type.startsWith("image/")) {
//         toast.error(`${file.name} is not an image file`);
//         return false;
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         toast.error(`${file.name} is too large (max 10MB)`);
//         return false;
//       }
//       return true;
//     });
//   };

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files) return;
//     const newFiles = validateFiles(Array.from(files));
//     setSelectedFiles((prev) => {
//       const updatedFiles = [...prev, ...newFiles];
//       setHasChanges(true);
//       return updatedFiles;
//     });
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (!files) return;
//     const newFiles = validateFiles(Array.from(files));
//     setSelectedFiles((prev) => {
//       const updatedFiles = [...prev, ...newFiles];
//       setHasChanges(true);
//       return updatedFiles;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!address) {
//       toast.error("Please connect your wallet first");
//       return;
//     }

//     if (!hasChanges && !selectedFiles.length) {
//       toast.info("No changes to save");
//       return;
//     }

//     const handlePropertyOperation = async (imageUrl?: string) => {
//       try {
//         if (id) {
//           // Edit existing property
//           const status = await handleEditProperty(id, {
//             ...formData,
//             imagesId: imageUrl || url,
//           });
//           if (status.status.status.isSuccess) {
//             toast.success("Property updated successfully!");
//             // Update the original data to match current form data
//             const updatedData = { ...formData, imagesId: imageUrl || url };
//             setOriginalData(updatedData);
//             setFormData(updatedData);
//             setHasChanges(false);
//           }
//         } else {
//           // Create new property
//           const status = await handleListSaleProperty({
//             ...formData,
//             owner: address,
//             agentId: address,
//             imagesId: imageUrl || url,
//           } as Property);

//           const transactionStatus = await checkTransaction(
//             status.status.response.transaction_hash
//           );

//           if (transactionStatus.isSuccess) {
//             toast.success(`${transactionStatus.receipt}`);
//           }

//           if (status.status.status.isSuccess) {
//             toast.success("Property created successfully!");
//             setOriginalData(formData);
//             setHasChanges(false);
//           }
//         }
//         setSelectedFiles([]);
//         setUploadProgress(0);
//       } catch (error) {
//         console.error("Error:", error);
//         toast.error(`Failed to ${id ? "update" : "create"} property`);
//       }
//     };

//     if (selectedFiles.length > 0 && !url) {
//       setIsUploading(true);
//       setUploadProgress(0);
//       try {
//         const combinedString = await handleImageUpload(
//           selectedFiles,
//           formData.id
//         );
//         setUrl(combinedString);
//         toast.success("Images uploaded successfully!");
//         await handlePropertyOperation(combinedString);
//       } catch (error) {
//         console.error("Error:", error);
//         toast.error("Failed to upload images");
//       } finally {
//         setIsUploading(false);
//       }
//     } else {
//       await handlePropertyOperation();
//     }
//   };

//   if (isLoadingProperty && id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
//           <p className="text-gray-500">Loading property details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8">
//         <Card className="animate-fade-in shadow-lg hover:shadow-xl transition-all duration-300">
//           <CardHeader className="space-y-2 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
//             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//               {id ? "Edit Property" : "Create New Property"}
//             </CardTitle>
//             <p className="text-gray-500">
//               Fill in the details to {id ? "update" : "list"} a property
//             </p>
//           </CardHeader>
//           <CardContent className="pt-6 pb-8">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               <BasicInformation
//                 formData={formData}
//                 handleInputChange={handleInputChange}
//                 address={address}
//               />
//               <PricingInformation
//                 formData={formData}
//                 handleInputChange={handleInputChange}
//               />
//               <PropertyFeatures
//                 formData={formData}
//                 handleInputChange={handleInputChange}
//               />
//               <PropertyLocation
//                 formData={formData}
//                 handleInputChange={handleInputChange}
//                 handleLocationSelect={handleLocationSelect}
//                 isLocationLoading={isLocationLoading}
//               />
//               <ImageUploader
//                 selectedFiles={selectedFiles}
//                 isUploading={isUploading}
//                 uploadProgress={uploadProgress}
//                 handleFileSelect={handleFileSelect}
//                 handleDrop={handleDrop}
//                 setSelectedFiles={setSelectedFiles}
//               />

//               <Button
//                 type="submit"
//                 disabled={
//                   contractStatus.isPending ||
//                   isUploading ||
//                   (!hasChanges && !selectedFiles.length)
//                 }
//                 className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg font-medium
//                   transform hover:scale-105 active:scale-95 transition-all duration-300
//                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
//                   flex items-center justify-center space-x-2"
//               >
//                 {isUploading || contractStatus.isPending ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     <span>
//                       {isUploading
//                         ? "Uploading Images..."
//                         : `${id ? "Updating" : "Creating"} Property...`}
//                     </span>
//                   </>
//                 ) : (
//                   <span>
//                     {!hasChanges && !selectedFiles.length
//                       ? "No Changes to Save"
//                       : selectedFiles.length > 0
//                       ? "Upload Images & Save Changes"
//                       : id
//                       ? "Save Changes"
//                       : "Create Property"}
//                   </span>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default PropertyForm;
