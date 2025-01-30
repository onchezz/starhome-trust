import { PinataSDK } from "pinata-web3";
const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud",
});
export const handleImageUpload = async (
  files: File[],
  
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

export const handleFileUpload = async (
  files: File[],
  pinata: PinataSDK,
  propertyId: string,
  type: 'images' | 'documents'
) => {
  if (files.length === 0) return "";

  try {
    const upload = await pinata.upload.fileArray(files).addMetadata({
      name: `property-${propertyId}-${type}`,
      keyValues: {
        propertyId: propertyId,
        type: type,
        uploadDate: new Date().toISOString(),
      },
    });

    // Create a string that combines IPFS hash and filenames
    const fileNames = files.map(file => file.name).join(",");
    const combinedString = `${upload.IpfsHash},${fileNames}`;

    console.log(`${type} upload successful:`, {
      ipfsHash: upload.IpfsHash,
      fileNames,
      combinedString
    });

    return combinedString;
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    throw error;
  }
};

export const generateFileUrl = (ipfsHash: string, fileName: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}/${fileName}`;
};

export const parseIpfsData = (ipfsString: string): { 
  hash: string; 
  fileNames: string[];
  urls: string[];
} => {
  if (!ipfsString) {
    return { hash: '', fileNames: [], urls: [] };
  }

  const [hash, ...fileNames] = ipfsString.split(',');
  const urls = fileNames.map(fileName => generateFileUrl(hash, fileName));

  return {
    hash,
    fileNames,
    urls
  };
};