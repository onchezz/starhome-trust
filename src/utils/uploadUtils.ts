import { PinataSDK } from "pinata-web3";

export const handleImageUpload = async (
  files: File[],
  pinata: PinataSDK,
  propertyId: string
) => {
  if (files.length === 0) return "";

  try {
    const upload = await pinata.upload.fileArray(files).addMetadata({
      name: `property-${propertyId}-images`,
      keyValues: {
        propertyId: propertyId,
        uploadDate: new Date().toISOString(),
      },
    });

    // Create a string that combines IPFS hash and filenames
    const fileNames = files.map(file => file.name).join(",");
    const combinedString = `${upload.IpfsHash},${fileNames}`;

    console.log("Upload successful:", {
      ipfsHash: upload.IpfsHash,
      fileNames,
      combinedString
    });

    return combinedString;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};