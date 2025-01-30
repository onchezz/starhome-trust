import { pinataImageUrl } from "./constants";

export interface ParsedImageData {
  ipfsHash: string;
  imageNames: string[];
  imageUrls: string[];
}

/**
 * Parses a combined image ID string into its components and generates full URLs
 * @param imagesId Format: "ipfsHash,image1.jpg,image2.jpg"
 * @returns Object containing parsed data and generated URLs
 */
export const parseImagesData = (imagesId: string): ParsedImageData => {
  console.log("Parsing images data from:", imagesId);
  
  if (!imagesId) {
    console.warn("No imagesId provided");
    return {
      ipfsHash: "",
      imageNames: [],
      imageUrls: []
    };
  }

  const parts = imagesId.split(",");
  const ipfsHash = parts[0];
  const imageNames = parts.slice(1);

  console.log("Parsed IPFS hash:", ipfsHash);
  console.log("Parsed image names:", imageNames);

  const imageUrls = imageNames.map(imageName => 
    `${pinataImageUrl}${ipfsHash}/${imageName}`
  );

  console.log("Generated image URLs:", imageUrls);

  return {
    ipfsHash,
    imageNames,
    imageUrls
  };
};

/**
 * Generates a full Pinata URL for a single image
 * @param ipfsHash IPFS hash
 * @param imageName Image filename
 * @returns Full Pinata URL
 */
export const generatePinataUrl = (ipfsHash: string, imageName: string): string => {
  return `${pinataImageUrl}${ipfsHash}/${imageName}`;
};

/**
 * Combines IPFS hash and image names into a single string
 * @param ipfsHash IPFS hash
 * @param imageNames Array of image filenames
 * @returns Combined string format: "ipfsHash,image1.jpg,image2.jpg"
 */
export const combineImageData = (ipfsHash: string, imageNames: string[]): string => {
  return [ipfsHash, ...imageNames].join(",");
};